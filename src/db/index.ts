import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"

const databaseUrl = process.env.TURSO_DATABASE_URL


export const db = drizzle({
  connection: {
    url: databaseUrl || "libsql://zus-hackathon-michalbastrzyk.aws-eu-west-1.turso.io",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
  schema,
})
