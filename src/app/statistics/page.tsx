"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { LabelList, Pie, PieChart, ResponsiveContainer } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/src/components/ui/chart"
import type { StatisticData } from "@/src/db/dbHelpers/getAccidentStatistics"

export default function StatisticsPage() {
    const [accidentTypeData, setAccidentTypeData] = useState<StatisticData[]>([])
    const [severityData, setSeverityData] = useState<StatisticData[]>([])
    const [statusData, setStatusData] = useState<StatisticData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const [typeRes, severityRes, statusRes] = await Promise.all([
                    fetch("/api/statistics/accident-types"),
                    fetch("/api/statistics/severities"),
                    fetch("/api/statistics/statuses"),
                ])

                const typeData = await typeRes.json()
                const severityDataRes = await severityRes.json()
                const statusDataRes = await statusRes.json()

                setAccidentTypeData(typeData)
                setSeverityData(severityDataRes)
                setStatusData(statusDataRes)
            } catch (error) {
                console.error("Error fetching statistics:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStatistics()
    }, [])

    if (isLoading) {
        return <div className="p-6">Ładowanie statystyk...</div>
    }

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

interface AccidentChartProps {
    title: string
    description: string
    data: StatisticData[]
    dataKey: string
}

function AccidentChart({ title, description, data, dataKey }: AccidentChartProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={{
                        value: {
                            label: "Liczba",
                        },
                    }}
                    className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[300px]"
                >
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <ChartTooltip
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey={dataKey}
                                fill="#8884d8"
                            >
                                <LabelList
                                    dataKey={dataKey}
                                    className="fill-background"
                                    stroke="none"
                                    fontSize={12}
                                />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="text-muted-foreground leading-none">
                    Łączna liczba: {data.reduce((sum, item) => sum + item.value, 0)}
                </div>
            </CardFooter>
        </Card>
    )
}

interface StatsSummaryCardProps {
    title: string
    value: number
    color: string
}

function StatsSummaryCard({ title, value, color }: StatsSummaryCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`text-3xl font-bold ${color} p-4 rounded-lg text-center`}>
                    {value}
                </div>
            </CardContent>
        </Card>
    )
}
