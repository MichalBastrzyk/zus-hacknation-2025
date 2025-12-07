/**
 * Typy podstaw ubezpieczenia wypadkowego zgodnie z ustawą.
 * Odpowiadają najczęstszym sytuacjom życiowym.
 */
enum InsuranceBasisType {
  Zlecenie = "ZLECENIE",
  DzialalnoscGospodarcza = "DZIALALNOSC",
  Wspolpraca = "WSPOLPRACA",
  StypendiumSportowe = "STYPENDIUM_SPORTOWE",
  PoselSenator = "POSEL_SENATOR",
  Duchowny = "DUCHOWNY",
}

interface AccidentTitleResult {
  success: boolean
  textToEnter: string // To wpisujesz w kropkowane pole
  legalBasis: string // Numer punktu z ustawy
  description?: string // Wyjaśnienie dla Ciebie
}

/**
 * Baza tekstów ustawowych mapowana do typów umów.
 * Źródło: Art. 3 ust. 3 Ustawy o ubezpieczeniu społecznym z tytułu wypadków...
 */
const LAW_DEFINITIONS: Record<
  InsuranceBasisType,
  { point: string; text: string }
> = {
  [InsuranceBasisType.Zlecenie]: {
    point: "art. 3 ust. 3 pkt 6",
    text: "wykonywanie pracy na podstawie umowy agencyjnej lub umowy zlecenia albo innej umowy o świadczenie usług, do której zgodnie z Kodeksem cywilnym stosuje się przepisy dotyczące zlecenia",
  },
  [InsuranceBasisType.DzialalnoscGospodarcza]: {
    point: "art. 3 ust. 3 pkt 8",
    text: "prowadzenie działalności pozarolniczej w rozumieniu przepisów o systemie ubezpieczeń społecznych",
  },
  [InsuranceBasisType.Wspolpraca]: {
    point: "art. 3 ust. 3 pkt 9",
    text: "wykonywanie współpracy przy prowadzeniu działalności pozarolniczej w rozumieniu przepisów o systemie ubezpieczeń społecznych",
  },
  [InsuranceBasisType.StypendiumSportowe]: {
    point: "art. 3 ust. 3 pkt 7",
    text: "pobieranie stypendium sportowego",
  },
  [InsuranceBasisType.PoselSenator]: {
    point: "art. 3 ust. 3 pkt 1",
    text: "wykonywanie mandatu posła lub posła do Parlamentu Europejskiego wybranego w Rzeczypospolitej Polskiej oraz sprawowanie mandatu senatora",
  },
  [InsuranceBasisType.Duchowny]: {
    point: "art. 3 ust. 3 pkt 10",
    text: "bycie duchownym, zakonnikiem lub zakonnicą zakonów i zgromadzeń zakonnych oraz inną osobą, o której mowa w art. 8 ust. 10–12 ustawy o systemie ubezpieczeń społecznych",
  },
}

/**
 * Funkcja generująca tekst do Karty Wypadku (Pkt 5).
 * @param type - Rodzaj Twojej umowy/aktywności
 * @param isStudentUnder26 - Czy jesteś studentem poniżej 26 lat (ważne dla Zlecenia!)
 */
export function getAccidentInsuranceTitle(
  type: InsuranceBasisType,
  isStudentUnder26: boolean = false
): AccidentTitleResult {
  // EDGE CASE: Student < 26 lat na zleceniu
  // Studenci < 26 lat na zleceniu zazwyczaj NIE podlegają ubezpieczeniom społecznym (w tym wypadkowemu).
  // Chyba, że jest to umowa z własnym pracodawcą lub dobrowolne ubezpieczenie (rzadkość).
  if (type === InsuranceBasisType.Zlecenie && isStudentUnder26) {
    return {
      success: false,
      textToEnter: "BRAK TYTUŁU - Upewnij się, czy podlegasz ubezpieczeniu!",
      legalBasis: "N/A",
      description:
        "Uwaga: Studenci poniżej 26 roku życia na umowie zlecenie zazwyczaj nie są objęci ubezpieczeniem wypadkowym. Jeśli nie płacisz składek ZUS, karta wypadku może Ci nie przysługiwać.",
    }
  }

  const definition = LAW_DEFINITIONS[type]

  if (!definition) {
    return {
      success: false,
      textToEnter: "",
      legalBasis: "",
      description: "Nie znaleziono pasującej definicji prawnej.",
    }
  }

  // Formularz wymaga: "numer pozycji i pełny tytuł"
  const formattedText = `${definition.point} – ${definition.text}`

  return {
    success: true,
    textToEnter: formattedText,
    legalBasis: definition.point,
    description: "Skopiuj wartość 'textToEnter' w pole nr 5 Karty Wypadku.",
  }
}
