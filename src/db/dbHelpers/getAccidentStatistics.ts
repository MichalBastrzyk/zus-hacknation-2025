import { db } from "../index"
import {
  accidents,
  ACCIDENT_TYPES,
  ACCIDENT_SEVERITIES,
  REPORT_STATUSES,
} from "../schema"

export interface StatisticData {
  name: string
  value: number
  fill: string
}

// Default data matching the demo accidents
const DEFAULT_ACCIDENTS = [
  {
    type: ACCIDENT_TYPES[1],
    severity: ACCIDENT_SEVERITIES[2],
    status: REPORT_STATUSES[1],
  },
  {
    type: ACCIDENT_TYPES[2],
    severity: ACCIDENT_SEVERITIES[1],
    status: REPORT_STATUSES[2],
  },
  {
    type: ACCIDENT_TYPES[0],
    severity: ACCIDENT_SEVERITIES[2],
    status: REPORT_STATUSES[2],
  },
  {
    type: ACCIDENT_TYPES[1],
    severity: ACCIDENT_SEVERITIES[0],
    status: REPORT_STATUSES[1],
  },
  {
    type: ACCIDENT_TYPES[2],
    severity: ACCIDENT_SEVERITIES[1],
    status: REPORT_STATUSES[3],
  },
  {
    type: ACCIDENT_TYPES[0],
    severity: ACCIDENT_SEVERITIES[0],
    status: REPORT_STATUSES[2],
  },
]

export async function getAccidentTypeStatistics(): Promise<StatisticData[]> {
  try {
    const colors = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981"]
    const labels: Record<string, string> = {
      przy_pracy: "Przy pracy",
      w_drodze_do_pracy: "W drodze do pracy",
      w_drodze_z_pracy: "W drodze z pracy",
    }

    const result = await db
      .select({
        type: accidents.accidentType,
      })
      .from(accidents)

    // Use database results if available, otherwise use default data
    const dataToAggregate = result.length > 0 ? result : DEFAULT_ACCIDENTS

    const aggregated = ACCIDENT_TYPES.map((type) => ({
      name: labels[type] || type,
      value: dataToAggregate.filter((r) => r.type === type).length,
      fill: colors[ACCIDENT_TYPES.indexOf(type)],
    }))

    // Filter out types with 0 accidents
    return aggregated.filter((item) => item.value > 0)
  } catch (error) {
    console.error("Error fetching accident type statistics:", error)
    // Fallback to default data on error
    const colors = ["#3b82f6", "#ef4444", "#f59e0b", "#10b981"]
    const labels: Record<string, string> = {
      przy_pracy: "Przy pracy",
      w_drodze_do_pracy: "W drodze do pracy",
      w_drodze_z_pracy: "W drodze z pracy",
    }

    return ACCIDENT_TYPES.map((type, idx) => ({
      name: labels[type] || type,
      value: DEFAULT_ACCIDENTS.filter((a) => a.type === type).length,
      fill: colors[idx],
    })).filter((item) => item.value > 0)
  }
}

export async function getAccidentSeverityStatistics(): Promise<
  StatisticData[]
> {
  try {
    const colors = ["#60a5fa", "#fb923c", "#f87171", "#a78bfa"]
    const labels: Record<string, string> = {
      lekki: "Lekki",
      ciezki: "Ciężki",
      smiertelny: "Śmiertelny",
      zbiorowy: "Zbiorowy",
    }

    const result = await db
      .select({
        severity: accidents.accidentSeverity,
      })
      .from(accidents)

    // Use database results if available, otherwise use default data
    const dataToAggregate = result.length > 0 ? result : DEFAULT_ACCIDENTS

    const aggregated = ACCIDENT_SEVERITIES.map((severity) => ({
      name: labels[severity] || severity,
      value: dataToAggregate.filter((r) => r.severity === severity).length,
      fill: colors[ACCIDENT_SEVERITIES.indexOf(severity)],
    }))

    // Filter out severities with 0 accidents
    return aggregated.filter((item) => item.value > 0)
  } catch (error) {
    console.error("Error fetching accident severity statistics:", error)
    // Fallback to default data on error
    const colors = ["#60a5fa", "#fb923c", "#f87171", "#a78bfa"]
    const labels: Record<string, string> = {
      lekki: "Lekki",
      ciezki: "Ciężki",
      smiertelny: "Śmiertelny",
      zbiorowy: "Zbiorowy",
    }

    return ACCIDENT_SEVERITIES.map((severity, idx) => ({
      name: labels[severity] || severity,
      value: DEFAULT_ACCIDENTS.filter((a) => a.severity === severity).length,
      fill: colors[idx],
    })).filter((item) => item.value > 0)
  }
}

export async function getReportStatusStatistics(): Promise<StatisticData[]> {
  try {
    const colors = ["#9ca3af", "#fbbf24", "#34d399", "#ef5350"]
    const labels: Record<string, string> = {
      szkic: "Szkic",
      zlozony: "Złożony",
      zaakceptowany: "Zaakceptowany",
      odrzucony: "Odrzucony",
    }

    const result = await db
      .select({
        status: accidents.status,
      })
      .from(accidents)

    // Use database results if available, otherwise use default data
    const dataToAggregate = result.length > 0 ? result : DEFAULT_ACCIDENTS

    const aggregated = REPORT_STATUSES.map((status) => ({
      name: labels[status] || status,
      value: dataToAggregate.filter((r) => r.status === status).length,
      fill: colors[REPORT_STATUSES.indexOf(status)],
    }))

    // Filter out statuses with 0 accidents
    return aggregated.filter((item) => item.value > 0)
  } catch (error) {
    console.error("Error fetching report status statistics:", error)
    // Fallback to default data on error
    const colors = ["#9ca3af", "#fbbf24", "#34d399", "#ef5350"]
    const labels: Record<string, string> = {
      szkic: "Szkic",
      zlozony: "Złożony",
      zaakceptowany: "Zaakceptowany",
      odrzucony: "Odrzucony",
    }

    return REPORT_STATUSES.map((status, idx) => ({
      name: labels[status] || status,
      value: DEFAULT_ACCIDENTS.filter((a) => a.status === status).length,
      fill: colors[idx],
    })).filter((item) => item.value > 0)
  }
}
