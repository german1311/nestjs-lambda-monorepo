import { getMongooseConnectionModule } from "../dbUtils";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigUtil } from "../configUtil";
import { Logger } from "@nestjs/common";
import { promises as fsPromises } from "fs";
import * as path from "path";
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

jest.mock("@nestjs/mongoose", () => ({
    MongooseModule: {
        forRootAsync: jest.fn(),
    },
}));

jest.mock("../configUtil", () => ({
    ConfigUtil: {
        get: jest.fn(),
        isLambdaEnvironment: jest.fn(),
    },
}));

jest.mock("@nestjs/common", () => ({
    Logger: {
        debug: jest.fn(),
    },
}));

jest.mock("path", () => ({
    join: jest.fn(),
}));

jest.mock("fs", () => ({
    promises: {
        readFile: jest.fn(),
    },
}));

jest.mock("@aws-sdk/client-secrets-manager", () => ({
    SecretsManagerClient: jest.fn(),
    GetSecretValueCommand: jest.fn(),
}));

describe("getMongooseConnectionModule", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should use MONGODB_URL and MONGODB_CA from environment for local development", async () => {
        (ConfigUtil.get as jest.Mock)
            .mockReturnValueOnce("mongodb://localUri") // MONGODB_URL
            .mockReturnValueOnce("/path/to/local/ca"); // MONGODB_CA
        (ConfigUtil.isLambdaEnvironment as jest.Mock).mockReturnValue(false);

        getMongooseConnectionModule();

        const useFactory = (MongooseModule.forRootAsync as jest.Mock).mock
            .calls[0][0].useFactory;
        const config = await useFactory();

        expect(config).toEqual({
            uri: "mongodb://localUri",
            ssl: true,
            tlsCAFile: "/path/to/local/ca",
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            autoIndex: false,
        });
    });

    it("should load certificate and connection string from AWS Secrets Manager in Lambda environment", async () => {
        (ConfigUtil.get as jest.Mock)
            .mockReturnValueOnce(undefined) // MONGODB_URL
            .mockReturnValueOnce(undefined) // MONGODB_CA
            .mockReturnValueOnce("documentdb-certs-key") //DOCUMENTDB_CERTS_KEY_NAME
            .mockReturnValueOnce("secret"); // DOCUMENT_DB_SECRET_NAME from getConnectionStringAsync
        (ConfigUtil.isLambdaEnvironment as jest.Mock).mockReturnValue(true);
        (path.join as jest.Mock).mockReturnValue("/opt/documentdb-certs-key");
        (fsPromises.readFile as jest.Mock).mockResolvedValueOnce("certificate");

        (SecretsManagerClient as jest.Mock).mockImplementationOnce(() => ({
            send: jest.fn().mockResolvedValueOnce({
                SecretString: JSON.stringify({
                    dbClusterIdentifier: "cluster",
                    password: "password",
                    engine: "engine",
                    port: "port",
                    host: "host",
                    ssl: "string",
                    username: "username",
                }),
            }),
        }));

        getMongooseConnectionModule();

        const useFactory = (MongooseModule.forRootAsync as jest.Mock).mock
            .calls[0][0].useFactory;

        const config = await useFactory();

        expect(path.join).toHaveBeenCalledWith("/opt", "documentdb-certs-key");
        expect(Logger.debug).toHaveBeenCalledWith(
            "Certificate loaded: true, DB_URL loaded: true",
        );
        expect(config).toEqual({
            uri: "mongodb://username:password@host:port/cluster?replicaSet=rs0&tls=true&retryWrites=false",
            ssl: true,
            tlsCAFile: "/opt/documentdb-certs-key",
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            autoIndex: false,
        });
    });
});
