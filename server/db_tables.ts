import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const ContactsTable = sqliteTable("ContactsTable", {
    id: integer("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    selectedtext: text("selectedtext").notNull(),
    status: text("status").notNull(),
    phone: text("phone").notNull(),
    mentions: text("mentions").notNull(),
    source: text("source").notNull()
})
