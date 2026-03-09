# AI Launchpad — Claude Code Specification

## Projektübersicht

**Projektname:** AI Launchpad
**Repository:** `ai-launchpad` (GitHub, Private)
**Entwicklungsumgebung:** Localhost (`http://localhost:3000`)
**Späteres Deployment:** VPS mit Docker

Das AI Launchpad ist ein internes Webtool, das Mitarbeitende Schritt für Schritt durch einen strukturierten AI-Designprozess führt. Es basiert auf dem MIT AI Design Process und IBM AI Design Thinking Ansatz und formt eine Idee in ein entwicklungsreifes MVP.

Der Prozess besteht aus vier Etappen: **SCAN → TARGET → ENGINE → TAKEOFF**, visualisiert als Flugreise. Das Tool ist keine Formularsammlung, sondern ein geführtes, interaktives Erlebnis mit einem starken visuellen Wiedererkennungsmerkmal.

---

## Kernkonzept: Das Zoomable Canvas UI

Die Hauptseite zeigt eine **Vogelperspektive auf alle vier Etappen** gleichzeitig — visualisiert als animierte Flugroute mit vier Stationen. Der User scrollt nicht durch eine klassische Seite, sondern **zoomt** in die Karte hinein. Jede Etappe ist eine "Station" auf dem Flugpfad.

**Interaktionsfluss:**
1. **Übersichts-Ebene**: Alle vier Etappen sichtbar als Karte/Canvas, verbunden durch eine animierte Flugroute. Jede Etappe zeigt Icon, Name und Kurzbeschreibung.
2. **Hover**: Sanftes Pulsieren / Highlight der Etappe.
3. **Click / Scroll in Etappe**: Animierter Zoom-In (Framer Motion `layoutId` + `scale`-Transition) direkt in die Etappe.
4. **Innerhalb einer Etappe**: Geführter Flow durch Masterfragen → Flight Brief → Gate Check. Jede Frage erscheint sequenziell (nicht alles auf einmal).
5. **Navigation**: Zurück-Button zoomt wieder auf die Übersicht. Fortschritt wird persistiert (Browser `sessionStorage`).
6. **Nach TAKEOFF**: Export-Screen mit PDF-Download und Mail-Versand.

**Referenz-Aesthetic**: Die Kumu Blocks Catalog Seite dient als visuelle Inspiration für die interaktive, canvas-basierte Darstellung. Das AI Launchpad nutzt eine ähnliche Tiefenwirkung — aber als custom React-Implementierung ohne externe Mapping-Bibliothek.

---

## Tech Stack

| Bereich | Technologie | Begründung |
|---|---|---|
| Framework | **Next.js 14** (App Router) | Routing, API Routes für Mail, einfaches Deployment |
| Animations | **Framer Motion** | Zoom-Transitions, `layoutId`, `useScroll`, `useTransform` |
| Styling | **Tailwind CSS** + CSS Variables | Utility-first, konsistentes Design-System |
| State Management | **Zustand** | Leichtgewichtig, persistierbar via `sessionStorage` |
| PDF Export | **@react-pdf/renderer** | Saubere React-basierte PDF-Generierung |
| Mail Versand | **Resend** (via Next.js API Route) | Einfaches Setup, zuverlässig, kein eigener SMTP-Server nötig. Alternativ: **Nodemailer** falls interner SMTP vorhanden |
| Icons | **Lucide React** | Konsistentes Icon-Set |
| Fonts | **Geist** (Display) + **DM Sans** (Body) — via `next/font` | Professionell, klar, nicht generisch |
| Deployment | **Docker** auf VPS | `Dockerfile` + `docker-compose.yml` werden mitgeliefert |

**Keine Datenbank.** Der gesamte State lebt im Browser bis zum Export. Kein Login, keine Authentifizierung.

---

## Projektstruktur

