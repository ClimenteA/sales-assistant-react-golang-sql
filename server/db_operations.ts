import { db } from "./db_config"
import { ContactsTable } from "./db_tables"
import { ParsedText } from "./dto"

// TODO
// check if already added and concat values
export async function saveContact(data: ParsedText) {
    try {
        const response = await db.insert(ContactsTable).values({ ...data }).returning()
        return response
    } catch (error) {
        console.error(error)
        return null
    }
}

// TODO
export async function findContactBySource(source: string) {
    try {
        return ""
    } catch (error) {
        console.error(error)
        return null
    }
}
