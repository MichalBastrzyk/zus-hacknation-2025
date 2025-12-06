import {
  CheckCircle2,
  Gavel,
  HelpCircle,
  XCircle,
  AlertTriangle,
  Activity,
  Briefcase,
  AlertCircle,
} from "lucide-react"
import { AccidentDecision } from "@/lib/validators"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

function decisionStyles(type: AccidentDecision["decision"]["type"]) {
  switch (type) {
    case "APPROVED":
      return {
        label: "UZNANY",
        description: "Zdarzenie spełnia przesłanki wypadku przy pracy",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        badge: "bg-emerald-600 hover:bg-emerald-700",
      }
    case "REJECTED":
      return {
        label: "NIEUZNANY",
        description: "Zdarzenie nie spełnia definicji wypadku przy pracy",
        color: "text-rose-600",
        bgColor: "bg-rose-50",
        borderColor: "border-rose-200",
        badge: "bg-rose-600 hover:bg-rose-700",
      }
    case "NEEDS_CLARIFICATION":
      return {
        label: "DO WYJAŚNIENIA",
        description: "Wymagane dodatkowe informacje lub dokumenty",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        badge: "bg-amber-500 hover:bg-amber-600",
      }
    default:
      return {
        label: type,
        description: "Status nieznany",
        color: "text-slate-600",
        bgColor: "bg-slate-50",
        borderColor: "border-slate-200",
        badge: "bg-slate-600",
      }
  }
}

function CriteriaItem({
  title,
  met,
  description,
  icon: Icon,
}: {
  title: string
  met: boolean
  description: string
  icon: React.ElementType
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4 transition-all",
        met
          ? "border-emerald-100 bg-emerald-50/50"
          : "border-rose-100 bg-rose-50/50"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              met
                ? "bg-emerald-100 text-emerald-600"
                : "bg-rose-100 text-rose-600"
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <span
            className={cn(
              "font-semibold",
              met ? "text-emerald-900" : "text-rose-900"
            )}
          >
            {title}
          </span>
        </div>
        {met ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <XCircle className="h-5 w-5 text-rose-500" />
        )}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export function AnalysisResult({ result }: { result: AccidentDecision }) {
  const {
    decision,
    criteria_analysis,
    identified_flaws,
    references,
    suggested_follow_up_questions,
  } = result
  const styles = decisionStyles(decision.type)

  return (
    <div className="mt-8 w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-1.5">
          <h2 className="text-3xl font-bold tracking-tight">Wynik analizy</h2>
          <p className="text-muted-foreground">
            Automatyczna weryfikacja zgłoszenia na podstawie dokumentacji
          </p>
        </div>
        <div className="flex items-center gap-4 rounded-lg border bg-card p-4 shadow-sm">
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pewność modelu
            </div>
            <div className="flex items-center gap-2">
              <Progress
                value={decision.confidence_level * 100}
                className="h-2 w-24"
              />
              <span className="text-sm font-bold">
                {Math.round(decision.confidence_level * 100)}%
              </span>
            </div>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Decyzja
            </div>
            <Badge className={cn("px-3 py-1 text-sm", styles.badge)}>
              {styles.label}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Decision Context */}
      <Card className={cn("border-l-4 shadow-sm", styles.borderColor)}>
        <CardHeader>
          <CardTitle className={cn("text-xl", styles.color)}>
            {styles.label}
          </CardTitle>
          <CardDescription>{styles.description}</CardDescription>
        </CardHeader>
      </Card>

      {/* Criteria Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="h-5 w-5 text-muted-foreground" />
          Analiza przesłanek ustawowych
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <CriteriaItem
            title="Nagłość"
            icon={Activity}
            met={criteria_analysis.suddenness.met}
            description={criteria_analysis.suddenness.justification}
          />
          <CriteriaItem
            title="Przyczyna zewn."
            icon={AlertCircle}
            met={criteria_analysis.external_cause.met}
            description={criteria_analysis.external_cause.justification}
          />
          <CriteriaItem
            title="Związek z pracą"
            icon={Briefcase}
            met={criteria_analysis.work_connection.met}
            description={criteria_analysis.work_connection.justification}
          />
        </div>
      </div>

      {/* Flaws Section */}
      {identified_flaws.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Wykryte nieprawidłowości
          </h3>
          <div className="grid gap-3">
            {identified_flaws.map((flaw, idx) => (
              <div
                key={idx}
                className="flex gap-4 rounded-lg border border-amber-200 bg-amber-50/50 p-4"
              >
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-semibold text-amber-900 flex items-center gap-2">
                    {flaw.category}
                    {flaw.severity === "CRITICAL" && (
                      <Badge
                        variant="destructive"
                        className="text-[10px] h-5 px-1.5"
                      >
                        KRYTYCZNY
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-amber-800/90">
                    {flaw.detailed_description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Grid: References & Questions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Gavel className="h-4 w-4 text-blue-500" />
              Podstawa prawna / Precedens
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-slate-50 p-3 text-sm">
              <div className="mb-1 font-medium text-slate-900">
                ID sprawy: {references.nearest_precedent_id}
              </div>
              <p className="text-slate-600 leading-relaxed">
                {references.similarity_to_precedent}
              </p>
            </div>
          </CardContent>
        </Card>

        {suggested_follow_up_questions &&
          suggested_follow_up_questions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <HelpCircle className="h-4 w-4 text-purple-500" />
                  Sugerowane pytania
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {suggested_follow_up_questions.map((q, i) => (
                    <li
                      key={i}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <span className="select-none text-purple-400">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  )
}