```
ai-launchpad/
├── app/
│   ├── layout.tsx              # Root Layout, Fonts, Metadata
│   ├── page.tsx                # Canvas-Übersicht (Startseite)
│   ├── step/
│   │   └── [id]/
│   │       └── page.tsx        # Dynamische Step-Seite (scan|target|engine|takeoff)
│   └── api/
│       └── send-email/
│           └── route.ts        # API Route: Mail-Versand via Resend/Nodemailer
├── components/
│   ├── canvas/
│   │   ├── LaunchpadCanvas.tsx  # Hauptkomponente: interaktive Übersichtskarte
│   │   ├── FlightPath.tsx       # Animierter SVG-Pfad zwischen den Etappen
│   │   └── StepNode.tsx         # Einzelne Etappe auf der Karte
│   ├── step/
│   │   ├── StepLayout.tsx       # Wrapper: Header, Progress, Navigation
│   │   ├── QuestionFlow.tsx     # Sequenzieller Fragen-Flow
│   │   ├── FlightBrief.tsx      # Formular für die Brief-Felder
│   │   ├── GateCheck.tsx        # Checkliste am Ende jeder Etappe
│   │   └── EthicsGuard.tsx      # KI-Leitplanke-Anzeige
│   ├── export/
│   │   ├── ExportScreen.tsx     # Finaler Export-Screen nach TAKEOFF
│   │   ├── PdfDocument.tsx      # @react-pdf/renderer Dokument-Definition
│   │   └── EmailForm.tsx        # Formular für Mail-Versand
│   └── ui/
│       ├── ProgressBar.tsx
│       ├── AnimatedCard.tsx
│       └── Button.tsx
├── lib/
│   ├── store.ts                 # Zustand Store: gesamter Launchpad-State
│   ├── steps.ts                 # Statische Daten: alle Etappen, Fragen, Gate Checks
│   └── pdf.ts                   # PDF-Generierungslogik
├── public/
│   └── assets/                  # Icons, Logo
├── Dockerfile
├── docker-compose.yml
└── .env.local.example
```

---

## Datenmodell (Zustand Store)

```typescript
// lib/store.ts

interface FieldEntry {
  key: string;        // z. B. "frictionPoint"
  label: string;      // z. B. "Friction Point (1 Satz)"
  value: string;      // User-Eingabe
}

interface StepState {
  completed: boolean;
  gateCheckPassed: boolean;
  fields: Record<string, string>; // key → Wert des Flight Brief
}

interface LaunchpadStore {
  projectName: string;
  currentStep: StepId | null;     // null = Übersicht
  steps: {
    scan: StepState;
    target: StepState;
    engine: StepState;
    takeoff: StepState;
  };

  // Actions
  setProjectName: (name: string) => void;
  setFieldValue: (step: StepId, key: string, value: string) => void;
  completeStep: (step: StepId) => void;
  resetAll: () => void;
}

type StepId = 'scan' | 'target' | 'engine' | 'takeoff';
```

Der Store wird via `zustand/middleware` in `sessionStorage` persistiert — damit gehen Daten beim Tab-Reload nicht verloren, aber bei einer neuen Session automatisch zurückgesetzt.

---

## Etappen-Daten (lib/steps.ts)

Alle Inhalte kommen aus einer zentralen Daten-Datei. Kein Hard-coding in Komponenten.

