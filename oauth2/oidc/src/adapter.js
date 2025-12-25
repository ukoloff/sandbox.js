import { join } from 'node:path'
import knex from 'knex'

export default async function connect() {
  let db = knex({
    client: 'sqlite3',
    connection: {
      filename: join(import.meta.dirname, '../.db/adapter.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: join(import.meta.dirname, 'migrations')
    },
  })
  await db.migrate.latest()
}
