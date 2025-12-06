import { getReportStatusStatistics } from "@/src/db/dbHelpers/getAccidentStatistics"

export async function GET() {
    try {
        const data = await getReportStatusStatistics()
        return Response.json(data)
    } catch (error) {
        console.error("Error fetching report status statistics:", error)
        return Response.json(
            { error: "Failed to fetch statistics" },
            { status: 500 }
        )
    }
}