```typescript
// lib/steps.ts

export const STEPS = [
  {
    id: 'scan',
    emoji: '🔍',
    title: 'SCAN',
    subtitle: 'Problem verstehen & einordnen',
    tagline: 'Bevor wir über Technik reden, scannen wir das Gelände.',
    color: '#3B82F6',         // Blau
    ethicsGuard: {
      label: 'Wertekonformität',
      text: 'Passt die geplante Lösung zu unserem Anspruch und den Bedürfnissen unserer Nutzer?',
      link: 'https://www.ethicscanvas.org/',
      linkLabel: 'Ethics Canvas'
    },
    questions: [
      {
        key: 'currentProcess',
        text: 'An welcher Stelle in unserem heutigen Ablauf verlieren wir die meiste Zeit oder den grössten Wert?',
        hint: 'Beschreib den konkreten Moment, nicht das System dahinter.'
      },
      {
        key: 'aiTask',
        text: 'Welche Arbeit soll die KI konkret übernehmen? Was soll sie tun — lesen, sortieren, schreiben, vorhersagen?',
        hint: 'Wähle einen KI-Aufgabentyp: Klassifizieren / Zusammenfassen / Extrahieren / Generieren / Vorhersagen',
        type: 'choice',
        options: ['Klassifizieren', 'Zusammenfassen', 'Extrahieren', 'Generieren', 'Vorhersagen']
      },
      {
        key: 'userContext',
        text: 'In welchem Umfeld und von wem wird dieses Produkt später genutzt?',
        hint: 'Wer, wann, in welcher Situation?'
      }
    ],
    brief: [
      { key: 'frictionPoint', label: 'Friction Point (1 Satz)' },
      { key: 'aiTaskType', label: 'KI-Aufgabentyp' },
      { key: 'scopeBoundary', label: 'Scope-Grenze (was gehört nicht dazu)' },
      { key: 'userContext', label: 'Nutzerkontext (wer, wann, in welcher Situation)' }
    ],
    gateChecks: [
      'Friction Point ist ohne Vorkenntnisse verständlich',
      'Genau ein KI-Aufgabentyp ist definiert',
      'Scope-Grenze ist explizit benannt'
    ]
  },
  {
    id: 'target',
    emoji: '🎯',
    title: 'TARGET',
    subtitle: 'Wirkung & Erfolg definieren',
    tagline: 'Wir visieren das Ziel an und legen fest, wie wir den Erfolg messen.',
    color: '#10B981',         // Grün
    ethicsGuard: {
      label: 'Verantwortlichkeit',
      text: 'Wer trägt die Rechenschaft für die Entscheidungen, die das System trifft?'
    },
    helpQuestion: {
      text: 'Stell dir vor, die KI liefert in 10 von 100 Fällen ein falsches Ergebnis. Wäre das akzeptabel, oder würde das den Nutzen zerstören?'
    },
    questions: [
      {
        key: 'strategicAdvantage',
        text: 'Welchen langfristigen Vorteil gewinnen wir, wenn dieses Problem perfekt gelöst ist?',
        hint: 'Operativ (Kosten, Zeit, Aufwand) oder strategisch (Wettbewerbsvorteil, neues Produkt)?'
      },
      {
        key: 'successSignals',
        text: 'Welche Signale aus der echten Welt zeigen uns eindeutig, dass das Produkt funktioniert?',
        hint: 'Mindestens 2 Produkt-Metriken — keine reinen Modell-Metriken wie Accuracy.'
      },
      {
        key: 'reliability',
        text: 'Welche Mindestanforderungen haben wir an die Zuverlässigkeit der Ergebnisse?',
        hint: 'Was ist die akzeptable Fehlerrate? Ab wann zerstört ein Fehler den Nutzen?'
      }
    ],
    brief: [
      { key: 'businessImpact', label: 'Business Impact (operativ / strategisch)' },
      { key: 'productMetrics', label: 'Produkt-Metriken (min. 2, aus der echten Welt)' },
      { key: 'errorTolerance', label: 'Technische Mindestanforderung (Fehlertoleranz)' },
      { key: 'accountablePerson', label: 'Verantwortliche Person' }
    ],
    gateChecks: [
      'Business Impact ist kategorisiert (operativ oder strategisch)',
      'Mindestens zwei Produkt-Metriken definiert — keine reinen Modell-Metriken',
      'Fehlertoleranz ist explizit benannt',
      'Verantwortliche Person ist namentlich eingetragen'
    ]
  },
  {
    id: 'engine',
    emoji: '⚙️',
    title: 'ENGINE',
    subtitle: 'Lösungsweg & Daten',
    tagline: 'Wir schauen unter die Haube und bestimmen den Antrieb für unser Produkt.',
    color: '#F59E0B',         // Amber
    ethicsGuard: {
      label: 'Datenschutz',
      text: 'Wie wahren wir die Rechte unserer Nutzer bei jeder Datenbewegung?'
    },
    helpQuestion: {
      text: 'Könnte ein neuer Mitarbeiter diese Aufgabe lösen, wenn man ihm einfach googeln lässt? Oder braucht er zuerst eine Einführung in interne Abläufe? Oder müsste er monate lang Hands-on lernen?'
    },
    decisionTree: [
      { condition: 'Googeln reicht', path: 'API-first', note: 'Schnellster Weg, starte hier', color: '#10B981' },
      { condition: 'Interne Einführung nötig', path: 'RAG', note: 'Eigene Dokumente als Wissensbasis', color: '#3B82F6' },
      { condition: 'Monate lernen', path: 'Fine-Tuning', note: 'Achtung: aufwändig und teuer. Prüfe zuerst ob RAG ausreicht.', color: '#EF4444', warning: true }
    ],
    questions: [
      {
        key: 'solutionPath',
        text: 'Welcher technische Weg ermöglicht uns ein fertiges Produkt innerhalb weniger Wochen?',
        hint: 'API-first / RAG / Fine-Tuning — und warum?',
        type: 'choice',
        options: ['API-first', 'RAG (Retrieval-Augmented Generation)', 'Fine-Tuning']
      },
      {
        key: 'dataSources',
        text: 'Haben wir Zugriff auf die benötigten Daten und wie steht es um deren Qualität?',
        hint: 'Welche Quellen, wo liegen sie, in welcher Qualität?'
      },
      {
        key: 'dataCompass',
        text: 'Was bleibt intern, was darf die KI-Schnittstelle sehen?',
        hint: 'Daten-Kompass: Welche Daten dürfen externe APIs verarbeiten, welche nicht?'
      }
    ],
    brief: [
      { key: 'solutionPath', label: 'Lösungsweg (API-first / RAG / Fine-Tuning + Begründung)' },
      { key: 'dataSources', label: 'Datenquellen (welche, wo, in welcher Qualität)' },
      { key: 'dataCompass', label: 'Daten-Kompass (was bleibt intern, was darf raus)' },
      { key: 'technicalComplexity', label: 'Technische Komplexität (Einfach / Mittel / Hoch)', type: 'choice', options: ['Einfach', 'Mittel', 'Hoch'] }
    ],
    gateChecks: [
      'Lösungsweg ist festgelegt und begründet',
      'Mindestens eine Datenquelle ist identifiziert und auf Verfügbarkeit geprüft',
      'Daten-Kompass ist ausgefüllt',
      'Technische Komplexität ist eingeschätzt'
    ]
  },
  {
    id: 'takeoff',
    emoji: '🚀',
    title: 'TAKEOFF',
    subtitle: 'Das Kern-Feature absichern',
    tagline: 'Der finale Check. Wir schnüren das Paket für die Entwicklung.',
    color: '#8B5CF6',         // Violett
    ethicsGuard: {
      label: 'Erklärbarkeit & Fairness',
      text: 'Können wir dem Nutzer begreiflich machen, wie die KI zu ihrem Schluss kommt?'
    },
    mvpTemplate: 'Wir glauben, dass [Nutzergruppe] [Problem] mit [Lösung] besser lösen kann. Wir wissen, dass wir recht haben, wenn [messbares Signal] eintritt.',
    validationPaths: [
      { id: 'real-users', label: 'Echte Nutzer', desc: 'Direkter Test mit Zielgruppe' },
      { id: 'internal-pilot', label: 'Interne Pilotanwender', desc: 'Kolleginnen und Kollegen als Proxy' },
      { id: 'wizard-of-oz', label: 'Wizard-of-Oz', desc: 'Manuell simuliertes System, das die KI-Logik nachahmt' }
    ],
    questions: [
      {
        key: 'coreFeature',
        text: 'Was ist die absolut einfachste Form dieser Lösung, die wir einem Nutzer morgen zum Testen geben können?',
        hint: 'Formuliere das Kern-Feature in einem Satz — auch für Nicht-Techniker verständlich.'
      },
      {
        key: 'mvpHypothesis',
        text: 'Formuliere eure MVP-Hypothese.',
        hint: 'Vorlage: "Wir glauben, dass [Nutzergruppe] [Problem] mit [Lösung] besser lösen kann. Wir wissen, dass wir recht haben, wenn [messbares Signal] eintritt."',
        placeholder: 'Wir glauben, dass ...'
      },
      {
        key: 'aiRisks',
        text: 'Wo könnte die KI unsinnige Ergebnisse liefern? Wie fangt ihr das ab?',
        hint: 'Mindestens 3 Risiken mit Gegenmassnahmen: Halluzinationen, Bias, mangelnde Erklärbarkeit, Sycophancy...'
      }
    ],
    brief: [
      { key: 'coreFeature', label: 'Kern-Feature (1 Satz, auch für Nicht-Techniker verständlich)' },
      { key: 'mvpHypothesis', label: 'MVP-Hypothese' },
      { key: 'validationPath', label: 'Validierungsweg' },
      { key: 'riskLog', label: 'Risiko-Log (min. 3 Risiken + Gegenmassnahmen)' }
    ],
    gateChecks: [
      'Kern-Feature ist in einem Satz formuliert, den auch ein Nicht-Techniker versteht',
      'MVP-Hypothese ist explizit und falsifizierbar',
      'Validierungsweg ist festgelegt',
      'Mindestens drei Risiken mit Gegenmassnahmen dokumentiert',
      'Flight Brief ist vollständig: alle vier Blöcke ausgefüllt'
    ]
  }
];
```

