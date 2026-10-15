import { useEffect } from 'react'

export type Language = 'de' | 'en' | 'sq'

const english: Record<string, string> = {
  'jobsi Startseite': 'jobsi home', 'Bleibt bei dir': 'Stays with you', 'Lohn ist nicht alles. Zum Glück.': 'Salary is not everything. Luckily.',
  'Job vergleichen.': 'Compare jobs.', 'Mehr vom Leben haben.': 'Get more out of life.',
  'Mehr Gehalt klingt gut. Aber was bleibt nach Fahrtkosten und Arbeitsweg wirklich übrig? Vergleiche deinen aktuellen Job mit einem neuen Angebot und entdecke, welcher dir mehr Geld und Freizeit lässt.': 'A higher salary sounds great. But what is really left after commuting costs and travel time? Compare your current job with a new offer and discover which one gives you more money and free time.',
  'Fortschritt': 'Progress', 'Dein Job': 'Your job', 'Neuer Job': 'New job', 'Dein Vergleich': 'Your comparison',
  'Was machst du gerade?': 'What do you do now?', 'Und was steht zur Auswahl?': 'What is the new option?',
  'Trag deinen aktuellen Job ein. Ungefähr reicht für den Anfang.': 'Enter your current job. An estimate is enough to start.',
  'Jetzt dein neues Angebot. Dann schauen wir, was sich für dich verändert.': 'Now enter the new offer. Then we will see what changes for you.',
  'Angaben vom aktuellen Job übernehmen': 'Copy details from current job', 'Zurück': 'Back', 'Weiter zum neuen Job': 'Continue to new job', 'Vergleich ansehen': 'View comparison',
  'Fiktives Beispiel ansehen': 'View sample comparison', 'Keine Anmeldung. Deine Eingaben bleiben lokal.': 'No sign-up. Your entries stay on this device.',
  'Ein ehrlicher Vergleich auf Basis deiner Angaben.': 'An honest comparison based on your information.', 'Datenschutz & Analyse': 'Privacy & analytics',
  'Eine kleine Erinnerung': 'A small reminder', 'Zahlen helfen.': 'Numbers help.', 'Dein Herz entscheidet.': 'Your heart decides.',
  'So hilfreich jobsi ist: Es ist nur ein Datenvergleich. Mach am Ende das, was dir dein Herz sagt. <3': 'As helpful as jobsi is, it is only a data comparison. In the end, do what your heart tells you. <3',
  'Verstanden': 'Got it', 'Hinweis schliessen': 'Close message',
  'Datenschutzfreundliche Analyse': 'Privacy-friendly analytics', 'Hilfst du uns, jobsi zu verbessern?': 'Will you help us improve jobsi?',
  'Mit deiner Zustimmung messen wir anonym, welche Schritte erreicht und welche wichtigen Buttons verwendet werden. Deine Job-, Lohn- und Zeitangaben werden niemals übertragen. Keine Nutzerprofile, keine Sitzungsaufzeichnungen; Verarbeitung über PostHog in der EU.': 'With your consent, we anonymously measure which steps are reached and which important buttons are used. Your job, salary and time details are never transmitted. No user profiles and no session recordings; processing takes place through PostHog in the EU.',
  'Aktuelle Auswahl:': 'Current choice:', 'Analyse erlaubt': 'Analytics allowed', 'Analyse abgelehnt': 'Analytics declined', 'Nur notwendige': 'Essential only', 'Anonyme Analyse erlauben': 'Allow anonymous analytics',
  'Deine Annahmen': 'Your assumptions', 'Währung, Schlaf & Fixkosten': 'Currency, sleep & fixed costs', 'Währung': 'Currency', 'Schlaf pro Nacht': 'Sleep per night',
  'Private Fixkosten': 'Private fixed costs', 'Optional, für beide Jobs gleich': 'Optional, same for both jobs', 'Reservierte private Zeit': 'Reserved personal time', 'Optional, z. B. Betreuung': 'Optional, e.g. care duties', 'Nicht angegeben': 'Not specified',
  'Position (optional)': 'Position (optional)', 'z. B. Pflegefachperson': 'e.g. registered nurse', 'Gehaltszahlungen': 'Salary payments', 'Darstellung des Lohns': 'Salary display', 'Zeitraum': 'Period', 'Lohnart': 'Salary type',
  'Pro Monat': 'Per month', 'Pro Jahr': 'Per year', 'Netto': 'Net', 'Brutto': 'Gross', 'Nettolohn pro Monat': 'Net salary per month', 'Nettolohn pro Jahr': 'Net salary per year', 'Bruttolohn pro Monat': 'Gross salary per month', 'Bruttolohn pro Jahr': 'Gross salary per year',
  'jobsi schätzt keine Steuern oder Abzüge. Alle Geldvergleiche bleiben deshalb brutto.': 'jobsi does not estimate taxes or deductions. All money comparisons therefore remain gross.',
  'Deine Zeit': 'Your time', 'Arbeitstage': 'Working days', 'Arbeitsbeginn': 'Start time', 'Arbeitsende': 'End time', 'Pause': 'Break', 'Ferien': 'Vacation', 'Homeoffice': 'Remote work', 'Arbeitsende ist am Folgetag': 'Work ends the following day',
  'Dein Arbeitsweg': 'Your commute', 'Benzin': 'Petrol', 'Diesel': 'Diesel', 'E-Auto': 'Electric car', 'ÖV': 'Public transport', 'Velo': 'Bike', 'Zu Fuss': 'Walking', 'Nur Homeoffice': 'Fully remote',
  'Dieser Job ist vollständig im Homeoffice.': 'This job is fully remote.', 'Es werden keine Pendelzeit, Strecke oder Pendelkosten berechnet.': 'No commute time, distance or commuting costs are calculated.',
  'Kilometer pro Richtung': 'Kilometres each way', 'Minuten pro Richtung': 'Minutes each way', 'Jobbedingte Zeit vor der Abfahrt': 'Job-related time before departure', 'z. B. früher aufstehen, fertig machen oder warten': 'e.g. getting up earlier, getting ready or waiting',
  'ÖV-Kosten': 'Public transport costs', 'Monatliches Abo': 'Monthly pass', 'Pro Hin- und Rückfahrt': 'Per round trip', 'Abo pro Monat': 'Pass per month', 'Hin- und Rückfahrt': 'Round trip',
  'Genauer rechnen': 'Refine calculation', 'Optional': 'Optional', 'Nur wenn du mehr Details einbeziehen möchtest': 'Only if you want to include more details', 'Du kannst diesen Bereich überspringen. Mit zusätzlichen Angaben wird dein Vergleich lediglich genauer.': 'You can skip this section. Additional information only makes your comparison more precise.',
  'Lohn & Zeit': 'Salary & time', 'Nettobonus pro Jahr': 'Annual net bonus', 'Frei verfügbare Pause': 'Break you can use freely', 'Weitere freie Tage': 'Additional days off', 'Zusätzliche Arbeit': 'Additional work', 'Bonus ist unsicher': 'Bonus is uncertain',
  'Fahrtkosten': 'Commuting costs', 'Verbrauch': 'Consumption', 'Strompreis': 'Electricity price', 'Preis pro Liter': 'Price per litre', 'Deine Annahme, kein Live-Preis': 'Your estimate, not a live price', 'Verschleiss & Wartung': 'Wear & maintenance', 'Parkplatz': 'Parking', 'Weitere Auto-Fixkosten': 'Other fixed car costs',
  'Benefits & Jobkosten': 'Benefits & job costs', 'Mobilitätszuschuss': 'Mobility allowance', 'Geldwerte Benefits': 'Monetary benefits', 'Zusätzliche Jobkosten': 'Additional job costs', 'Weitere Benefits': 'Other benefits', 'Nicht nochmals zählen, wenn im Lohn enthalten': 'Do not count again if included in salary', 'Weiterbildung, Firmenhandy …': 'Training, company phone …',
  'Dein Gefühl': 'Your impression', 'Optional. Unbekannte Werte werden nicht als mittelmässig gewertet.': 'Optional. Unknown values are not treated as average.', 'Interesse': 'Interest', 'Entwicklung': 'Growth', 'Flexibilität': 'Flexibility', 'Arbeitsumfeld': 'Work environment', 'Stabilität': 'Stability',
  'Geschafft': 'Done', 'Das würde sich für dich ändern.': 'This is what would change for you.', 'Keine Wertung, kein Bauchgefühl von uns – nur deine Zahlen, verständlich gemacht.': 'No judgement and no gut feeling from us – just your numbers, made easy to understand.',
  'Das gewinnst du': 'What you gain', 'Das gibst du ab': 'What you give up', 'Das bleibt gleich': 'What stays the same', 'Hier zeigt sich rechnerisch noch kein Vorteil.': 'The numbers do not show an advantage here yet.', 'Hier entsteht rechnerisch kein Nachteil.': 'The numbers do not show a disadvantage here.', 'Bei diesen Angaben bleibt nichts gleich.': 'With these details, nothing stays the same.',
  'Beide Jobs auf einen Blick': 'Both jobs at a glance', 'Aktueller Job': 'Current job', 'Monat': 'Month', 'Jahr': 'Year', 'Kennzahl': 'Metric',
  'Verfügbares Geld': 'Disposable income', 'Bruttolohn nach Jobkosten': 'Gross salary after job costs', 'Keine Steuern oder Abzüge geschätzt': 'Taxes and deductions not estimated', 'Nach Jobkosten': 'After job costs', 'Nach Job- und Fixkosten': 'After job and fixed costs',
  'Zeit für dich': 'Time for yourself', 'Wache Zeit ausserhalb des Jobs, geschätzt': 'Estimated awake time outside work', 'Gebundene Jobzeit': 'Time tied to the job', 'Arbeit, gebundene Pausen und Arbeitsweg': 'Work, tied breaks and commute', 'Nach Jobkosten pro gebundener Stunde': 'After job costs per tied hour', 'Nicht berechenbar': 'Cannot be calculated',
  'Pendelkosten': 'Commuting costs', 'Energie/Tickets plus eingegebene Zusatzkosten': 'Energy/tickets plus entered additional costs', 'Pendelzeit': 'Commute time', 'Zeit vor der Abfahrt': 'Time before departure', 'Jobbedingte Vorbereitung pro Präsenztag': 'Job-related preparation per on-site day', 'Jährlicher Anspruch': 'Annual entitlement', 'Persönliche Passung': 'Personal fit', 'Gewichteter Mittelwert, fehlende Werte ausgeschlossen': 'Weighted average, excluding missing values', 'Nicht bewertet': 'Not rated', 'Keine weiteren': 'No others',
  'Dein rechnerisches Fazit': 'Your calculated result', 'Ob sich der Wechsel persönlich richtig anfühlt, entscheidest natürlich du.': 'Of course, only you can decide whether the change feels right.',
  'Spielerisch ausprobieren': 'Try it out', 'Ab welchem Lohn lohnt’s sich?': 'At what salary is it worth it?', 'Verschiebe den Regler. Dein Vergleich oben aktualisiert sich sofort.': 'Move the slider. Your comparison above updates immediately.', 'Schwelle nicht berechenbar': 'Threshold cannot be calculated', 'Schwelle bereits erreicht': 'Threshold already reached', 'pro Gehaltszahlung': 'per salary payment', 'Gleicher effektiver': 'Same effective', 'Keine Netto-Schätzung.': 'No net estimate.', 'Lohn neues Angebot': 'salary for new offer',
  'Persönliche Faktoren gewichten': 'Weight personal factors', 'Die Gewichtung wirkt auf beide Jobs. Fehlende Bewertungen bleiben ausgeschlossen.': 'The weighting applies to both jobs. Missing ratings remain excluded.', 'Gewichtung': 'Weighting',
  'Wie rechnet jobsi?': 'How does jobsi calculate?', 'Wir rechnen mit 52 Wochen und 365 Tagen. Ferientage werden durch deine tatsächlichen Arbeitstage pro Woche geteilt. Zusätzliche freie Tage wie Feiertage werden separat abgezogen.': 'We calculate with 52 weeks and 365 days. Vacation days are divided by your actual working days per week. Additional days off, such as public holidays, are deducted separately.',
  'Gebundene Jobzeit umfasst das Arbeitszeitfenster abzüglich frei verfügbarer Pause, Pendelzeit, jobbedingte Zeit vor der Abfahrt und zusätzliche Stunden. Private Fixkosten gehören nicht in den effektiven Stundenlohn.': 'Time tied to the job includes the working-time window minus freely usable breaks, plus commute time, job-related preparation and additional hours. Private fixed costs are not included in the effective hourly wage.',
  'Alle Werte sind Schätzungen aus deinen Angaben. Es gibt keine Routen-, Steuer-, Brutto-Netto- oder Währungsberechnung.': 'All values are estimates based on your information. There is no route, tax, gross-to-net or currency calculation.',
  'Angaben ändern': 'Edit details', 'Neu vergleichen': 'Compare again', 'Deine Angaben bleiben in diesem Browser.': 'Your details stay in this browser.',
  'Restart löscht alle Eingaben und setzt sämtliche Werte auf 0. Fortfahren?': 'Restart deletes all entries and resets every value to 0. Continue?', 'Deine Eingaben durch ein fiktives Beispiel ersetzen?': 'Replace your entries with a fictional example?',
  'Bitte zwischen 0 und weniger als 24 Stunden eingeben.': 'Please enter a value from 0 to less than 24 hours.', 'Fixkosten dürfen nicht negativ sein.': 'Fixed costs cannot be negative.', 'Reservierte Zeit darf nicht negativ sein.': 'Reserved time cannot be negative.', 'Die reservierte Zeit übersteigt deine gesamte wache Jahreszeit.': 'The reserved time exceeds your total awake time in a year.', 'Bitte eine Startzeit eingeben.': 'Please enter a start time.', 'Bitte eine Endzeit eingeben.': 'Please enter an end time.', 'Für ein Ende nach Mitternacht bitte «Ende am Folgetag» aktivieren.': 'For an end time after midnight, enable “Work ends the following day”.', 'Ein Arbeitszeitfenster kann höchstens 24 Stunden lang sein.': 'A work-time window can be no longer than 24 hours.', 'Bitte 0 oder einen positiven Wert eingeben.': 'Please enter 0 or a positive value.', 'Mindestens eine Gehaltszahlung erforderlich.': 'At least one salary payment is required.', 'Maximal 7 Arbeitstage pro Woche.': 'A maximum of 7 working days per week is allowed.', 'Homeoffice darf die Arbeitstage nicht übersteigen.': 'Remote-work days cannot exceed working days.', 'Die frei verfügbare Pause darf nicht länger als die Gesamtpause sein.': 'The freely usable break cannot be longer than the total break.', 'Die Pause ist länger als das Arbeitszeitfenster.': 'The break is longer than the work-time window.', 'Ferien und freie Tage übersteigen die möglichen Arbeitstage.': 'Vacation and days off exceed the possible working days.', 'Das übersteigt deine gesamte wache Zeit im Jahr.': 'This exceeds your total awake time in a year.',
  'pro Monat, geschätzt': 'per month, estimated', 'Fast gleich viel wache Zeit ausserhalb des Jobs': 'Almost the same awake time outside work', 'Gleich viele Ferientage': 'The same number of vacation days', 'Gleich viel Homeoffice': 'The same amount of remote work', 'Gleichwertige Benefits': 'Equivalent benefits', 'Fast gleicher Bruttolohn nach Jobkosten': 'Almost the same gross salary after job costs', 'Fast gleich viel verfügbares Geld': 'Almost the same disposable income',
  'Effektiver Netto-Stundenlohn': 'Effective net hourly wage', 'Effektiver Brutto-Stundenlohn': 'Effective gross hourly wage', 'Nettolohn neues Angebot': 'Net salary for new offer', 'Bruttolohn neues Angebot': 'Gross salary for new offer',
  'Rechnerisch liegen beide Jobs fast gleichauf. Jetzt zählen vor allem deine persönlichen Prioritäten.': 'The two jobs are almost equal on paper. Your personal priorities matter most now.', 'Mehr Geld und mehr freie Zeit? Dieses Angebot sieht rechnerisch gut aus.': 'More money and more free time? This offer looks good on paper.', 'Mehr Bruttolohn nach Jobkosten und mehr freie Zeit? Dieses Angebot sieht rechnerisch gut aus.': 'More gross salary after job costs and more free time? This offer looks good on paper.', 'Bei diesen Angaben bringt das Angebot rechnerisch weniger Geld und weniger freie Zeit.': 'With these details, the offer provides less money and less free time.', 'Bei diesen Angaben bringt das Angebot rechnerisch weniger Bruttolohn nach Jobkosten und weniger freie Zeit.': 'With these details, the offer provides less gross salary after job costs and less free time.',
  'pro Monat': 'per month', 'pro Jahr': 'per year', 'pro Woche': 'per week', 'pro Präsenztag': 'per on-site day', 'Std.': 'hrs', 'Std./Woche': 'hrs/week', 'Tage/Jahr': 'days/year', 'Tage/Woche': 'days/week', 'Min.': 'min', 'Min./Präsenztag': 'min/on-site day', '/ Monat': '/ month', '/ Jahr': '/ year',
  'Sprache': 'Language', 'Deutsch': 'German', 'Englisch': 'English', 'Albanisch': 'Albanian',
}

