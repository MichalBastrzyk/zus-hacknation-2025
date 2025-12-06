import { getAccidentSeverityStatistics } from "@/src/db/dbHelpers/getAccidentStatistics"

export async function GET() {
    try {
        const data = await getAccidentSeverityStatistics()
        return Response.json(data)
    } catch (error) {
        console.error("Error fetching accident severity statistics:", error)
        return Response.json(
            { error: "Failed to fetch statistics" },
            { status: 500 }
        )
    }
}