---

## Komponenten-Spezifikation

### LaunchpadCanvas (Hauptseite)

Die Startseite rendert einen vollbildschirmfüllenden Canvas. Hintergrund: dunkel (near-black), darauf die vier Etappen-Nodes verbunden durch einen animierten, gestrichelten SVG-Pfad (Flugpfad-Ästhetik).

**Layout:**
- Nodes in einer leicht geschwungenen horizontalen Anordnung, leicht diagonal versetzt (nicht gerade Linie — wirkt statisch).
- Jeder Node: Kreis oder abgerundetes Rechteck, Etappen-Farbe, Emoji, Titel, Untertitel.
- Zwischen den Nodes: animierter gestrichelter Pfad, ein kleines Flugzeug-Icon bewegt sich entlang des Pfads wenn Etappen abgeschlossen werden.
- Oben links: Logo / "AI Launchpad" Schriftzug.
- Oben rechts: Fortschritts-Indikator (z.B. "2/4 Etappen abgeschlossen").

**Animation beim Click auf Node:**
```typescript
// Framer Motion shared layout animation
// Node expandiert zum Vollbild mit layoutId
<motion.div layoutId={`step-${step.id}`}>
  // Inhalt
</motion.div>
```

Beim Navigieren zu `/step/[id]` übernimmt die Seite das `layoutId` und expandiert smooth vom Node-Punkt zum Vollbild.

