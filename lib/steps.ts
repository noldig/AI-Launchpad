export type StepId = 'scan' | 'target' | 'engine' | 'takeoff'

export interface Question {
  key: string
  text: string
  hint?: string
  type?: 'text' | 'choice'
  options?: string[]
  placeholder?: string
}

export interface BriefField {
  key: string
  label: string
  type?: 'text' | 'choice'
  options?: string[]
}

export interface EthicsGuard {
  label: string
  text: string
  link?: string
  linkLabel?: string
}

export interface DecisionTreeNode {
  condition: string
  path: string
  note: string
  color: string
  warning?: boolean
}

export interface ValidationPath {
  id: string
  label: string
  desc: string
}

export interface Step {
  id: StepId
  emoji: string
  title: string
  subtitle: string
  tagline: string
  color: string
  // Aus DOCX: Voraussetzungen und Etappen-Beschreibung
  input: string[]
  content: string
  ethicsGuard: EthicsGuard
  helpQuestion?: { text: string }
  decisionTree?: DecisionTreeNode[]
  mvpTemplate?: string
  validationPaths?: ValidationPath[]
  questions: Question[]
  brief: BriefField[]
  gateChecks: string[]
}

export const STEPS: Step[] = [
  {
    id: 'scan',
    emoji: '🔍',
    title: 'SCAN',
    subtitle: 'Problem verstehen & einordnen',
    tagline: 'Bevor wir über Technik reden, scannen wir das Gelände.',
    color: '#3B82F6',
    input: [
      'Eine konkrete Problemstellung oder Idee aus dem Alltag (kein ausformuliertes Konzept nötig)',
      'Die Person oder das Team, das den Schmerz kennt (Fachexpert:in)',
      'Grober Kontext über den betroffenen Prozess',
    ],
    content:
      'Wir dekonstruieren den aktuellen Prozess und suchen die Punkte, an denen es wirklich hakt. Wir übersetzen den Bedarf in eine konkrete KI-Aufgabe und ziehen klare Grenzen, was die KI tun soll und was wir bewusst weglassen.',
    ethicsGuard: {
      label: 'Wertekonformität',
      text: 'Passt die geplante Lösung zu unserem Anspruch und den Bedürfnissen unserer Nutzer?',
      link: 'https://www.ethicscanvas.org/',
      linkLabel: 'Ethics Canvas',
    },
    questions: [
      {
        key: 'currentProcess',
        text: 'An welcher Stelle in unserem heutigen Ablauf verlieren wir die meiste Zeit oder den grössten Wert?',
        hint: 'Beschreib den konkreten Moment, nicht das System dahinter.',
      },
      {
        key: 'aiTask',
        text: 'Welche Arbeit soll die KI konkret übernehmen? Was soll sie tun — lesen, sortieren, schreiben, vorhersagen?',
        hint: 'Wähle einen KI-Aufgabentyp:',
        type: 'choice',
        options: ['Klassifizieren', 'Zusammenfassen', 'Extrahieren', 'Generieren', 'Vorhersagen'],
      },
      {
        key: 'userContext',
        text: 'In welchem Umfeld und von wem wird dieses Produkt später genutzt?',
        hint: 'Wer, wann, in welcher Situation?',
      },
    ],
    brief: [
      { key: 'frictionPoint', label: 'Friction Point (1 Satz)' },
      { key: 'aiTaskType', label: 'KI-Aufgabentyp' },
      { key: 'scopeBoundary', label: 'Scope-Grenze (was gehört nicht dazu)' },
      { key: 'userContext', label: 'Nutzerkontext (wer, wann, in welcher Situation)' },
    ],
    gateChecks: [
      'Friction Point ist ohne Vorkenntnisse verständlich',
      'Genau ein KI-Aufgabentyp ist definiert',
      'Scope-Grenze ist explizit benannt',
    ],
  },
  {
    id: 'target',
    emoji: '🎯',
    title: 'TARGET',
    subtitle: 'Wirkung & Erfolg definieren',
    tagline: 'Wir visieren das Ziel an und legen fest, wie wir den Erfolg messen.',
    color: '#10B981',
    input: [
      'Abgeschlossener Flight Brief (SCAN-Block)',
      'Person mit Business-Kontext: Kenntnisse über Kosten, Prozessaufwand oder strategische Ziele',
    ],
    content:
      'Wir analysieren den Business Impact und legen fest, wie wir den Erfolg messen. Dabei trennen wir technische Lab-Werte (Modell-Metriken) von echten Erfolgszahlen aus der Praxis (Produkt-Metriken).',
    ethicsGuard: {
      label: 'Verantwortlichkeit',
      text: 'Wer trägt die Rechenschaft für die Entscheidungen, die das System trifft?',
    },
    helpQuestion: {
      text: 'Stell dir vor, die KI liefert in 10 von 100 Fällen ein falsches Ergebnis. Wäre das akzeptabel, oder würde das den Nutzen zerstören?',
    },
    questions: [
      {
        key: 'strategicAdvantage',
        text: 'Welchen langfristigen Vorteil gewinnen wir, wenn dieses Problem perfekt gelöst ist?',
        hint: 'Operativ (Kosten, Zeit, Aufwand) oder strategisch (Wettbewerbsvorteil, neues Produkt)?',
      },
      {
        key: 'successSignals',
        text: 'Welche Signale aus der echten Welt zeigen uns eindeutig, dass das Produkt funktioniert?',
        hint: 'Mindestens 2 Produkt-Metriken — keine reinen Modell-Metriken wie Accuracy.',
      },
      {
        key: 'reliability',
        text: 'Welche Mindestanforderungen haben wir an die Zuverlässigkeit der Ergebnisse?',
        hint: 'Was ist die akzeptable Fehlerrate? Ab wann zerstört ein Fehler den Nutzen?',
      },
    ],
    brief: [
      { key: 'businessImpact', label: 'Business Impact (operativ / strategisch)' },
      { key: 'productMetrics', label: 'Produkt-Metriken (min. 2, aus der echten Welt)' },
      { key: 'errorTolerance', label: 'Technische Mindestanforderung (Fehlertoleranz)' },
      { key: 'accountablePerson', label: 'Verantwortliche Person' },
    ],
    gateChecks: [
      'Business Impact ist kategorisiert (operativ oder strategisch)',
      'Mindestens zwei Produkt-Metriken definiert — keine reinen Modell-Metriken',
      'Fehlertoleranz ist explizit benannt',
      'Verantwortliche Person ist namentlich eingetragen',
    ],
  },
  {
    id: 'engine',
    emoji: '⚙️',
    title: 'ENGINE',
    subtitle: 'Lösungsweg & Daten',
    tagline: 'Wir schauen unter die Haube und bestimmen den Antrieb für unser Produkt.',
    color: '#F59E0B',
    input: [
      'Vollständiger Flight Brief (SCAN + TARGET)',
      'Technische Person im Raum, die das verfügbare Tech-Stack und die Datenlage beurteilen kann',
    ],
    content:
      'Wir definieren das Tech-Setup und wählen den schnellsten Weg zur Lösung. Parallel planen wir die Datenstrategie: Welche Quellen haben wir, und wie schützen wir unser geistiges Eigentum?',
    ethicsGuard: {
      label: 'Datenschutz',
      text: 'Wie wahren wir die Rechte unserer Nutzer bei jeder Datenbewegung?',
    },
    helpQuestion: {
      text: 'Könnte ein neuer Mitarbeiter diese Aufgabe lösen, wenn man ihm einfach googeln lässt? Oder braucht er zuerst eine Einführung in interne Abläufe? Oder müsste er monatelang Hands-on lernen, bis er es wirklich beherrscht?',
    },
    decisionTree: [
      {
        condition: 'Googeln reicht',
        path: 'API-first',
        note: 'Schnellster Weg — starte hier',
        color: '#10B981',
      },
      {
        condition: 'Interne Einführung nötig',
        path: 'RAG',
        note: 'Eigene Dokumente als Wissensbasis',
        color: '#3B82F6',
      },
      {
        condition: 'Monate lernen',
        path: 'Fine-Tuning',
        note: 'Achtung: aufwändig und teuer. Prüfe zuerst ob RAG ausreicht.',
        color: '#EF4444',
        warning: true,
      },
    ],
    questions: [
      {
        key: 'solutionPath',
        text: 'Welcher technische Weg ermöglicht uns ein fertiges Produkt innerhalb weniger Wochen?',
        hint: 'API-first / RAG / Fine-Tuning — und warum?',
        type: 'choice',
        options: ['API-first', 'RAG (Retrieval-Augmented Generation)', 'Fine-Tuning'],
      },
      {
        key: 'dataSources',
        text: 'Haben wir Zugriff auf die benötigten Daten und wie steht es um deren Qualität?',
        hint: 'Welche Quellen, wo liegen sie, in welcher Qualität?',
      },
      {
        key: 'simplicityNote',
        text: 'Wie können wir den technischen Aufbau so simpel wie möglich halten, um sofort loszulegen?',
        hint: 'Was lassen wir bewusst weg? Was ist der absolut einfachste Einstieg?',
      },
    ],
    brief: [
      { key: 'solutionPath', label: 'Lösungsweg (API-first / RAG / Fine-Tuning + Begründung)' },
      { key: 'dataSources', label: 'Datenquellen (welche, wo, in welcher Qualität)' },
      { key: 'dataCompass', label: 'Daten-Kompass (was bleibt intern, was darf raus)' },
      {
        key: 'technicalComplexity',
        label: 'Technische Komplexität',
        type: 'choice',
        options: ['Einfach', 'Mittel', 'Hoch'],
      },
    ],
    gateChecks: [
      'Lösungsweg ist festgelegt und begründet',
      'Mindestens eine Datenquelle ist identifiziert und auf Verfügbarkeit geprüft',
      'Daten-Kompass ist ausgefüllt',
      'Technische Komplexität ist eingeschätzt',
    ],
  },
  {
    id: 'takeoff',
    emoji: '🚀',
    title: 'TAKEOFF',
    subtitle: 'Das Kern-Feature absichern',
    tagline: 'Der finale Check. Wir schnüren das Paket für die Entwicklung.',
    color: '#8B5CF6',
    input: [
      'Vollständiger Flight Brief (SCAN + TARGET + ENGINE)',
      'Vollständiges Team: Fachperson, Techniker und Produktverantwortliche',
    ],
    content:
      'Wir entwerfen das Kern-Feature und formulieren eine falsifizierbare MVP-Hypothese. Danach führen wir ein Risiko-Audit durch und suchen gezielt nach KI-Risiken wie Halluzinationen, Bias oder mangelnder Erklärbarkeit.',
    ethicsGuard: {
      label: 'Erklärbarkeit & Fairness',
      text: 'Können wir dem Nutzer begreiflich machen, wie die KI zu ihrem Schluss kommt?',
    },
    mvpTemplate:
      'Wir glauben, dass [Nutzergruppe] [Problem] mit [Lösung] besser lösen kann. Wir wissen, dass wir recht haben, wenn [messbares Signal] eintritt.',
    validationPaths: [
      {
        id: 'real-users',
        label: 'Echte Nutzer',
        desc: 'Direkter Test mit der Zielgruppe',
      },
      {
        id: 'internal-pilot',
        label: 'Interne Pilotanwender',
        desc: 'Kolleginnen und Kollegen als Proxy',
      },
      {
        id: 'wizard-of-oz',
        label: 'Wizard-of-Oz',
        desc: 'Manuell simuliertes System, das die KI-Logik nachahmt',
      },
    ],
    questions: [
      {
        key: 'coreFeature',
        text: 'Was ist die absolut einfachste Form dieser Lösung, die wir einem Nutzer morgen zum Testen geben können?',
        hint: 'Formuliere das Kern-Feature in einem Satz — auch für Nicht-Techniker verständlich.',
      },
      {
        key: 'mvpHypothesis',
        text: 'Formuliere eure MVP-Hypothese.',
        hint: 'Vorlage: "Wir glauben, dass [Nutzergruppe] [Problem] mit [Lösung] besser lösen kann. Wir wissen, dass wir recht haben, wenn [messbares Signal] eintritt."',
        placeholder: 'Wir glauben, dass ...',
      },
      {
        key: 'aiRisks',
        text: 'Wo könnte die KI unsinnige Ergebnisse liefern? Wie fangt ihr das ab?',
        hint: 'Mindestens 3 Risiken mit Gegenmassnahmen: Halluzinationen, Bias, mangelnde Erklärbarkeit, Sycophancy...',
      },
    ],
    brief: [
      { key: 'coreFeature', label: 'Kern-Feature (1 Satz, auch für Nicht-Techniker verständlich)' },
      { key: 'mvpHypothesis', label: 'MVP-Hypothese' },
      { key: 'validationPath', label: 'Validierungsweg' },
      { key: 'riskLog', label: 'Risiko-Log (min. 3 Risiken + Gegenmassnahmen)' },
    ],
    gateChecks: [
      'Kern-Feature ist in einem Satz formuliert, den auch ein Nicht-Techniker versteht',
      'MVP-Hypothese ist explizit und falsifizierbar',
      'Validierungsweg ist festgelegt — unabhängig davon, ob externe Nutzer verfügbar sind',
      'Mindestens drei Risiken mit Gegenmassnahmen dokumentiert',
      'Flight Brief ist vollständig: alle vier Blöcke ausgefüllt',
    ],
  },
]

export const STEP_ORDER: StepId[] = ['scan', 'target', 'engine', 'takeoff']

export function getStep(id: string): Step | undefined {
  return STEPS.find((s) => s.id === id)
}

export function getNextStep(id: StepId): StepId | null {
  const idx = STEP_ORDER.indexOf(id)
  return idx < STEP_ORDER.length - 1 ? STEP_ORDER[idx + 1] : null
}
