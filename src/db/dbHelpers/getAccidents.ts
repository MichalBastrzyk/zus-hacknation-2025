import { db } from "../index"
import {
  accidents,
  injuredPersons,
  employers,
  ACCIDENT_TYPES,
  ACCIDENT_SEVERITIES,
  REPORT_STATUSES,
} from "../schema"
import { eq } from "drizzle-orm"

export type Accident = {
  id: string
  injuredPersonName: string | null
  injuredPersonLastName: string | null
  companyName: string | null
  accidentType: string
  accidentSeverity: string
  accidentDate: string
  accidentPlace: string
  status: string
  createdAt: Date
  accidentDescription: string
  accidentCause: string | null
}

export async function getAllAccidents() {
  try {
    const result = await db
      .select({
        id: accidents.id,
        injuredPersonName: injuredPersons.firstName,
        injuredPersonLastName: injuredPersons.lastName,
        companyName: employers.companyName,
        accidentType: accidents.accidentType,
        accidentSeverity: accidents.accidentSeverity,
        accidentDate: accidents.accidentDate,
        accidentPlace: accidents.accidentPlace,
        status: accidents.status,
        createdAt: accidents.createdAt,
        accidentDescription: accidents.accidentDescription,
        accidentCause: accidents.accidentCause,
      })
      .from(accidents)
      .leftJoin(
        injuredPersons,
        eq(accidents.injuredPersonId, injuredPersons.id)
      )
      .leftJoin(employers, eq(accidents.employerId, employers.id))

    return result.length > 0 ? result : getDefaultAccidents()
  } catch (error) {
    console.error("Error fetching accidents:", error)
    return getDefaultAccidents()
  }
}

function getDefaultAccidents() {
  return [
    {
      id: "1",
      injuredPersonName: "Jan",
      injuredPersonLastName: "Kowalski",
      companyName: "Przykładowa Firma Sp. z o.o.",
      accidentType: ACCIDENT_TYPES[1],
      accidentSeverity: ACCIDENT_SEVERITIES[2],
      accidentDate: "2024-12-05",
      accidentPlace: "Hala produkcyjna A",
      status: REPORT_STATUSES[1],
      createdAt: new Date("2024-12-05"),
      accidentDescription:
        "Pracownik spadł ze schodów podczas pracy. Upadł na brzuch od wysokości 1,5 metra.",
      accidentCause:
        "Niedbałość pracownika i brak poręczy ochronnej na schodach",
    },
    {
      id: "2",
      injuredPersonName: "Maria",
      injuredPersonLastName: "Nowak",
      companyName: "Zakład Pracy XYZ",
      accidentType: ACCIDENT_TYPES[2],
      accidentSeverity: ACCIDENT_SEVERITIES[1],
      accidentDate: "2024-12-04",
      accidentPlace: "Biuro",
      status: REPORT_STATUSES[2],
      createdAt: new Date("2024-12-04"),
      accidentDescription:
        "Pracownica doznała kontuzji ręki podczas obsługi drukarki biurowej.",
      accidentCause: "Nieznane - trwa postępowanie",
    },
    {
      id: "3",
      injuredPersonName: "Piotr",
      injuredPersonLastName: "Lewandowski",
      companyName: "Budowa Sp. z o.o.",
      accidentType: ACCIDENT_TYPES[0],
      accidentSeverity: ACCIDENT_SEVERITIES[2],
      accidentDate: "2024-12-03",
      accidentPlace: "Plac budowy",
      status: REPORT_STATUSES[2],
      createdAt: new Date("2024-12-03"),
      accidentDescription:
        "Pracownik otrzymał uraz głowy po upadku deski z rusztowania.",
      accidentCause: "Nieprawidłowe zabezpieczenie materiałów budowlanych",
    },
    {
      id: "4",
      injuredPersonName: "Anna",
      injuredPersonLastName: "Szymańska",
      companyName: "Transport Logistyka Sp. z o.o.",
      accidentType: ACCIDENT_TYPES[1],
      accidentSeverity: ACCIDENT_SEVERITIES[0],
      accidentDate: "2024-12-02",
      accidentPlace: "Magazyn",
      status: REPORT_STATUSES[1],
      createdAt: new Date("2024-12-02"),
      accidentDescription:
        "Pracownica doznała złamania palca podczas załadunku towaru.",
      accidentCause: "Brak odpowiedniego sprzętu do załadunku",
    },
    {
      id: "5",
      injuredPersonName: "Tomasz",
      injuredPersonLastName: "Michałowski",
      companyName: "Fabryka Tekstyliów",
      accidentType: ACCIDENT_TYPES[2],
      accidentSeverity: ACCIDENT_SEVERITIES[1],
      accidentDate: "2024-12-01",
      accidentPlace: "Linia produkcyjna B",
      status: REPORT_STATUSES[3],
      createdAt: new Date("2024-12-01"),
      accidentDescription:
        "Pracownik doznał oparzenia drugiego stopnia na dłoni.",
      accidentCause: "Wada maszyny do prasowania",
    },
    {
      id: "6",
      injuredPersonName: "Katarzyna",
      injuredPersonLastName: "Wójcik",
      companyName: "Szpital Centralny",
      accidentType: ACCIDENT_TYPES[0],
      accidentSeverity: ACCIDENT_SEVERITIES[0],
      accidentDate: "2024-11-30",
      accidentPlace: "Pokój pacjenta",
      status: REPORT_STATUSES[2],
      createdAt: new Date("2024-11-30"),
      accidentDescription:
        "Pielęgniarka doznała małego skaleczenia podczas zabiegu.",
      accidentCause: "Ostra krawędź sprzętu medycznego",
    },
  ]
}
