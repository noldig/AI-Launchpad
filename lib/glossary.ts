export interface GlossaryEntry {
  term: string
  definition: string
  category: 'etappen' | 'technologie' | 'messung' | 'risiken'
}

export const GLOSSARY: GlossaryEntry[] = [
  // Etappen
  {
    term: 'SCAN',
    definition:
      'Die erste Phase, in der wir das Business-Problem dekonstruieren und in eine konkrete KI-Aufgabe übersetzen.',
    category: 'etappen',
  },
  {
    term: 'TARGET',
    definition:
      'Hier visieren wir das Ziel an und legen fest, woran wir den Erfolg technisch und wirtschaftlich messen.',
    category: 'etappen',
  },
  {
    term: 'ENGINE',
    definition:
      'Die Phase, in der wir den technologischen Antrieb und die Daten-Strategie festlegen.',
    category: 'etappen',
  },
  {
    term: 'TAKEOFF',
    definition:
      'Der finale Check. Wir schnüren das Paket für die Entwicklung, definieren ein Kern-Feature und prüfen potenzielle Risiken.',
    category: 'etappen',
  },
  // Technologie
  {
    term: 'API-first',
    definition:
      'Der schnellste Weg zum Produkt. Wir nutzen fertige KI-Schnittstellen (wie von OpenAI), ohne selbst Modelle trainieren zu müssen.',
    category: 'technologie',
  },
  {
    term: 'RAG',
    definition:
      'Retrieval-Augmented Generation: Ein Verfahren, bei dem die KI auf eigene, interne Dokumente als Wissensbasis zugreift, um präzisere Antworten zu geben.',
    category: 'technologie',
  },
  {
    term: 'Fine-Tuning',
    definition:
      'Das nachträgliche Anlernen eines KI-Modells mit spezifischen Beispielen. Meist aufwändig und teuer — oft erst nach dem ersten MVP sinnvoll.',
    category: 'technologie',
  },
  {
    term: 'Kern-Feature',
    definition:
      'Die kleinste, voll funktionsfähige Einheit eines Produkts, die ein echtes Problem löst und sofort getestet werden kann. Auch: Vertical AI Slice.',
    category: 'technologie',
  },
  {
    term: 'LLM',
    definition:
      'Large Language Model: Ein auf riesigen Textmengen trainiertes KI-Modell, das menschliche Sprache verstehen und generieren kann.',
    category: 'technologie',
  },
  // Messung
  {
    term: 'Modell-Metriken',
    definition:
      'Technische Werte aus dem Labor, die zeigen, wie präzise oder schnell die KI arbeitet (z.B. Accuracy, Latenz). Nicht gleichzusetzen mit Business-Nutzen.',
    category: 'messung',
  },
  {
    term: 'Produkt-Metriken',
    definition:
      'Werte aus der echten Welt, die den geschäftlichen Nutzen zeigen (z.B. Zeitersparnis, Conversion Rate, Nutzerzufriedenheit).',
    category: 'messung',
  },
  {
    term: 'MVP',
    definition:
      'Minimum Viable Product: Die schlankste Version eines Produkts, mit der echtes Nutzerfeedback gesammelt werden kann.',
    category: 'messung',
  },
  {
    term: 'Wizard-of-Oz',
    definition:
      'Manuell simuliertes System, das die KI-Logik nachahmt — zum Testen ohne echte Implementierung.',
    category: 'messung',
  },
  // Risiken
  {
    term: 'AI Cancers',
    definition:
      'Typische Probleme von KI-Systemen: Halluzinationen, Bias, mangelnde Erklärbarkeit, Sycophancy.',
    category: 'risiken',
  },
  {
    term: 'Halluzinationen',
    definition:
      'Wenn die KI Fakten erfindet oder logisch falsche Schlüsse zieht, die aber sehr überzeugend klingen können.',
    category: 'risiken',
  },
  {
    term: 'Bias',
    definition:
      'Wenn die KI durch einseitige Trainingsdaten Vorurteile übernimmt und bestimmte Gruppen benachteiligt.',
    category: 'risiken',
  },
  {
    term: 'Erklärbarkeit',
    definition:
      'Die Fähigkeit, nachvollziehbar zu machen, wie die KI zu einer bestimmten Entscheidung oder Antwort gekommen ist.',
    category: 'risiken',
  },
  {
    term: 'Sycophancy',
    definition:
      'Die Tendenz von KI-Modellen, dem Nutzer nach dem Mund zu reden, auch wenn das auf Kosten der Wahrheit geht.',
    category: 'risiken',
  },
]
