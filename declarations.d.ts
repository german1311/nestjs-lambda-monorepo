declare namespace NodeJS {
    export interface ProcessEnv {
        MONGODB_URL: string;
        MONGODB_CA: string;
        PRODUCT: string;
    }
}
