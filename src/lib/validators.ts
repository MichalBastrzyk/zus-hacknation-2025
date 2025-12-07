import { z } from "zod"

export const AccidentDecisionSchema = z.object({
  decision: z.object({
    type: z
      .enum(["APPROVED", "REJECTED", "NEEDS_CLARIFICATION"])
      .describe("Final verdict on the claim."),
    confidence_level: z
      .number()
      .min(0)
      .max(1)
      .describe("Confidence score between 0.0 and 1.0."),
  }),

  extracted_data: z
    .object({
      injured_first_name: z
        .string()
        .nullable()
        .describe("Imię poszkodowanego. Null jeśli nieznane."),
      injured_last_name: z
        .string()
        .nullable()
        .describe("Nazwisko poszkodowanego. Null jeśli nieznane."),
      employer_name: z
        .string()
        .nullable()
        .describe("Nazwa pracodawcy. Null jeśli nieznana."),
      position: z
        .string()
        .nullable()
        .describe("Stanowisko poszkodowanego. Null jeśli nieznane."),
      accident_date: z
        .string()
        .nullable()
        .describe("Data wypadku w formacie YYYY-MM-DD. Null jeśli nieznana."),
      accident_place: z
        .string()
        .nullable()
        .describe("Miejsce wypadku. Null jeśli nieznane."),
      accident_description: z
        .string()
        .nullable()
        .describe("Krótki opis przebiegu wypadku."),
      accident_cause: z
        .string()
        .nullable()
        .describe("Przyczyna wypadku. Null jeśli nieznana."),
    })
    .describe("Dane wyodrębnione z opisu zgłoszenia."),

  criteria_analysis: z.object({
    suddenness: z.object({
      met: z.boolean(),
      justification: z
        .string()
        .describe(
          "Explanation citing time/sudden nature. Include citations if available."
        ),
    }),
    external_cause: z.object({
      met: z.boolean(),
      justification: z
        .string()
        .describe("Explanation of the external factor causing injury."),
    }),
    work_connection: z.object({
      met: z.boolean(),
      justification: z
        .string()
        .describe("Explanation linking the event to work duties."),
    }),
  }),

  identified_flaws: z
    .array(
      z.object({
        category: z.enum([
          "NO_EXTERNAL_CAUSE",
          "NO_WORK_CONNECTION",
          "INTOXICATION",
          "LACK_OF_EVIDENCE",
          "LACK_OF_SUDDENNESS",
          "OTHER",
        ]),
        detailed_description: z.string(),
        severity: z.enum(["CRITICAL", "WARNING"]),
      })
    )
    .describe("List of potential issues. Empty array if perfect case."),

  references: z.object({
    nearest_precedent_id: z
      .number()
      .int()
      .describe("ID of the most similar case from the knowledge base."),
    similarity_to_precedent: z
      .string()
      .describe("Why this precedent was chosen."),
  }),

  suggested_follow_up_questions: z
    .array(z.string())
    .optional()
    .describe("Questions to ask if clarification is needed."),
})

export type AccidentDecision = z.infer<typeof AccidentDecisionSchema>