### QuestionFlow

Fragen erscheinen **sequenziell** — nicht alle auf einmal. Eine Frage ist sichtbar, die nächste wird mit `AnimatePresence` eingeblendet sobald die aktuelle beantwortet wurde. Das erzeugt einen geführten, fokussierten Flow statt eines langen Formulars.

```
[KI-Leitplanke] → [Frage 1] → [Frage 2] → [Frage 3] → [Flight Brief Review] → [Gate Check]
```

Die KI-Leitplanke wird zu Beginn jeder Etappe als prominent gestaltete Karte angezeigt (nicht am Ende als Fussnote).

### FlightBrief

Am Ende jeder Etappe: alle Brief-Felder ausgefüllt anzeigen, mit Möglichkeit zur Nachbearbeitung. Visuell wie ein ausgefülltes Formular in Flugticket-Optik.

### GateCheck

Checkliste. Jeder Punkt ist interaktiv abzuhaken. Wenn alle Checks gesetzt: "Zur nächsten Etappe" Button wird freigeschaltet (vorher disabled und ausgegraut).

### ExportScreen

Nach Abschluss von TAKEOFF erscheint der Export-Screen:
- Zusammenfassung aller vier Flight Briefs in einer scrollbaren Ansicht
- Button: **PDF herunterladen** (generiert via `@react-pdf/renderer`)
- Button: **Per Mail versenden** (öffnet kleines Formular: Empfänger-Adresse → POST zu `/api/send-email`)
- Button: **Neue Session starten** (Zustand zurücksetzen)

---

## PDF-Dokument Spezifikation

Das PDF-Dokument (`PdfDocument.tsx`) enthält:

1. **Deckblatt**: Logo, Projekttitel, Datum, "AI Launchpad — Flight Brief"
2. **Seite pro Etappe** (4 Seiten): 
   - Etappen-Header mit Farbe und Emoji
   - Alle ausgefüllten Brief-Felder
   - Gate Check Status (Checkmarks)
   - KI-Leitplanke
