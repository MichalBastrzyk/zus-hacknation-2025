import { getAccidentTypeStatistics } from "@/src/db/dbHelpers/getAccidentStatistics"

export async function GET() {
    try {
        const data = await getAccidentTypeStatistics()
        return Response.json(data)
    } catch (error) {
        console.error("Error fetching accident type statistics:", error)
        return Response.json(
            { error: "Failed to fetch statistics" },
            { status: 500 }
        )
    }
}