const albanian: Record<string, string> = {
  ...english,
  'jobsi Startseite': 'Faqja kryesore e jobsi', 'Bleibt bei dir': 'Mbetet te ti', 'Lohn ist nicht alles. Zum Glück.': 'Paga nuk është gjithçka. Për fat të mirë.',
  'Job vergleichen.': 'Krahaso punët.', 'Mehr vom Leben haben.': 'Fito më shumë nga jeta.',
  'Mehr Gehalt klingt gut. Aber was bleibt nach Fahrtkosten und Arbeitsweg wirklich übrig? Vergleiche deinen aktuellen Job mit einem neuen Angebot und entdecke, welcher dir mehr Geld und Freizeit lässt.': 'Një pagë më e lartë tingëllon mirë. Por çfarë mbetet pas shpenzimeve dhe kohës së udhëtimit? Krahaso punën aktuale me një ofertë të re dhe zbulo se cila të lë më shumë para dhe kohë të lirë.',
  'Fortschritt': 'Progresi', 'Dein Job': 'Puna jote', 'Neuer Job': 'Puna e re', 'Dein Vergleich': 'Krahasimi yt',
  'Was machst du gerade?': 'Çfarë pune bën tani?', 'Und was steht zur Auswahl?': 'Cila është oferta e re?',
  'Trag deinen aktuellen Job ein. Ungefähr reicht für den Anfang.': 'Shkruaj të dhënat e punës aktuale. Një vlerësim mjafton për të filluar.', 'Jetzt dein neues Angebot. Dann schauen wir, was sich für dich verändert.': 'Tani shkruaj ofertën e re. Pastaj shohim çfarë ndryshon për ty.',
  'Angaben vom aktuellen Job übernehmen': 'Kopjo të dhënat e punës aktuale', 'Zurück': 'Prapa', 'Weiter zum neuen Job': 'Vazhdo te puna e re', 'Vergleich ansehen': 'Shiko krahasimin',
  'Fiktives Beispiel ansehen': 'Shiko një shembull', 'Keine Anmeldung. Deine Eingaben bleiben lokal.': 'Pa regjistrim. Të dhënat mbeten në pajisjen tënde.', 'Ein ehrlicher Vergleich auf Basis deiner Angaben.': 'Një krahasim i sinqertë bazuar në të dhënat e tua.', 'Datenschutz & Analyse': 'Privatësia & analiza',
  'Eine kleine Erinnerung': 'Një kujtesë e vogël', 'Zahlen helfen.': 'Shifrat ndihmojnë.', 'Dein Herz entscheidet.': 'Zemra jote vendos.', 'So hilfreich jobsi ist: Es ist nur ein Datenvergleich. Mach am Ende das, was dir dein Herz sagt. <3': 'Sado i dobishëm të jetë jobsi, është vetëm një krahasim të dhënash. Në fund bëj atë që të thotë zemra. <3', 'Verstanden': 'E kuptova', 'Hinweis schliessen': 'Mbyll njoftimin',
  'Datenschutzfreundliche Analyse': 'Analizë që respekton privatësinë', 'Hilfst du uns, jobsi zu verbessern?': 'A na ndihmon ta përmirësojmë jobsi?', 'Mit deiner Zustimmung messen wir anonym, welche Schritte erreicht und welche wichtigen Buttons verwendet werden. Deine Job-, Lohn- und Zeitangaben werden niemals übertragen. Keine Nutzerprofile, keine Sitzungsaufzeichnungen; Verarbeitung über PostHog in der EU.': 'Me pëlqimin tënd masim në mënyrë anonime hapat e arritur dhe butonat e rëndësishëm të përdorur. Të dhënat për punën, pagën dhe kohën nuk transmetohen kurrë. Pa profile përdoruesish dhe pa regjistrime sesionesh; përpunimi bëhet nga PostHog në BE.',
  'Aktuelle Auswahl:': 'Zgjedhja aktuale:', 'Analyse erlaubt': 'Analiza u lejua', 'Analyse abgelehnt': 'Analiza u refuzua', 'Nur notwendige': 'Vetëm të domosdoshmet', 'Anonyme Analyse erlauben': 'Lejo analizën anonime',
  'Deine Annahmen': 'Supozimet e tua', 'Währung, Schlaf & Fixkosten': 'Monedha, gjumi & shpenzimet fikse', 'Währung': 'Monedha', 'Schlaf pro Nacht': 'Gjumi për natë', 'Private Fixkosten': 'Shpenzime private fikse', 'Optional, für beide Jobs gleich': 'Opsionale, njësoj për të dyja punët', 'Reservierte private Zeit': 'Kohë private e rezervuar', 'Optional, z. B. Betreuung': 'Opsionale, p.sh. kujdes familjar', 'Nicht angegeben': 'Nuk është dhënë',
  'Position (optional)': 'Pozicioni (opsional)', 'z. B. Pflegefachperson': 'p.sh. infermier/e', 'Gehaltszahlungen': 'Pagesat e pagës', 'Darstellung des Lohns': 'Paraqitja e pagës', 'Zeitraum': 'Periudha', 'Lohnart': 'Lloji i pagës', 'Pro Monat': 'Në muaj', 'Pro Jahr': 'Në vit', 'Netto': 'Neto', 'Brutto': 'Bruto', 'Nettolohn pro Monat': 'Paga neto në muaj', 'Nettolohn pro Jahr': 'Paga neto në vit', 'Bruttolohn pro Monat': 'Paga bruto në muaj', 'Bruttolohn pro Jahr': 'Paga bruto në vit',
  'jobsi schätzt keine Steuern oder Abzüge. Alle Geldvergleiche bleiben deshalb brutto.': 'jobsi nuk vlerëson taksat ose zbritjet. Prandaj të gjitha krahasimet financiare mbeten bruto.',
  'Deine Zeit': 'Koha jote', 'Arbeitstage': 'Ditë pune', 'Arbeitsbeginn': 'Fillimi i punës', 'Arbeitsende': 'Mbarimi i punës', 'Pause': 'Pushimi', 'Ferien': 'Pushimet', 'Homeoffice': 'Punë nga shtëpia', 'Arbeitsende ist am Folgetag': 'Puna mbaron ditën tjetër',
  'Dein Arbeitsweg': 'Rruga për në punë', 'Benzin': 'Benzinë', 'Diesel': 'Naftë', 'E-Auto': 'Makinë elektrike', 'ÖV': 'Transport publik', 'Velo': 'Biçikletë', 'Zu Fuss': 'Në këmbë', 'Nur Homeoffice': 'Vetëm nga shtëpia', 'Dieser Job ist vollständig im Homeoffice.': 'Kjo punë bëhet plotësisht nga shtëpia.', 'Es werden keine Pendelzeit, Strecke oder Pendelkosten berechnet.': 'Nuk llogaritet kohë, distancë apo kosto udhëtimi.',
  'Kilometer pro Richtung': 'Kilometra për një drejtim', 'Minuten pro Richtung': 'Minuta për një drejtim', 'Jobbedingte Zeit vor der Abfahrt': 'Kohë përgatitore para nisjes', 'z. B. früher aufstehen, fertig machen oder warten': 'p.sh. zgjim më herët, përgatitje ose pritje', 'ÖV-Kosten': 'Kosto e transportit publik', 'Monatliches Abo': 'Abonim mujor', 'Pro Hin- und Rückfahrt': 'Për vajtje-ardhje', 'Abo pro Monat': 'Abonimi në muaj', 'Hin- und Rückfahrt': 'Vajtje-ardhje',
  'Genauer rechnen': 'Llogarit më saktë', 'Optional': 'Opsionale', 'Nur wenn du mehr Details einbeziehen möchtest': 'Vetëm nëse dëshiron më shumë hollësi', 'Du kannst diesen Bereich überspringen. Mit zusätzlichen Angaben wird dein Vergleich lediglich genauer.': 'Mund ta kalosh këtë pjesë. Të dhënat shtesë vetëm e bëjnë krahasimin më të saktë.',
  'Lohn & Zeit': 'Paga & koha', 'Nettobonus pro Jahr': 'Bonusi neto vjetor', 'Frei verfügbare Pause': 'Pushim i lirë', 'Weitere freie Tage': 'Ditë të tjera pushimi', 'Zusätzliche Arbeit': 'Punë shtesë', 'Bonus ist unsicher': 'Bonusi është i pasigurt', 'Fahrtkosten': 'Kosto udhëtimi', 'Verbrauch': 'Konsumi', 'Strompreis': 'Çmimi i energjisë', 'Preis pro Liter': 'Çmimi për litër', 'Deine Annahme, kein Live-Preis': 'Vlerësimi yt, jo çmim aktual', 'Verschleiss & Wartung': 'Amortizim & mirëmbajtje', 'Parkplatz': 'Parkimi', 'Weitere Auto-Fixkosten': 'Shpenzime të tjera fikse të makinës',
  'Benefits & Jobkosten': 'Përfitime & kosto pune', 'Mobilitätszuschuss': 'Shtesë transporti', 'Geldwerte Benefits': 'Përfitime monetare', 'Zusätzliche Jobkosten': 'Kosto shtesë pune', 'Weitere Benefits': 'Përfitime të tjera', 'Nicht nochmals zählen, wenn im Lohn enthalten': 'Mos e numëro sërish nëse përfshihet në pagë', 'Weiterbildung, Firmenhandy …': 'Trajnim, telefon pune …', 'Dein Gefühl': 'Përshtypja jote', 'Optional. Unbekannte Werte werden nicht als mittelmässig gewertet.': 'Opsionale. Vlerat e panjohura nuk llogariten si mesatare.', 'Interesse': 'Interesi', 'Entwicklung': 'Zhvillimi', 'Flexibilität': 'Fleksibiliteti', 'Arbeitsumfeld': 'Mjedisi i punës', 'Stabilität': 'Stabiliteti',
  'Geschafft': 'U krye', 'Das würde sich für dich ändern.': 'Kjo do të ndryshonte për ty.', 'Keine Wertung, kein Bauchgefühl von uns – nur deine Zahlen, verständlich gemacht.': 'Pa gjykim nga ne – vetëm shifrat e tua, të shpjeguara qartë.', 'Das gewinnst du': 'Çfarë fiton', 'Das gibst du ab': 'Çfarë humbet', 'Das bleibt gleich': 'Çfarë mbetet njësoj', 'Hier zeigt sich rechnerisch noch kein Vorteil.': 'Llogaritja nuk tregon ende ndonjë avantazh.', 'Hier entsteht rechnerisch kein Nachteil.': 'Llogaritja nuk tregon ndonjë disavantazh.', 'Bei diesen Angaben bleibt nichts gleich.': 'Me këto të dhëna asgjë nuk mbetet njësoj.',
  'Beide Jobs auf einen Blick': 'Të dyja punët me një shikim', 'Aktueller Job': 'Puna aktuale', 'Monat': 'Muaj', 'Jahr': 'Vit', 'Kennzahl': 'Treguesi', 'Verfügbares Geld': 'Para të disponueshme', 'Bruttolohn nach Jobkosten': 'Paga bruto pas kostove të punës', 'Keine Steuern oder Abzüge geschätzt': 'Taksat dhe zbritjet nuk janë vlerësuar', 'Nach Jobkosten': 'Pas kostove të punës', 'Nach Job- und Fixkosten': 'Pas kostove të punës dhe atyre fikse',
  'Zeit für dich': 'Kohë për veten', 'Wache Zeit ausserhalb des Jobs, geschätzt': 'Kohë e zgjuar jashtë punës, e vlerësuar', 'Gebundene Jobzeit': 'Kohë e lidhur me punën', 'Arbeit, gebundene Pausen und Arbeitsweg': 'Puna, pushimet e lidhura dhe udhëtimi', 'Nach Jobkosten pro gebundener Stunde': 'Pas kostove të punës për orë të lidhur', 'Nicht berechenbar': 'Nuk mund të llogaritet', 'Pendelkosten': 'Kosto udhëtimi', 'Energie/Tickets plus eingegebene Zusatzkosten': 'Energji/bileta plus kostot shtesë', 'Pendelzeit': 'Koha e udhëtimit', 'Zeit vor der Abfahrt': 'Koha para nisjes', 'Jobbedingte Vorbereitung pro Präsenztag': 'Përgatitje për punë për ditë në vend', 'Jährlicher Anspruch': 'E drejta vjetore', 'Persönliche Passung': 'Përshtatja personale', 'Gewichteter Mittelwert, fehlende Werte ausgeschlossen': 'Mesatare e ponderuar, pa vlerat që mungojnë', 'Nicht bewertet': 'Pa vlerësim', 'Keine weiteren': 'Asnjë tjetër',
  'Dein rechnerisches Fazit': 'Përfundimi i llogaritur', 'Ob sich der Wechsel persönlich richtig anfühlt, entscheidest natürlich du.': 'Vetëm ti vendos nëse ndryshimi të duket i duhur.', 'Spielerisch ausprobieren': 'Provoje', 'Ab welchem Lohn lohnt’s sich?': 'Nga cila pagë ia vlen?', 'Verschiebe den Regler. Dein Vergleich oben aktualisiert sich sofort.': 'Lëviz rrëshqitësin. Krahasimi përditësohet menjëherë.', 'Schwelle nicht berechenbar': 'Pragu nuk mund të llogaritet', 'Schwelle bereits erreicht': 'Pragu është arritur', 'pro Gehaltszahlung': 'për pagesë page', 'Keine Netto-Schätzung.': 'Pa vlerësim neto.', 'Lohn neues Angebot': 'paga e ofertës së re',
  'Persönliche Faktoren gewichten': 'Pesho faktorët personalë', 'Die Gewichtung wirkt auf beide Jobs. Fehlende Bewertungen bleiben ausgeschlossen.': 'Peshimi zbatohet për të dyja punët. Vlerësimet që mungojnë përjashtohen.', 'Gewichtung': 'Peshimi', 'Wie rechnet jobsi?': 'Si llogarit jobsi?', 'Wir rechnen mit 52 Wochen und 365 Tagen. Ferientage werden durch deine tatsächlichen Arbeitstage pro Woche geteilt. Zusätzliche freie Tage wie Feiertage werden separat abgezogen.': 'Llogarisim me 52 javë dhe 365 ditë. Ditët e pushimit ndahen sipas ditëve reale të punës në javë. Ditët e tjera të lira zbriten veçmas.', 'Gebundene Jobzeit umfasst das Arbeitszeitfenster abzüglich frei verfügbarer Pause, Pendelzeit, jobbedingte Zeit vor der Abfahrt und zusätzliche Stunden. Private Fixkosten gehören nicht in den effektiven Stundenlohn.': 'Koha e lidhur me punën përfshin orarin e punës pa pushimin e lirë, udhëtimin, përgatitjen para nisjes dhe orët shtesë. Shpenzimet private fikse nuk përfshihen në pagën efektive për orë.', 'Alle Werte sind Schätzungen aus deinen Angaben. Es gibt keine Routen-, Steuer-, Brutto-Netto- oder Währungsberechnung.': 'Të gjitha vlerat janë vlerësime nga të dhënat e tua. Nuk bëhet llogaritje rruge, taksash, bruto-neto apo këmbimi valutor.',
  'Angaben ändern': 'Ndrysho të dhënat', 'Neu vergleichen': 'Krahaso përsëri', 'Deine Angaben bleiben in diesem Browser.': 'Të dhënat e tua mbeten në këtë shfletues.', 'pro Monat': 'në muaj', 'pro Jahr': 'në vit', 'pro Woche': 'në javë', 'pro Präsenztag': 'për ditë në vend', 'Std.': 'orë', 'Std./Woche': 'orë/javë', 'Tage/Jahr': 'ditë/vit', 'Tage/Woche': 'ditë/javë', 'Min.': 'min', 'Min./Präsenztag': 'min/ditë në vend', '/ Monat': '/ muaj', '/ Jahr': '/ vit',
  'Restart löscht alle Eingaben und setzt sämtliche Werte auf 0. Fortfahren?': 'Restart i fshin të gjitha të dhënat dhe i kthen vlerat në 0. Të vazhdojmë?', 'Deine Eingaben durch ein fiktives Beispiel ersetzen?': 'Të zëvendësohen të dhënat e tua me një shembull?',
  'Bitte zwischen 0 und weniger als 24 Stunden eingeben.': 'Shkruaj një vlerë nga 0 deri në më pak se 24 orë.', 'Fixkosten dürfen nicht negativ sein.': 'Shpenzimet fikse nuk mund të jenë negative.', 'Reservierte Zeit darf nicht negativ sein.': 'Koha e rezervuar nuk mund të jetë negative.', 'Die reservierte Zeit übersteigt deine gesamte wache Jahreszeit.': 'Koha e rezervuar tejkalon gjithë kohën vjetore kur je zgjuar.', 'Bitte eine Startzeit eingeben.': 'Shkruaj orën e fillimit.', 'Bitte eine Endzeit eingeben.': 'Shkruaj orën e mbarimit.', 'Für ein Ende nach Mitternacht bitte «Ende am Folgetag» aktivieren.': 'Për mbarim pas mesnate aktivizo “Puna mbaron ditën tjetër”.', 'Ein Arbeitszeitfenster kann höchstens 24 Stunden lang sein.': 'Orari i punës mund të jetë maksimumi 24 orë.', 'Bitte 0 oder einen positiven Wert eingeben.': 'Shkruaj 0 ose një vlerë pozitive.', 'Mindestens eine Gehaltszahlung erforderlich.': 'Nevojitet të paktën një pagesë page.', 'Maximal 7 Arbeitstage pro Woche.': 'Lejohen maksimumi 7 ditë pune në javë.', 'Homeoffice darf die Arbeitstage nicht übersteigen.': 'Ditët nga shtëpia nuk mund të tejkalojnë ditët e punës.', 'Die frei verfügbare Pause darf nicht länger als die Gesamtpause sein.': 'Pushimi i lirë nuk mund të jetë më i gjatë se pushimi total.', 'Die Pause ist länger als das Arbeitszeitfenster.': 'Pushimi është më i gjatë se orari i punës.', 'Ferien und freie Tage übersteigen die möglichen Arbeitstage.': 'Pushimet dhe ditët e lira tejkalojnë ditët e mundshme të punës.', 'Das übersteigt deine gesamte wache Zeit im Jahr.': 'Kjo tejkalon gjithë kohën vjetore kur je zgjuar.',
  'pro Monat, geschätzt': 'në muaj, e vlerësuar', 'Fast gleich viel wache Zeit ausserhalb des Jobs': 'Pothuajse e njëjta kohë e zgjuar jashtë punës', 'Gleich viele Ferientage': 'Numër i njëjtë ditësh pushimi', 'Gleich viel Homeoffice': 'E njëjta sasi pune nga shtëpia', 'Gleichwertige Benefits': 'Përfitime me vlerë të njëjtë', 'Fast gleicher Bruttolohn nach Jobkosten': 'Pothuajse e njëjta pagë bruto pas kostove të punës', 'Fast gleich viel verfügbares Geld': 'Pothuajse e njëjta shumë parash të disponueshme',
  'Effektiver Netto-Stundenlohn': 'Paga efektive neto për orë', 'Effektiver Brutto-Stundenlohn': 'Paga efektive bruto për orë', 'Nettolohn neues Angebot': 'Paga neto e ofertës së re', 'Bruttolohn neues Angebot': 'Paga bruto e ofertës së re',
  'Rechnerisch liegen beide Jobs fast gleichauf. Jetzt zählen vor allem deine persönlichen Prioritäten.': 'Sipas llogaritjes, të dyja punët janë pothuajse të barabarta. Tani vlejnë më shumë përparësitë e tua personale.', 'Mehr Geld und mehr freie Zeit? Dieses Angebot sieht rechnerisch gut aus.': 'Më shumë para dhe më shumë kohë të lirë? Kjo ofertë duket mirë sipas llogaritjes.', 'Mehr Bruttolohn nach Jobkosten und mehr freie Zeit? Dieses Angebot sieht rechnerisch gut aus.': 'Më shumë pagë bruto pas kostove dhe më shumë kohë të lirë? Kjo ofertë duket mirë sipas llogaritjes.', 'Bei diesen Angaben bringt das Angebot rechnerisch weniger Geld und weniger freie Zeit.': 'Me këto të dhëna, oferta sjell më pak para dhe më pak kohë të lirë.', 'Bei diesen Angaben bringt das Angebot rechnerisch weniger Bruttolohn nach Jobkosten und weniger freie Zeit.': 'Me këto të dhëna, oferta sjell më pak pagë bruto pas kostove dhe më pak kohë të lirë.',
  'Sprache': 'Gjuha', 'Deutsch': 'Gjermanisht', 'Englisch': 'Anglisht', 'Albanisch': 'Shqip',
}

