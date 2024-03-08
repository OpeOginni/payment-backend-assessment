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
- [x] **Error Handling**: Complete Error Handling throughout the server.
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
 npm run db:push
```

### Run Dev Server

```bash
 npm run dev
```

## Test Command

### Run Test

```bash
 npm run test
```
