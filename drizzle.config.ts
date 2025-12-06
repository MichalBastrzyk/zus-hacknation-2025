import { defineConfig } from "drizzle-kit"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const databaseUrl = process.env.TURSO_DATABASE_URL
const authToken = process.env.TURSO_AUTH_TOKEN

if (!databaseUrl) {
  console.log("TURSO_DATABASE_URL is not set")
  throw new Error(
    "TURSO_DATABASE_URL environment variable is not set. Please check your .env.local file."
  )
}

if (!authToken) {
  console.log("TURSO_AUTH_TOKEN is not set")

  throw new Error(
    "TURSO_AUTH_TOKEN environment variable is not set. Please check your .env.local file."
  )
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL || "libsql://zus-hackathon-michalbastrzyk.aws-eu-west-1.turso.io",
    authToken: process.env.TURSO_AUTH_TOKEN || "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NjUwMjYwNzQsImlkIjoiYmVmZTU0NmEtMjU1OS00OWVmLTkxMGQtOTQ4NTFlYmQxOTEwIiwicmlkIjoiODM3MWMxYzctZjlhNy00MjAwLWE5MTMtNGYyYjUxMjI0M2QyIn0.SGzAqyPCAyUqVekYldTzsTTYwJ5X8Q-vhi0h3v0i90NoYFUFF6yWJvem2I8Tpzdv641SxP8c0eCd-SMZ0YdPDA",
  },
})
