import { MongooseModule } from "@nestjs/mongoose";
import {
    SecretsManagerClient,
    GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import { ConfigUtil } from "./configUtil";
import { DynamicModule, Logger } from "@nestjs/common";
import { promises as fsPromises } from "fs";
import * as path from "path";

/**
 * Read certificate file asynchronously
 * @param certPath The cert path
 * @returns Cert content
 */
async function loadCertificateAsync(certPath: string): Promise<Buffer> {
    // Implementation to read certificate file asynchronously
    try {
        const cert = await fsPromises.readFile(certPath);
        return cert;
    } catch (error) {
        console.error(`Failed to load certificate from ${certPath}`, error);
        throw new Error(`Failed to load certificate from ${certPath}`);
    }
}

/**
 * Get connection string asynchronously, requires the env "DOCUMENT_DB_SECRET_NAME" to be set
 * @returns Connection string
 */
async function getConnectionStringAsync(): Promise<string> {
    // Get the connection string from AWS Secrets Manager
    try {
        const secretManagerClient = new SecretsManagerClient();
        const secretId = ConfigUtil.get("DOCUMENT_DB_SECRET_NAME");
        const secretValue = await secretManagerClient.send(
            new GetSecretValueCommand({
                SecretId: secretId,
            }),
        );
        Logger.debug("secretValue", { secretValue });

        const connection = JSON.parse(secretValue.SecretString) as {
            dbClusterIdentifier: string;
            password: string;
            engine: string;
            port: string;
            host: string;
            ssl: string;
            username: string;
        };

        Logger.debug("Config loaded", { connection });
        const password = encodeURIComponent(connection.password);
        const DB_URL = `mongodb://${connection.username}:${password}@${connection.host}:${connection.port}/${connection.dbClusterIdentifier}?replicaSet=rs0&tls=true&retryWrites=false`;
        Logger.debug("result ", { DB_URL });
        return DB_URL;
    } catch (error) {
        Logger.error("Error get connection string", error);
        throw new Error("Error get connection string");
    }
}

/**
 * Create Mongoose connection module for NestJs
 * If the environment is Lambda, it will load the certificate and connection string from AWS Secrets Manager
 * Otherwise, it will use the MONGODB_URL and MONGODB_CA from the environment
 * @returns {DynamicModule} Mongoose connection module
 */
export function getMongooseConnectionModule(): DynamicModule {
    return MongooseModule.forRootAsync({
        useFactory: async () => {
            // by default use the MONGODB_URL from the environment for local development
            let dbUri = ConfigUtil.get("MONGODB_URL", false);
            let tlsCAFile = ConfigUtil.get("MONGODB_CA", false);

            if (ConfigUtil.isLambdaEnvironment()) {
                const key = ConfigUtil.get("DOCUMENTDB_CERTS_KEY_NAME");
                const certPath = key ? path.join("/opt", key) : "";
                // Load configuration and certificates asynchronously
                const [cert, DB_URL] = await Promise.all([
                    loadCertificateAsync(certPath),
                    getConnectionStringAsync(),
                ]);

                Logger.debug(
                    `Certificate loaded: ${!!cert}, DB_URL loaded: ${!!DB_URL}`,
                );

                dbUri = DB_URL;
                tlsCAFile = certPath;
            }

            return {
                uri: dbUri,
                ssl: true,
                tlsCAFile: tlsCAFile,
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 10000, // 10 seconds
                socketTimeoutMS: 45000, // 45 seconds
                autoIndex: false,
            };
        },
    });
}
