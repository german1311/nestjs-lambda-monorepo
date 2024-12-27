module.exports = {
    moduleFileExtensions: ["js", "json", "ts"],
    testRegex: ".*\\.spec\\.ts$",
    transform: {
        "^.+\\.(t|j)s$": "ts-jest",
    },
    collectCoverageFrom: [
        "**/*.(t|j)s",
        "!dist/**",
        "!.aws-sam/**",
        "!.scripts/**",
        "!test/**",
        "!.eslintrc.js",
        "!jest.config.js",
        "!**/src/main.ts",
        "!**/src/main.module.ts",
        "!src/common/utils/bootstrapServer.ts",
        "!**/src/**/serverless.ts",
        "!src/**/*.module.ts",
    ],
    coverageDirectory: "../coverage",
    testEnvironment: "node",
    coverageThreshold: {
        global: {
            branches: 50,
            functions: 50,
            lines: 62,
            statements: 60,
        },
    },
    moduleNameMapper: {
        "^src/(.*)$": "<rootDir>/src/$1",
        "^@shared/(.*)$": "<rootDir>/libs/shared/src/$1",
    },
    testPathIgnorePatterns: [
        "<rootDir>/node_modules/",
        "<rootDir>/dist/",
        "<rootDir>/.aws-sam/",
        "<rootDir>/.eslintrc.js",
    ],
};