const dictionaries = { en: english, sq: albanian }
const textOriginals = new WeakMap<Text, string>()
const attributeOriginals = new WeakMap<Element, Map<string, string>>()

export function translatedValue(source: string, language: Language) {
  if (language === 'de') return source
  const dictionary = dictionaries[language]
  const leading = source.match(/^\s*/)?.[0] ?? ''
  const trailing = source.match(/\s*$/)?.[0] ?? ''
  const clean = source.trim()
  if (!clean) return source
  const exact = dictionary[clean]
  if (exact) return `${leading}${exact}${trailing}`

  const replacements = language === 'en'
    ? [[' Std. mehr Zeit für dich', ' hrs more time for yourself'], [' Std. weniger Zeit für dich', ' hrs less time for yourself'], [' Ferientage mehr', ' more vacation days'], [' Ferientage weniger', ' fewer vacation days'], [' Homeoffice-Tag(e) mehr', ' more remote-work day(s)'], [' Homeoffice-Tag(e) weniger', ' fewer remote-work day(s)'], [' mehr Benefits', ' more benefits'], [' weniger Benefits', ' fewer benefits'], [' mehr pro Monat', ' more per month'], [' weniger pro Monat', ' less per month']]
    : [[' Std. mehr Zeit für dich', ' orë më shumë për veten'], [' Std. weniger Zeit für dich', ' orë më pak për veten'], [' Ferientage mehr', ' ditë pushimi më shumë'], [' Ferientage weniger', ' ditë pushimi më pak'], [' Homeoffice-Tag(e) mehr', ' ditë pune nga shtëpia më shumë'], [' Homeoffice-Tag(e) weniger', ' ditë pune nga shtëpia më pak'], [' mehr Benefits', ' më shumë përfitime'], [' weniger Benefits', ' më pak përfitime'], [' mehr pro Monat', ' më shumë në muaj'], [' weniger pro Monat', ' më pak në muaj']]
  let result = clean
  for (const [from, to] of replacements) result = result.replace(from, to)
  return `${leading}${result}${trailing}`
}

