declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test"
}
declare class EnvironmentVariable {
    NODE_ENV: Environment;
    PORT: number;
    MONGO_DB_URL: string;
    GEMINI_API_KEY: string;
}
export declare function validateEnv(config: Record<string, unknown>): EnvironmentVariable;
export {};
