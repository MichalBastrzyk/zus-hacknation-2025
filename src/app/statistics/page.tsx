import {
  getAccidentSeverityStatistics,
  getAccidentTypeStatistics,
  getReportStatusStatistics,
} from "@/db/dbHelpers/getAccidentStatistics"
import { AccidentChart, StatsSummaryCard } from "@/app/statistics/_charts"

export default async function StatisticsPage() {
  const [accidentTypeData, severityData, statusData] = await Promise.all([
    getAccidentTypeStatistics(),
    getAccidentSeverityStatistics(),
    getReportStatusStatistics(),
  ])

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Statystyki wypadków</h1>
        <p className="text-gray-600">Analiza wypadków przy pracy w systemie</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AccidentChart
          title="Typ wypadku"
          description="Rozkład wypadków według typu"
          data={accidentTypeData}
          dataKey="name"
        />
        <AccidentChart
          title="Ciężkość wypadku"
          description="Rozkład wypadków według ciężkości"
          data={severityData}
          dataKey="name"
        />
        <AccidentChart
          title="Status raportu"
          description="Rozkład raportów według statusu"
          data={statusData}
          dataKey="name"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsSummaryCard
          title="Razem wypadków"
          value={accidentTypeData.reduce((sum, item) => sum + item.value, 0)}
          color="bg-blue-50 text-blue-900"
        />
        <StatsSummaryCard
          title="Wypadki ciężkie"
          value={severityData.find((d) => d.name === "Ciężki")?.value || 0}
          color="bg-orange-50 text-orange-900"
        />
        <StatsSummaryCard
          title="Raporty zaakceptowane"
          value={statusData.find((d) => d.name === "Zaakceptowany")?.value || 0}
          color="bg-green-50 text-green-900"
        />
      </div>
    </div>
  )
}
