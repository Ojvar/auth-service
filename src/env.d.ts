declare namespace NodeJS {
  interface ProcessEnv {
    REDIS_DB: number;
    REDIS_PORT: number;
    REDIS_HOST: string;
    REDIS_PASSWORD: string;

    MSGRAPH_CLIENT_ID: string;
    MSGRAPH_TENANT_ID: string;
    MSGRAPH_CLIENT_SECRET: string;
    MSGRAPH_REDIRECT_URI: string;
    MSGRAPH_SCOPE: string;
  }
}
