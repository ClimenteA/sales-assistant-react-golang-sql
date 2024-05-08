import { existsSync, mkdirSync } from 'node:fs'
import { Database } from 'bun:sqlite'
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import * as tables from './db_tables'

if (!existsSync("./data")) mkdirSync("./data")

const sqlite = new Database("./data/database.db")

export const db = drizzle(sqlite, { schema: { ...tables } })

try {
    console.info("Migrating tables...")
    migrate(db, { migrationsFolder: "./server/migrations" })
    console.info("Migrations were successfull!")
} catch (error) {
    console.warn("Failed to make migrations. Make sure you've run npm run db:migrations first.")
}
