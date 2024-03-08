import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema"
import dotenv from "dotenv";
import postgres from 'postgres';

dotenv.config();

const connectionString = process.env.DB_URL as string;

const db_user = process.env.DB_USER as string;
const db_password = process.env.DB_PASSWORD as string;
const db_host = process.env.DB_HOST as string;
const db_name = process.env.DB_NAME as string;

const db_port = Number(process.env.DB_PORT as string);

// const queryClient = postgres(connectionString);

export const queryClient = postgres({
    user: db_user,
    password: db_password,
    host: db_host,
    port: db_port,
    database: db_name
})

export const db = drizzle(queryClient, { schema });

// (async () => {
//     await migrate(db, { migrationsFolder: "drizzle" });
//     await sql.end();
// })();