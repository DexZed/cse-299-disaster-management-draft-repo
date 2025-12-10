import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
  const { httpAdapter } = this.httpAdapterHost;
  const ctx = host.switchToHttp();
  const request = ctx.getRequest();
  const response = ctx.getResponse();

  let status = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = 'Internal server error';
  let errorType = exception?.constructor?.name ?? 'UnknownError';
  let details: any = null;

  if (exception instanceof HttpException) {
    status = exception.getStatus();
    const responseData = exception.getResponse();

    if (typeof responseData === 'string') {
      message = responseData;
    } else if (typeof responseData === 'object' && responseData !== null) {
      message = (responseData as any).message ?? message;
      details = responseData;
    }
  } else if (exception instanceof Error) {
    message = exception.message;
    details = {
      stack: exception.stack, // remove in prod 😅
    };
  }

  const responseBody: any = {
    statusCode: status,
    message,
    errorType,
    timestamp: new Date().toISOString(),
    path: request.url,
  };

  // ✅ Only attach request info for 400 errors
  if (
  status === HttpStatus.BAD_REQUEST ||
  (status >= 500 && status < 600)
) {
  responseBody.request = {
    method: request.method,
    url: request.url,
    headers: request.headers, // optional but very useful in 5XX chaos
    body: process.env.NODE_ENV === 'production' ? null : request.body,       // ⚠️ be careful with PII in prod
  };
}

  if (details) {
    responseBody.details = details;
  }

  console.error('❌ Exception caught:', {
    type: errorType,
    status,
    message,
    method: request.method,
    url: request.url,
    stack: exception instanceof Error ? exception.stack : null,
  });

  httpAdapter.reply(response, responseBody, status);
}

}
