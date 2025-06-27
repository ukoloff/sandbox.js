import "./util/env.js"
import sql from "./util/sql.js"

console.log("Hello, world!")

let db = await sql()
let result = await db.request()
  .query(`
    With
      ${sql.pages},
      ${sql.spaces},
      ${sql.pagez()}
    Select
      Count(*) as N
    From pagez
    `)
console.log(result.recordset[0]['N'])

await db.close()