3. **Zusammenfassung**: Kern-Feature, MVP-Hypothese, Risiko-Log

Farbschema im PDF entspricht dem Web-Design (Etappen-Farben).

---

## Mail-Versand API Route

Mail-Versand erfolgt ausschliesslich via **Resend**. Kein SMTP, kein Nodemailer.

```typescript
// app/api/send-email/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// POST Body:
{
  to: string;           // Empfänger-Adresse
  projectName: string;
  pdfBase64: string;    // Base64-kodiertes PDF als Anhang
}

// Resend Attachment-Format:
await resend.emails.send({
  from: process.env.MAIL_FROM,
  to: body.to,
  subject: `AI Launchpad: Flight Brief — ${body.projectName}`,
  html: `<p>Anbei der vollständige Flight Brief für das Projekt <strong>${body.projectName}</strong>.</p>`,
  attachments: [{
    filename: `${body.projectName}-flight-brief.pdf`,
    content: body.pdfBase64,
  }]
});

// Response: { success: boolean, messageId?: string, error?: string }
```

---

## Umgebungsvariablen (.env.local)

```bash
# Mail-Versand via Resend (https://resend.com)
RESEND_API_KEY=re_xxxxxxxxxxxx
MAIL_FROM=launchpad@deine-firma.ch
```

`.env.local` wird **nicht** ins Git-Repository committed (via `.gitignore`). Stattdessen liegt eine `.env.local.example` im Repo mit den Variablen-Namen ohne Werte.

---

## Design System

### Farbpalette

```css
:root {
  /* Hintergründe */
  --bg-canvas: #0A0A0F;        /* Fast Schwarz — Haupthintergrund */
  --bg-surface: #12121A;       /* Karten-Hintergrund */
  --bg-elevated: #1C1C2E;      /* Erhöhte Elemente */

  /* Etappen-Farben */
  --color-scan: #3B82F6;       /* Blau */
  --color-target: #10B981;     /* Grün */
  --color-engine: #F59E0B;     /* Amber */
  --color-takeoff: #8B5CF6;    /* Violett */

  /* Text */
  --text-primary: #F4F4F5;
  --text-secondary: #A1A1AA;
  --text-muted: #52525B;

  /* Akzente */
  --accent-glow: rgba(59, 130, 246, 0.15);
}
```

### Typografie

- **Display / Headings**: `Geist` — modern, technisch, klar
- **Body / UI**: `DM Sans` — lesbar, angenehm
- Schriftgrössen: Tailwind-Standard-Scale
- Keine Serifenschriften, keine generischen Systemfonts

### Animation-Prinzipien

- **Zoom-Transition**: 400ms, `easeInOut`, `layoutId` für shared elements
- **Fragen-Einblendung**: `AnimatePresence`, `y: 20 → 0`, `opacity: 0 → 1`, 300ms
- **Flugpfad-Animation**: Gestrichelter SVG-Stroke, `strokeDashoffset` Animation beim Laden
- **Hover-States**: Subtile `scale(1.02)` + Glow-Effekt in Etappen-Farbe
- Kein Overengineering: Jede Animation hat einen funktionalen Grund.

---

## Non-Functional Requirements (NFRs)

| Bereich | Anforderung |
|---|---|
| **Performance** | Lighthouse Score > 85. Keine externen Abhängigkeiten ausser Google Fonts und npm-Pakete. |
| **Browser-Support** | Chrome, Firefox, Safari, Edge — jeweils aktuelle Version. Mobile-Ansicht (tablet) als nice-to-have, nicht primary. |
| **Zugänglichkeit** | ARIA-Labels auf interaktiven Elementen. Fokus-Management beim Zoom-In/Out. Kontrastverhältnis > 4.5:1 für Text. |
| **Datenpersistenz** | `sessionStorage` — kein Server-seitiger State. Daten werden nicht an ein Backend gesendet ausser beim Mail-Versand. |
| **Keine Authentifizierung** | Das Tool ist intern offen zugänglich. Bei Bedarf kann ein einfacher HTTP Basic Auth via nginx/reverse proxy nachgerüstet werden. |
| **Skalierbarkeit** | Single-Instance auf VPS. Kein Load Balancing nötig (internes Tool, niedrige Concurrent-Users). |
| **Deployment** | Docker-Container. Port 3000 intern, via Reverse Proxy (nginx oder Traefik) nach aussen exponiert. HTTPS via Let's Encrypt. |