function localizeText(node: Text, language: Language) {
  const current = node.data
  let original = textOriginals.get(node)
  if (original == null) {
    original = current
    textOriginals.set(node, original)
  } else if (![original, translatedValue(original, 'en'), translatedValue(original, 'sq')].includes(current)) {
    original = current
    textOriginals.set(node, original)
  }
  const next = translatedValue(original, language)
  if (current !== next) node.data = next
}

function localizeElement(element: Element, language: Language) {
  let originals = attributeOriginals.get(element)
  if (!originals) { originals = new Map(); attributeOriginals.set(element, originals) }
  for (const name of ['placeholder', 'aria-label', 'title']) {
    const current = element.getAttribute(name)
    if (current == null) continue
    let original = originals.get(name)
    if (original == null) { original = current; originals.set(name, original) }
    const next = translatedValue(original, language)
    if (current !== next) element.setAttribute(name, next)
  }
}

function localizeTree(root: Node, language: Language) {
  if (root.nodeType === Node.TEXT_NODE) localizeText(root as Text, language)
  if (root.nodeType === Node.ELEMENT_NODE) localizeElement(root as Element, language)
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
  let node = walker.nextNode()
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) localizeText(node as Text, language)
    else localizeElement(node as Element, language)
    node = walker.nextNode()
  }
}

export function useLocalization(language: Language) {
  useEffect(() => {
    document.documentElement.lang = language === 'sq' ? 'sq' : language === 'en' ? 'en' : 'de-CH'
    const root = document.getElementById('top')
    if (!root) return
    localizeTree(root, language)
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'characterData') localizeText(record.target as Text, language)
        else if (record.type === 'attributes') localizeElement(record.target as Element, language)
        else for (const node of record.addedNodes) localizeTree(node, language)
      }
    })
    observer.observe(root, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'aria-label', 'title'] })
    return () => observer.disconnect()
  }, [language])
}
