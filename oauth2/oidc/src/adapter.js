import { join } from 'node:path'
import knex from 'knex'
import knexAdapter from './knex.js'

function connect() {
  return knex({
    client: 'sqlite3',
    connection: {
      filename: join(import.meta.dirname, '../.db/adapter.db')
    },
    useNullAsDefault: true,
    migrations: {
      directory: join(import.meta.dirname, 'migrations')
    },
  })
}

export default async function adapter() {
  let db = connect()
  await db.migrate.latest()
  return knexAdapter(db)
}
