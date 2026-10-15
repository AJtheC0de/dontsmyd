# jobsi

jobsi vergleicht den aktuellen Job mit einem konkreten Angebot – finanziell, zeitlich und persönlich. Die App läuft vollständig im Browser; Eingaben werden nur im lokalen Browser-Speicher abgelegt.

## Lokal starten

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install
npm run dev
```

Qualitätsprüfungen:

```bash
npm test
npm run build
```

## Rechenmodell

- Alle Berechnungen verwenden ein konsistentes Jahresmodell mit 52 Wochen und 365 Tagen.
- Löhne können monatlich oder jährlich sowie netto oder brutto eingegeben werden. Zwischen brutto und netto findet bewusst keine automatische Umrechnung statt.
- Arbeitswochen sind `52 − Ferienwochen`. Zusätzliche freie Tage werden proportional auf Präsenz und Homeoffice verteilt.
- Gebundene Jobzeit umfasst Arbeitszeitfenster abzüglich frei verfügbarer Pausen, Pendelzeit sowie regelmässige Zusatzstunden.
- Der effektive Stundenlohn ist das nach expliziten Jobkosten verfügbare Jahresnetto geteilt durch die gebundene Jobzeit. Private Fixkosten werden dafür bewusst nicht abgezogen.
- Es gibt keine Routen-, Steuer-, Brutto-Netto- oder Währungsberechnung und keine Abfrage aktueller Energiepreise.
- Persönliche Scores sind gewichtete Mittelwerte; fehlende Bewertungen werden ausgeschlossen und erzeugen keine künstlichen Mittelwerte.

## GitHub

```bash
git init
git add .
git commit -m "Initial jobsi app"
git branch -M main
git remote add origin https://github.com/DEIN-NAME/jobsi.git
git push -u origin main
```

## Vercel

1. Repository in Vercel über **Add New → Project** importieren.
2. Framework Preset **Vite** wählen (wird in der Regel automatisch erkannt).
3. Build Command: `npm run build`; Output Directory: `dist`.
4. Deploy auslösen und danach `jobsi.work` unter **Settings → Domains** verbinden.

Die enthaltene `vercel.json` leitet direkte Aufrufe clientseitiger Routen an `index.html` weiter.

## Datenschutzfreundliche Analyse

Die optionale PostHog-Integration wird nur geladen, nachdem eine Person der anonymen Analyse ausdrücklich zugestimmt hat. Ohne `VITE_POSTHOG_KEY` bleibt sie vollständig deaktiviert und der Consent-Dialog wird nicht angezeigt.

In Vercel konfigurieren:

```bash
VITE_POSTHOG_KEY=phc_...
VITE_POSTHOG_HOST=https://eu.i.posthog.com
```

Im PostHog-EU-Projekt zusätzlich **Cookieless server hash mode** aktivieren. Die App deaktiviert Autocapture, automatische Seitenaufrufe, Nutzerprofile, Geolokalisierung und Session Replay. Erfasst werden ausschliesslich die definierten Funnel- und Button-Events; Formulareingaben werden nie als Event-Eigenschaften übertragen.

Empfohlener Funnel:

1. `app_viewed`
2. `comparison_started`
3. `step_completed` mit `step = current_job`
4. `step_completed` mit `step = new_job`
5. `results_viewed`

Vor der Aktivierung müssen die Betreiberangaben, Aufbewahrungsdauer und Betroffenenrechte in einer vollständigen Datenschutzerklärung ergänzt sowie der Auftragsverarbeitungsvertrag mit PostHog abgeschlossen werden.
