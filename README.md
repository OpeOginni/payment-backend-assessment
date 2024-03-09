# Payment API Assessment

### Stack

- ExpressJs
- Typescript
- Postgres
- DrizzleORM
- Docker

## Features

- [x] **Endpoints**: All endpoints are documented [here](https://documenter.getpostman.com/view/24109379/2sA2xh2Cg7)
- [x] **Input Validation**: Validation taken care by the `Zod` library.
- [x] **Error Handling**: Complete Error Handling throughout the server endpoints, using an error Handler function.
- [x] **Database Integration**: Postgres Database with Drizzle used as a typesafe ORM.
- [x] **Security Measures**: Sensitive data like User Passwords and Card CCV are hashed before storage.
- [x] **Logging**: Implemented Logging for Payment Transaction Actions.
- [x] **Testing**: Implementation tests for Payment Processing Logic.
- [x] **Tokenization Implementation**: Implemented middlewares that tokenize cards details before being used for payment logic.

## Local Setup

### Installation

After Clonning Repo, run the following command

```bash
npm install
```

### ENV Setup

Create equivalent `.env` file using the example variables in the `.env.example` file.

### Run Local Database

Use the `docker-compose.yml` to spin up a local postgresDB or use your personal one

```bash
 docker compose -f "docker-compose.yml" up -d --build
```

### Push Schema

```bash
 npm run db:migrate
```

### Run Dev Server

```bash
 npm run dev
```

## Run Test

```bash
 npm run test
```

> Note to have your Docker Daemon Running before running the test command.

> If you are making use of the current docker-compose file for testing, make sure that your `.env` vars are the same as the one in `.env.example`
