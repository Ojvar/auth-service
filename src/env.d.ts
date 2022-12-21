declare namespace NodeJS {
  interface ProcessEnv {
    REDIS_DB: number;
    REDIS_PORT: number;
    REDIS_HOST: string;
    REDIS_PASSWORD: string;

    AZURE_CLOUD_INSTANCE: string;
    AZURE_CLIENT_ID: string;
    AZURE_TENANT_ID: string;
    AZURE_CLIENT_SECRET: string;
    AZURE_REDIRECT_URI: string;
  }
}
