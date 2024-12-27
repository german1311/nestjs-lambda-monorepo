## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

Set the `.env` file with the correct values

```.env
MONGODB_URL='mongodb://.....'
MONGODB_CA='/path/to/the/cert/global-bundle.pem'
```

```bash
# development backend-backoffice or backend-mobile
$ yarn run start backend-backoffice

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Development

This project uses [nestjs-lambda](https://github.com/nestjs/nest-lambda) to deploy the lambdas.
and [serverless-express](https://github.com/vendia/serverless-express) to deploy the express server.

The structure of the project is as monorepo, with the following structure:
apps/backend-backoffice
apps/backend-mobile
libs/parca-services

More about the structure [here](https://docs.nestjs.com/cli/monorepo)

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

### SAM local

Modify the `template.yml` file to use the correct environment variables.

```.env
...
DOCUMENT_DB_SECRET_NAME: !Sub "ovg-${stage}-global-documentdb-secret" // make the name of the secret available for local development
NODE_ENV: development // to show logs in the console
```

build the project
`yarn build backend-backoffice` or `yarn buildbackend-mobile`

```bash
// backend-backoffice
$ yarn build backend-backoffice && sam build && sam local start-api -p 13039 --host 0.0.0.0
```

## CI/CD

### Gitlab actions

Unit testing and linting are performed using Gitlab actions.

```bash
$ yarn
$ yarn lint
$ yarn test:cov
```

### SAM deployment

Step 1: Build the project

```bash
$ yarn
$ yarn build <project>
```

Step 2: Build the project for SAM

```bash
$ sam build
```

Step 3: Deploy the stack

```bash
$ sam deploy
```

# TODO

Run the git hooks in sync mode
