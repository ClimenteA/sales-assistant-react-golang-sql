import { existsSync, mkdirSync } from 'node:fs'
import { Database } from 'bun:sqlite'
import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import * as tables from './db_tables'

if (!existsSync("./data")) mkdirSync("./data")

const sqlite = new Database("./data/database.db")

export const db = drizzle(sqlite, { schema: { ...tables } })

migrate(db, { migrationsFolder: "./server/migrations" })