---

## Versionierung & lokale Entwicklung

### GitHub Repository Setup

```bash
# 1. Neues Repo auf GitHub anlegen (Name: ai-launchpad)
#    Visibility: Private (internes Tool)
#    Kein README, kein .gitignore — wird lokal erstellt

# 2. Lokales Projekt initialisieren
npx create-next-app@latest ai-launchpad --typescript --tailwind --app --no-src-dir --import-alias "@/*"
cd ai-launchpad

# 3. Git Remote verbinden
git remote add origin https://github.com/DEIN-ORG/ai-launchpad.git
git branch -M main

# 4. .gitignore ergänzen (automatisch von create-next-app, sicherstellen dass vorhanden)
# .env.local muss drin sein — niemals API Keys committen

# 5. Erster Push
git add .
git commit -m "chore: initial Next.js setup"
git push -u origin main
```

### Branch-Strategie (einfach, für Solo/Kleinstteam)

```
main          → stabile Version, läuft lokal und später auf VPS
feature/*     → neue Features (z. B. feature/zoom-animation)
fix/*         → Bugfixes
```

**Commit-Konvention** (Conventional Commits):
- `feat: ` — neues Feature
- `fix: ` — Bugfix
- `chore: ` — Setup, Dependencies, Config
- `style: ` — rein visuelle Änderungen
- `docs: ` — Dokumentation

### Lokale Entwicklung

```bash
npm run dev          # Startet auf http://localhost:3000
npm run build        # Produktions-Build testen
npm run lint         # ESLint
```

**Empfehlung für Claude Code**: Starte Claude Code direkt im Projektverzeichnis (`cd ai-launchpad && claude`). Das `CLAUDE.md` liegt im Root des Projekts — Claude Code liest es automatisch beim Start.



```dockerfile
# Dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
services:
  ai-launchpad:
    build: .
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    environment:
      - NODE_ENV=production
```

**Deployment-Befehle:**
```bash
docker-compose up -d --build
docker-compose logs -f ai-launchpad
```

---

## Implementierungs-Reihenfolge

Empfohlene Reihenfolge für Claude Code:

1. **Projekt-Setup**: `npx create-next-app@latest`, Tailwind, Framer Motion, Zustand installieren
2. **Daten-Schicht**: `lib/steps.ts` und `lib/store.ts` — der gesamte Content und State
3. **LaunchpadCanvas**: Übersichts-Seite mit statischen Nodes (ohne Animation)
4. **StepNode + FlightPath**: Visuelle Verbindung der Etappen
5. **Zoom-Animation**: `layoutId`-basierte Transition zwischen Canvas und Step-Seite
6. **QuestionFlow + FlightBrief**: Geführter Fragen-Flow mit Zustand-Integration
7. **GateCheck**: Interaktive Checkliste mit Gate-Logik
8. **ExportScreen + PdfDocument**: PDF-Generierung
9. **API Route + EmailForm**: Mail-Versand
10. **Dockerfile + docker-compose**: Deployment-Setup
11. **Polish**: Animationen, Micro-Interactions, Responsiveness

---

## Bekannte Einschränkungen & Entscheidungen

- **Kein Backend-State**: Bewusste Entscheidung. Für ein internes Workshop-Tool ist `sessionStorage` ausreichend. Kein Datenverlust-Risiko da Ergebnis sofort exportiert wird.
- **PDF Client-seitig**: `@react-pdf/renderer` rendert im Browser. Für sehr grosse Dokumente könnte ein Server-seitiger Ansatz (Puppeteer) sinnvoller sein — für diesen Use Case unnötig.
- **Resend als Mail-Provider**: Benötigt einen API Key (kostenlos bis 3000 Mails/Monat auf resend.com). API Key liegt in `.env.local`, wird nicht ins Repo committed.
- **Keine i18n**: Das Tool ist auf Deutsch. Eine spätere Internationalisierung ist möglich via `next-intl`, ist aber nicht im initialen Scope.
