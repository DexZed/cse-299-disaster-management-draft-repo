export default () => {
  const isDev = process.env.NODE_ENV === 'development';
  return {
    port: parseInt(process.env.PORT as string, 10) || (isDev ? 3000 : 80),
    database: {
      URL: process.env.MONGO_DB_URL,
    },
  };
};
