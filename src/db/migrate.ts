import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

dotenv.config();

const connectionString = process.env.DB_URL as string;

async function main() {

    const migrationClient = postgres(connectionString, { max: 1 });

    const migrateDB = drizzle(migrationClient);

    // This will run migrations on the database, skipping the ones already applied
    await migrate(migrateDB, { migrationsFolder: './drizzle' });

    console.log("MIGRATION COMPLETED")

    // Don't forget to close the connection, otherwise the script will hang
    await migrationClient.end();
}

main()
