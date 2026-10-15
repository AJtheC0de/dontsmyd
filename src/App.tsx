import { useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { ArrowLeft, ArrowRight, Bike, Briefcase, BusFront, CarFront, Check, ChevronDown, CircleDollarSign, Clock3, Copy, Equal, Footprints, Fuel, Gift, Heart, Home, Info, Laptop, LockKeyhole, ParkingCircle, Plus, RotateCcw, Sparkles, SunMedium, TrendingDown, TrendingUp, WalletCards, X, Zap } from 'lucide-react'
import logoUrl from '../logo.png'
import type { AppData, JobInput, JobResult, RatingKey, Transport } from './types'
import { calculateJob, requiredSalaryPerPayment } from './calculations'
import { defaultData, exampleData, restartData } from './data'
import { clearData, loadData, saveData } from './storage'
import { validateJob, validateSituation, type Errors } from './validation'
import { Field, NumberInput, Select, Toggle } from './components'
import { analyticsConfigured, capture, getAnalyticsConsent, initializeAnalytics, setAnalyticsConsent, type AnalyticsConsent } from './analytics'

const ratingLabels: Record<RatingKey, string> = { interest: 'Interesse', growth: 'Entwicklung', flexibility: 'Flexibilität', environment: 'Arbeitsumfeld', stability: 'Stabilität' }
const transportOptions: { value: Transport; label: string; icon: typeof CarFront }[] = [
  { value: 'petrol', label: 'Benzin', icon: Fuel }, { value: 'diesel', label: 'Diesel', icon: CarFront }, { value: 'electric', label: 'E-Auto', icon: Zap },
  { value: 'transit', label: 'ÖV', icon: BusFront }, { value: 'bike', label: 'Velo', icon: Bike }, { value: 'walk', label: 'Zu Fuss', icon: Footprints },
  { value: 'remote', label: 'Nur Homeoffice', icon: Laptop },
]
const steps = ['Dein Job', 'Neuer Job', 'Dein Vergleich']
const fmt = (value: number, currency: string, digits = 0) => new Intl.NumberFormat('de-CH', { style: 'currency', currency, maximumFractionDigits: digits }).format(value)
const n = (value: number, digits = 0) => new Intl.NumberFormat('de-CH', { maximumFractionDigits: digits }).format(value)
const jobName = (job: JobInput, fallback: string) => job.position.trim() || job.company.trim() || fallback

function Logo() { return <a href="/home" className="jobsi-logo" aria-label="jobsi Startseite"><img src={logoUrl} alt="jobsi" /></a> }

function App() {
  const initial = useMemo(loadData, [])
  const [data, setData] = useState(initial.data)
  const [step, setStep] = useState(0)
  const [errors, setErrors] = useState<Errors>({})
  const [storageWarning, setStorageWarning] = useState(initial.warning ?? '')
  const [heartMessageOpen, setHeartMessageOpen] = useState(false)
  const [analyticsConsent, setConsentState] = useState<AnalyticsConsent>(getAnalyticsConsent)
  const [analyticsSettingsOpen, setAnalyticsSettingsOpen] = useState(() => analyticsConfigured && getAnalyticsConsent() === null)
  const appRef = useRef<HTMLElement>(null)
  const comparisonStarted = useRef(false)
  const resultsTracked = useRef(false)
  const current = useMemo(() => calculateJob(data.current, data.situation, data.weights), [data])
  const offer = useMemo(() => calculateJob(data.offer, data.situation, data.weights), [data])

  useEffect(() => {
    const timeout = window.setTimeout(() => { if (!saveData(data)) setStorageWarning('Lokales Speichern ist blockiert. Deine Eingaben gehen beim Schliessen verloren.') }, 300)
    return () => window.clearTimeout(timeout)
  }, [data])

  useEffect(() => { if (analyticsConsent === 'accepted') void initializeAnalytics() }, [analyticsConsent])

  useEffect(() => {
    if (step !== 2) { resultsTracked.current = false; return }
    if (analyticsConsent !== 'accepted') return
    if (!resultsTracked.current) { resultsTracked.current = true; capture('results_viewed') }
  }, [analyticsConsent, step])

  useEffect(() => {
    const root = document.getElementById('top')
    const trackButton = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-analytics]') : null
      if (target?.dataset.analytics) capture('button_clicked', { button: target.dataset.analytics })
    }
    root?.addEventListener('click', trackButton)
    return () => root?.removeEventListener('click', trackButton)
  }, [])

  useEffect(() => {
    let alreadyShown = false
    try { alreadyShown = sessionStorage.getItem('jobsi-heart-message') === 'shown' } catch { /* session storage may be blocked */ }
    if (alreadyShown) return
    const timeout = window.setTimeout(() => setHeartMessageOpen(true), 5000)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!heartMessageOpen) return
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') closeHeartMessage() }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [heartMessageOpen])

  const closeHeartMessage = () => {
    setHeartMessageOpen(false)
    try { sessionStorage.setItem('jobsi-heart-message', 'shown') } catch { /* session storage may be blocked */ }
  }

  const markComparisonStarted = () => {
    if (analyticsConsent !== 'accepted') return
    if (comparisonStarted.current) return
    comparisonStarted.current = true
    capture('comparison_started')
  }
  const moveTo = (next: number) => { setStep(next); setErrors({}); window.setTimeout(() => appRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 20) }
  const updateJob = (which: 'current' | 'offer', patch: Partial<JobInput>) => setData((old) => ({ ...old, [which]: { ...old[which], ...patch } }))
  const validateAndContinue = () => {
    const job = step === 0 ? data.current : data.offer
    const found = { ...validateSituation(data), ...validateJob(job) }
    const result = step === 0 ? current : offer
    if (result.boundHours > 365 * (24 - data.situation.sleepHours)) found.extraHoursWeekly = 'Das übersteigt deine gesamte wache Zeit im Jahr.'
    setErrors(found)
    if (Object.keys(found).length) {
      capture('step_validation_failed', { step: step === 0 ? 'current_job' : 'new_job', error_count: Object.keys(found).length })
      return
    }
    capture('step_completed', { step: step === 0 ? 'current_job' : 'new_job' })
    moveTo(step + 1)
  }
  const reset = () => { if (!window.confirm('Restart löscht alle Eingaben und setzt sämtliche Werte auf 0. Fortfahren?')) return; clearData(); setData(restartData()); comparisonStarted.current = false; moveTo(0) }
  const loadExample = () => { if (!window.confirm('Deine Eingaben durch ein fiktives Beispiel ersetzen?')) return; setData(exampleData()); moveTo(2) }
  const chooseAnalytics = (next: Exclude<AnalyticsConsent, null>) => {
    setAnalyticsConsent(next)
    setConsentState(next)
    setAnalyticsSettingsOpen(false)
  }

  return <div id="top">
    <header className="site-header"><Logo /><div className="header-actions"><span><LockKeyhole size={15} /> Bleibt bei dir</span><button data-analytics="restart_header" onClick={reset}><RotateCcw /> Restart</button></div></header>
    <main>
      <section className="intro"><div className="intro-kicker"><Sparkles size={15} /> Lohn ist nicht alles. Zum Glück.</div><h1>Neuer Job.<br /><span>Besseres Leben?</span></h1><p>Erfahre, ob sich dein Jobwechsel wirklich lohnt – für dein Konto und deine Freizeit.</p></section>
      <section className="tool-shell" ref={appRef}>
        <nav className="stepper" aria-label="Fortschritt">{steps.map((label, index) => <div key={label} className={index === step ? 'active' : index < step ? 'done' : ''}><span>{index < step ? <Check size={16} /> : index + 1}</span><b>{label}</b>{index < steps.length - 1 && <i />}</div>)}</nav>
        {storageWarning && <div className="inline-warning" role="status"><Info size={17} />{storageWarning}</div>}
        {step < 2 && <div className="form-card" onPointerDownCapture={markComparisonStarted} onChangeCapture={markComparisonStarted}>
          <div className="form-title"><span>{step === 0 ? '01' : '02'}</span><div><h2>{step === 0 ? 'Was machst du gerade?' : 'Und was steht zur Auswahl?'}</h2><p>{step === 0 ? 'Trag deinen aktuellen Job ein. Ungefähr reicht für den Anfang.' : 'Jetzt dein neues Angebot. Dann schauen wir, was sich für dich verändert.'}</p></div></div>
          {step === 1 && <button className="copy-button" data-analytics="copy_current_job" onClick={() => setData((old) => ({ ...old, offer: { ...old.current } }))}><Copy size={16} /> Angaben vom aktuellen Job übernehmen</button>}
          {step === 0 && <Assumptions data={data} setData={setData} errors={errors} />}
          <JobForm job={step === 0 ? data.current : data.offer} update={(patch) => updateJob(step === 0 ? 'current' : 'offer', patch)} errors={errors} currency={data.situation.currency} salaryPeriod={data.situation.salaryPeriod} salaryKind={data.situation.salaryKind} updateSalaryMode={(patch) => setData((old) => ({ ...old, situation: { ...old.situation, ...patch } }))} />
          <div className="form-actions">{step === 1 && <button className="round-button back" data-analytics="back_to_current_job" onClick={() => moveTo(0)}><ArrowLeft /> Zurück</button>}<button className="round-button primary" data-analytics={step === 0 ? 'continue_to_new_job' : 'view_comparison'} onClick={validateAndContinue}>{step === 0 ? 'Weiter zum neuen Job' : 'Vergleich ansehen'} {step === 0 ? <ArrowRight /> : <Sparkles />}</button></div>
        </div>}
        {step === 2 && <Results data={data} setData={setData} current={current} offer={offer} onEdit={() => moveTo(0)} onReset={reset} />}
      </section>
      <div className="below-tool"><button data-analytics="load_example" onClick={loadExample}>Fiktives Beispiel ansehen</button><span><LockKeyhole size={14} /> Keine Anmeldung. Deine Eingaben bleiben lokal.</span></div>
    </main>
    <footer><Logo /><p>Ein ehrlicher Vergleich auf Basis deiner Angaben.</p>{analyticsConfigured && <button className="privacy-button" onClick={() => setAnalyticsSettingsOpen(true)}>Datenschutz & Analyse</button>}<span>© {new Date().getFullYear()} jobsi</span></footer>
    {heartMessageOpen && <div className="heart-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeHeartMessage() }}><section className="heart-modal" role="dialog" aria-modal="true" aria-labelledby="heart-message-title"><button className="heart-close" onClick={closeHeartMessage} aria-label="Hinweis schliessen"><X /></button><span className="heart-icon"><Heart fill="currentColor" /></span><small>Eine kleine Erinnerung</small><h2 id="heart-message-title">Zahlen helfen.<br />Dein Herz entscheidet.</h2><p>So hilfreich jobsi ist: Es ist nur ein Datenvergleich. Mach am Ende das, was dir dein Herz sagt. &lt;3</p><button className="round-button primary" onClick={closeHeartMessage}>Verstanden <Heart size={17} /></button></section></div>}
    {analyticsSettingsOpen && <AnalyticsConsentPanel consent={analyticsConsent} onChoose={chooseAnalytics} />}
  </div>
}

function AnalyticsConsentPanel({ consent, onChoose }: { consent: AnalyticsConsent; onChoose: (consent: Exclude<AnalyticsConsent, null>) => void }) {
  return <aside className="analytics-consent" role="dialog" aria-labelledby="analytics-title" aria-describedby="analytics-description">
    <div><small>Datenschutzfreundliche Analyse</small><h2 id="analytics-title">Hilfst du uns, jobsi zu verbessern?</h2><p id="analytics-description">Mit deiner Zustimmung messen wir anonym, welche Schritte erreicht und welche wichtigen Buttons verwendet werden. Deine Job-, Lohn- und Zeitangaben werden niemals übertragen. Keine Nutzerprofile, keine Sitzungsaufzeichnungen; Verarbeitung über PostHog in der EU.</p>{consent && <p className="consent-status">Aktuelle Auswahl: <strong>{consent === 'accepted' ? 'Analyse erlaubt' : 'Analyse abgelehnt'}</strong></p>}</div>
    <div className="analytics-actions"><button type="button" className="round-button back" onClick={() => onChoose('rejected')}>Nur notwendige</button><button type="button" className="round-button primary" onClick={() => onChoose('accepted')}>Anonyme Analyse erlauben</button></div>
  </aside>
}

function Assumptions({ data, setData, errors }: { data: AppData; setData: Dispatch<SetStateAction<AppData>>; errors: Errors }) {
  const update = <K extends keyof AppData['situation']>(key: K, value: AppData['situation'][K]) => setData((old) => ({ ...old, situation: { ...old.situation, [key]: value } }))
  return <details className="assumptions"><summary><span><SunMedium size={18} /> Deine Annahmen</span><small>Währung, Schlaf & Fixkosten</small><ChevronDown /></summary><div className="assumption-grid">
    <Field label="Währung"><Select value={data.situation.currency} onChange={(e) => update('currency', e.target.value as 'CHF' | 'EUR')}><option>CHF</option><option>EUR</option></Select></Field>
    <Field label="Schlaf pro Nacht" error={errors.sleepHours} unit="Std."><NumberInput min="0" max="23.9" step="0.25" value={data.situation.sleepHours} onChange={(e) => update('sleepHours', e.target.valueAsNumber)} /></Field>
    <Field label="Private Fixkosten" hint="Optional, für beide Jobs gleich" error={errors.fixedCostsMonthly} unit="pro Monat"><NumberInput min="0" placeholder="Nicht angegeben" value={data.situation.fixedCostsMonthly ?? ''} onChange={(e) => update('fixedCostsMonthly', e.target.value === '' ? undefined : e.target.valueAsNumber)} /></Field>
    <Field label="Reservierte private Zeit" hint="Optional, z. B. Betreuung" error={errors.reservedPrivateHoursWeekly} unit="Std./Woche"><NumberInput min="0" step=".5" placeholder="Nicht angegeben" value={data.situation.reservedPrivateHoursWeekly ?? ''} onChange={(e) => update('reservedPrivateHoursWeekly', e.target.value === '' ? undefined : e.target.valueAsNumber)} /></Field>
  </div></details>
}

function JobForm({ job, update, errors, currency, salaryPeriod, salaryKind, updateSalaryMode }: { job: JobInput; update: (patch: Partial<JobInput>) => void; errors: Errors; currency: string; salaryPeriod: AppData['situation']['salaryPeriod']; salaryKind: AppData['situation']['salaryKind']; updateSalaryMode: (patch: Partial<AppData['situation']>) => void }) {
  const auto = ['petrol', 'diesel', 'electric'].includes(job.transport)
  const setRating = (key: RatingKey, value: number | undefined) => update({ ratings: { ...job.ratings, [key]: value } })
  const salaryValue = salaryPeriod === 'monthly' ? job.monthlyNetSalary : job.monthlyNetSalary * job.salaryPayments
  const salaryLabel = `${salaryKind === 'net' ? 'Netto' : 'Brutto'}lohn ${salaryPeriod === 'monthly' ? 'pro Monat' : 'pro Jahr'}`
  return <div className="job-form">
    <FormGroup icon={<Briefcase />} title="Dein Job"><div className="field-grid three">
      <Field label="Position (optional)"><input value={job.position} placeholder="z. B. Pflegefachperson" onChange={(e) => update({ position: e.target.value })} /></Field>
      <Field label={salaryLabel} error={errors.monthlyNetSalary} unit={currency}><NumberInput min="0" step={salaryPeriod === 'monthly' ? 100 : 1000} value={salaryValue} onChange={(e) => update({ monthlyNetSalary: salaryPeriod === 'monthly' ? e.target.valueAsNumber : e.target.valueAsNumber / job.salaryPayments })} /></Field>
      <Field label="Gehaltszahlungen" error={errors.salaryPayments} unit="pro Jahr"><NumberInput min="1" max="24" step="1" value={job.salaryPayments} onChange={(e) => { const payments = e.target.valueAsNumber; update({ salaryPayments: payments, ...(salaryPeriod === 'annual' && payments > 0 ? { monthlyNetSalary: salaryValue / payments } : {}) }) }} /></Field>
    </div><div className="salary-mode" aria-label="Darstellung des Lohns"><div><span>Zeitraum</span><button type="button" className={salaryPeriod === 'monthly' ? 'active' : ''} onClick={() => updateSalaryMode({ salaryPeriod: 'monthly' })}>Pro Monat</button><button type="button" className={salaryPeriod === 'annual' ? 'active' : ''} onClick={() => updateSalaryMode({ salaryPeriod: 'annual' })}>Pro Jahr</button></div><div><span>Lohnart</span><button type="button" className={salaryKind === 'net' ? 'active' : ''} onClick={() => updateSalaryMode({ salaryKind: 'net' })}>Netto</button><button type="button" className={salaryKind === 'gross' ? 'active' : ''} onClick={() => updateSalaryMode({ salaryKind: 'gross' })}>Brutto</button></div></div>{salaryKind === 'gross' && <div className="gross-note"><Info /> jobsi schätzt keine Steuern oder Abzüge. Alle Geldvergleiche bleiben deshalb brutto.</div>}</FormGroup>
    <FormGroup icon={<Clock3 />} title="Deine Zeit"><div className="field-grid three">
      <Field label="Arbeitstage" error={errors.daysPerWeek} unit="pro Woche"><NumberInput min="0" max="7" step=".1" value={job.daysPerWeek} onChange={(e) => update({ daysPerWeek: e.target.valueAsNumber, ...(job.transport === 'remote' ? { homeOfficeDays: e.target.valueAsNumber } : {}) })} /></Field>
      <Field label="Arbeitsbeginn" error={errors.startTime}><input type="time" value={job.startTime} onChange={(e) => update({ startTime: e.target.value })} /></Field>
      <Field label="Arbeitsende" error={errors.endTime}><input type="time" value={job.endTime} onChange={(e) => update({ endTime: e.target.value })} /></Field>
      <Field label="Pause" error={errors.breakMinutes} unit="Min."><NumberInput min="0" value={job.breakMinutes} onChange={(e) => update({ breakMinutes: e.target.valueAsNumber })} /></Field>
      <Field label="Ferien" error={errors.vacationDays} unit="Tage/Jahr"><NumberInput min="0" step="1" value={job.vacationDays} onChange={(e) => update({ vacationDays: e.target.valueAsNumber })} /></Field>
      <Field label="Homeoffice" error={errors.homeOfficeDays} unit="Tage/Woche"><NumberInput min="0" step=".5" value={job.homeOfficeDays} onChange={(e) => update({ homeOfficeDays: e.target.valueAsNumber })} /></Field>
    </div><Toggle checked={job.endsNextDay} onChange={(endsNextDay) => update({ endsNextDay })}>Arbeitsende ist am Folgetag</Toggle></FormGroup>
    <FormGroup icon={<Home />} title="Dein Arbeitsweg"><div className="transport-picker">{transportOptions.map(({ value, label, icon: Icon }) => <button type="button" key={value} className={job.transport === value ? 'selected' : ''} onClick={() => update({ transport: value, ...(value === 'remote' ? { homeOfficeDays: job.daysPerWeek } : {}) })}><Icon /><span>{label}</span>{job.transport === value && <Check className="transport-check" />}</button>)}</div>{job.transport === 'remote' ? <div className="remote-note"><Laptop /><div><b>Dieser Job ist vollständig im Homeoffice.</b><span>Es werden keine Pendelzeit, Strecke oder Pendelkosten berechnet.</span></div></div> : <div className="field-grid two">
      <Field label="Kilometer pro Richtung" error={errors.distanceOneWayKm} unit="km"><NumberInput min="0" step=".1" value={job.distanceOneWayKm} onChange={(e) => update({ distanceOneWayKm: e.target.valueAsNumber })} /></Field>
      <Field label="Minuten pro Richtung" error={errors.commuteOneWayMinutes} unit="Min."><NumberInput min="0" value={job.commuteOneWayMinutes} onChange={(e) => update({ commuteOneWayMinutes: e.target.valueAsNumber })} /></Field>
      <Field label="Jobbedingte Zeit vor der Abfahrt" hint="z. B. früher aufstehen, fertig machen oder warten" error={errors.preDepartureMinutes} unit="Min./Präsenztag"><NumberInput min="0" value={job.preDepartureMinutes} onChange={(e) => update({ preDepartureMinutes: e.target.valueAsNumber })} /></Field>
      {job.transport === 'transit' && <><Field label="ÖV-Kosten"><Select value={job.transitPricing} onChange={(e) => update({ transitPricing: e.target.value as 'trip' | 'pass' })}><option value="pass">Monatliches Abo</option><option value="trip">Pro Hin- und Rückfahrt</option></Select></Field><Field label={job.transitPricing === 'pass' ? 'Abo pro Monat' : 'Hin- und Rückfahrt'} unit={currency}>{job.transitPricing === 'pass' ? <NumberInput min="0" value={job.transitPassMonthly} onChange={(e) => update({ transitPassMonthly: e.target.valueAsNumber })} /> : <NumberInput min="0" value={job.transitRoundTrip} onChange={(e) => update({ transitRoundTrip: e.target.valueAsNumber })} />}</Field></>}
    </div>}</FormGroup>
    <details className="precision"><summary><span><Plus /> Genauer rechnen <b>Optional</b></span><small>Nur wenn du mehr Details einbeziehen möchtest</small><ChevronDown /></summary><div className="precision-body"><p className="optional-intro">Du kannst diesen Bereich überspringen. Mit zusätzlichen Angaben wird dein Vergleich lediglich genauer.</p>
      <h4>Lohn & Zeit</h4><div className="field-grid three"><Field label="Nettobonus pro Jahr" error={errors.annualNetBonus} unit={currency}><NumberInput min="0" value={job.annualNetBonus} onChange={(e) => update({ annualNetBonus: e.target.valueAsNumber })} /></Field><Field label="Frei verfügbare Pause" error={errors.freeBreakMinutes} unit="Min."><NumberInput min="0" value={job.freeBreakMinutes} onChange={(e) => update({ freeBreakMinutes: e.target.valueAsNumber })} /></Field><Field label="Weitere freie Tage" error={errors.extraDaysOff} unit="Tage/Jahr"><NumberInput min="0" value={job.extraDaysOff} onChange={(e) => update({ extraDaysOff: e.target.valueAsNumber })} /></Field><Field label="Zusätzliche Arbeit" error={errors.extraHoursWeekly} unit="Std./Woche"><NumberInput min="0" step=".5" value={job.extraHoursWeekly} onChange={(e) => update({ extraHoursWeekly: e.target.valueAsNumber })} /></Field><Toggle checked={job.bonusUncertain} onChange={(bonusUncertain) => update({ bonusUncertain })}>Bonus ist unsicher</Toggle></div>
      {(auto || job.transport === 'bike') && <><h4>Fahrtkosten</h4><div className="field-grid three">{auto && <><Field label="Verbrauch" unit={job.transport === 'electric' ? 'kWh/100 km' : 'l/100 km'}><NumberInput min="0" step=".1" value={job.consumptionPer100} onChange={(e) => update({ consumptionPer100: e.target.valueAsNumber })} /></Field><Field label={job.transport === 'electric' ? 'Strompreis' : 'Preis pro Liter'} hint="Deine Annahme, kein Live-Preis" unit={currency}><NumberInput min="0" step=".01" value={job.energyPrice} onChange={(e) => update({ energyPrice: e.target.valueAsNumber })} /></Field></>}<Field label="Verschleiss & Wartung" unit={`${currency}/km`}><NumberInput min="0" step=".01" value={job.variableCostPerKm} onChange={(e) => update({ variableCostPerKm: e.target.valueAsNumber })} /></Field>{auto && <><Field label="Parkplatz" unit="pro Präsenztag"><NumberInput min="0" value={job.parkingPerDay} onChange={(e) => update({ parkingPerDay: e.target.valueAsNumber })} /></Field><Field label="Weitere Auto-Fixkosten" unit="pro Monat"><NumberInput min="0" value={job.commuteFixedMonthly} onChange={(e) => update({ commuteFixedMonthly: e.target.valueAsNumber })} /></Field></>}</div></>}
      <h4>Benefits & Jobkosten</h4><div className="field-grid three"><Field label="Mobilitätszuschuss" unit="pro Monat"><NumberInput min="0" value={job.mobilityAllowanceMonthly} onChange={(e) => update({ mobilityAllowanceMonthly: e.target.valueAsNumber })} /></Field><Field label="Geldwerte Benefits" unit="pro Monat"><NumberInput min="0" value={job.benefitsMonthly} onChange={(e) => update({ benefitsMonthly: e.target.valueAsNumber })} /></Field><Field label="Zusätzliche Jobkosten" unit="pro Monat"><NumberInput min="0" value={job.jobCostsMonthly} onChange={(e) => update({ jobCostsMonthly: e.target.valueAsNumber })} /></Field><Field label="Weitere Benefits" hint="Nicht nochmals zählen, wenn im Lohn enthalten"><input value={job.benefitNotes} placeholder="Weiterbildung, Firmenhandy …" onChange={(e) => update({ benefitNotes: e.target.value })} /></Field></div>
      <h4>Dein Gefühl</h4><p className="fine-print">Optional. Unbekannte Werte werden nicht als mittelmässig gewertet.</p><div className="rating-list">{(Object.keys(ratingLabels) as RatingKey[]).map((key) => <div key={key}><span>{ratingLabels[key]}</span><button type="button" className={!job.ratings[key] ? 'active' : ''} onClick={() => setRating(key, undefined)}>?</button>{[1,2,3,4,5].map((value) => <button type="button" key={value} className={job.ratings[key] === value ? 'active' : ''} onClick={() => setRating(key, value)}>{value}</button>)}</div>)}</div>
    </div></details>
  </div>
}

function FormGroup({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) { return <section className="form-group"><h3><span>{icon}</span>{title}</h3>{children}</section> }
type ChangeItem = { text: string; detail?: string }

function Results({ data, setData, current, offer, onEdit, onReset }: { data: AppData; setData: Dispatch<SetStateAction<AppData>>; current: JobResult; offer: JobResult; onEdit: () => void; onReset: () => void }) {
  const [period, setPeriod] = useState<'month' | 'year'>('month')
  const currency = data.situation.currency
  const isGross = data.situation.salaryKind === 'gross'
  const salaryKindLabel = isGross ? 'Brutto' : 'Netto'
  const moneyKey: 'availableAfterJobCosts' | 'availableAfterFixedCosts' = data.situation.fixedCostsMonthly == null ? 'availableAfterJobCosts' : 'availableAfterFixedCosts'
  const moneyDiff = (offer[moneyKey] - current[moneyKey]) / 12
  const freeDiff = (offer.awakeOutsideJobHours - current.awakeOutsideJobHours) / 12
  const commuteDiff = (offer.commuteHours - current.commuteHours) / 12
  const gains: ChangeItem[] = [], losses: ChangeItem[] = [], same: ChangeItem[] = []
  const add = (diff: number, positive: ChangeItem, negative: ChangeItem, equal: ChangeItem, epsilon: number) => diff > epsilon ? gains.push(positive) : diff < -epsilon ? losses.push(negative) : same.push(equal)
  const moneyDetail = isGross ? 'Bruttobetrachtung nach Jobkosten, ohne Steuern und Abzüge' : data.situation.fixedCostsMonthly == null ? 'nach Jobkosten' : 'nach Job- und Fixkosten'
  add(moneyDiff, { text: `${fmt(moneyDiff, currency)} mehr pro Monat`, detail: moneyDetail }, { text: `${fmt(Math.abs(moneyDiff), currency)} weniger pro Monat`, detail: moneyDetail }, { text: isGross ? 'Fast gleicher Bruttolohn nach Jobkosten' : 'Fast gleich viel verfügbares Geld' }, 1)
  add(freeDiff, { text: `${n(freeDiff, 1)} Std. mehr Zeit für dich`, detail: commuteDiff < -.1 ? `u. a. ${n(Math.abs(commuteDiff), 1)} Std. weniger Pendeln` : 'pro Monat, geschätzt' }, { text: `${n(Math.abs(freeDiff), 1)} Std. weniger Zeit für dich`, detail: commuteDiff > .1 ? `u. a. ${n(commuteDiff, 1)} Std. mehr Pendeln` : 'pro Monat, geschätzt' }, { text: 'Fast gleich viel wache Zeit ausserhalb des Jobs' }, .1)
  add(data.offer.vacationDays - data.current.vacationDays, { text: `${n(data.offer.vacationDays - data.current.vacationDays, 1)} Ferientage mehr` }, { text: `${n(data.current.vacationDays - data.offer.vacationDays, 1)} Ferientage weniger` }, { text: 'Gleich viele Ferientage' }, .1)
  add(data.offer.homeOfficeDays - data.current.homeOfficeDays, { text: `${n(data.offer.homeOfficeDays - data.current.homeOfficeDays, 1)} Homeoffice-Tag(e) mehr`, detail: 'pro Woche' }, { text: `${n(data.current.homeOfficeDays - data.offer.homeOfficeDays, 1)} Homeoffice-Tag(e) weniger`, detail: 'pro Woche' }, { text: 'Gleich viel Homeoffice' }, .1)
  const benefitDiff = (offer.benefits - current.benefits) / 12
  if (Math.abs(benefitDiff) > 1) add(benefitDiff, { text: `${fmt(benefitDiff, currency)} mehr Benefits`, detail: 'pro Monat' }, { text: `${fmt(Math.abs(benefitDiff), currency)} weniger Benefits`, detail: 'pro Monat' }, { text: 'Gleichwertige Benefits' }, 1)
  const moneyWord = isGross ? 'Bruttolohn nach Jobkosten' : 'Geld'
  const conclusion = Math.abs(moneyDiff) < 1 && Math.abs(freeDiff) < .1 ? 'Rechnerisch liegen beide Jobs fast gleichauf. Jetzt zählen vor allem deine persönlichen Prioritäten.' : moneyDiff > 0 && freeDiff > 0 ? `Mehr ${moneyWord} und mehr freie Zeit? Dieses Angebot sieht rechnerisch gut aus.` : moneyDiff > 0 && freeDiff < 0 ? `${fmt(moneyDiff, currency)} mehr ${isGross ? 'brutto ' : ''}im Monat. Dafür rund ${n(Math.abs(freeDiff), 1)} Stunden weniger Zeit für dich.` : moneyDiff < 0 && freeDiff > 0 ? `Rund ${n(freeDiff, 1)} Stunden mehr Zeit für dich. Dafür ${fmt(Math.abs(moneyDiff), currency)} weniger ${isGross ? 'brutto ' : ''}im Monat.` : `Bei diesen Angaben bringt das Angebot rechnerisch weniger ${moneyWord} und weniger freie Zeit.`
  const threshold = requiredSalaryPerPayment(current, offer, data.offer)
  const divisor = period === 'month' ? 12 : 1
  const suffix = period === 'month' ? '/ Monat' : '/ Jahr'
  const commuteCost = (result: JobResult) => result.totalJobCosts - result.jobExtraCosts
  const offerSalaryValue = data.situation.salaryPeriod === 'monthly' ? data.offer.monthlyNetSalary : data.offer.monthlyNetSalary * data.offer.salaryPayments
  const thresholdValue = threshold == null ? null : data.situation.salaryPeriod === 'monthly' ? threshold : threshold * data.offer.salaryPayments
  const setOfferSalary = (value: number) => setData((old) => ({ ...old, offer: { ...old.offer, monthlyNetSalary: old.situation.salaryPeriod === 'monthly' ? value : value / old.offer.salaryPayments } }))
  return <div className="result-page">
    <div className="result-title"><span>Geschafft <Sparkles /></span><h2>Das würde sich für dich ändern.</h2><p>Keine Wertung, kein Bauchgefühl von uns – nur deine Zahlen, verständlich gemacht.</p></div>
    <div className="change-cards"><ChangeCard tone="gain" icon={<TrendingUp />} title="Das gewinnst du" items={gains} empty="Hier zeigt sich rechnerisch noch kein Vorteil." /><ChangeCard tone="loss" icon={<TrendingDown />} title="Das gibst du ab" items={losses} empty="Hier entsteht rechnerisch kein Nachteil." /><ChangeCard tone="same" icon={<Equal />} title="Das bleibt gleich" items={same} empty="Bei diesen Angaben bleibt nichts gleich." /></div>
    <section className="comparison"><div className="comparison-head"><div><h3>Beide Jobs auf einen Blick</h3><p>{jobName(data.current, 'Aktueller Job')} <span>↔</span> {jobName(data.offer, 'Neuer Job')}</p></div><div className="period-toggle"><button data-analytics="results_period_month" className={period === 'month' ? 'active' : ''} onClick={() => setPeriod('month')}>Monat</button><button data-analytics="results_period_year" className={period === 'year' ? 'active' : ''} onClick={() => setPeriod('year')}>Jahr</button></div></div><div className="compare-labels"><span>Kennzahl</span><b>Aktueller Job</b><b>Neuer Job</b></div>
      <CompareRow icon={<WalletCards />} label={isGross ? 'Bruttolohn nach Jobkosten' : 'Verfügbares Geld'} note={isGross ? 'Keine Steuern oder Abzüge geschätzt' : data.situation.fixedCostsMonthly == null ? 'Nach Jobkosten' : 'Nach Job- und Fixkosten'} a={fmt(current[moneyKey] / divisor, currency)} b={fmt(offer[moneyKey] / divisor, currency)} suffix={suffix} highlight />
      <CompareRow icon={<SunMedium />} label="Zeit für dich" note="Wache Zeit ausserhalb des Jobs, geschätzt" a={`${n(current.awakeOutsideJobHours / divisor, 1)} Std.`} b={`${n(offer.awakeOutsideJobHours / divisor, 1)} Std.`} suffix={suffix} />
      <CompareRow icon={<Clock3 />} label="Gebundene Jobzeit" note="Arbeit, gebundene Pausen und Arbeitsweg" a={`${n(current.boundHours / divisor, 1)} Std.`} b={`${n(offer.boundHours / divisor, 1)} Std.`} suffix={suffix} />
      <CompareRow icon={<CircleDollarSign />} label={`Effektiver ${salaryKindLabel}-Stundenlohn`} note="Nach Jobkosten pro gebundener Stunde" a={current.effectiveHourlyRate == null ? 'Nicht berechenbar' : fmt(current.effectiveHourlyRate, currency, 2)} b={offer.effectiveHourlyRate == null ? 'Nicht berechenbar' : fmt(offer.effectiveHourlyRate, currency, 2)} />
      <CompareRow icon={<ParkingCircle />} label="Pendelkosten" note="Energie/Tickets plus eingegebene Zusatzkosten" a={fmt(commuteCost(current) / divisor, currency)} b={fmt(commuteCost(offer) / divisor, currency)} suffix={suffix} />
      <CompareRow icon={<BusFront />} label="Pendelzeit" a={`${n(current.commuteHours / divisor, 1)} Std.`} b={`${n(offer.commuteHours / divisor, 1)} Std.`} suffix={suffix} />
      {(current.preDepartureHours > 0 || offer.preDepartureHours > 0) && <CompareRow icon={<Clock3 />} label="Zeit vor der Abfahrt" note="Jobbedingte Vorbereitung pro Präsenztag" a={`${n(current.preDepartureHours / divisor, 1)} Std.`} b={`${n(offer.preDepartureHours / divisor, 1)} Std.`} suffix={suffix} />}
      <CompareRow icon={<SunMedium />} label="Ferien" note="Jährlicher Anspruch" a={`${n(data.current.vacationDays, 1)} Tage`} b={`${n(data.offer.vacationDays, 1)} Tage`} />
      <CompareRow icon={<Laptop />} label="Homeoffice" a={`${n(data.current.homeOfficeDays, 1)} Tage/Woche`} b={`${n(data.offer.homeOfficeDays, 1)} Tage/Woche`} />
      {(offer.benefits > 0 || current.benefits > 0 || data.offer.benefitNotes || data.current.benefitNotes) && <CompareRow icon={<Gift />} label="Benefits" note={`${data.current.benefitNotes || 'Keine weiteren'} ↔ ${data.offer.benefitNotes || 'Keine weiteren'}`} a={fmt(current.benefits / divisor, currency)} b={fmt(offer.benefits / divisor, currency)} suffix={suffix} />}
      {(current.personalScore != null || offer.personalScore != null) && <CompareRow icon={<Sparkles />} label="Persönliche Passung" note="Gewichteter Mittelwert, fehlende Werte ausgeschlossen" a={current.personalScore == null ? 'Nicht bewertet' : `${n(current.personalScore, 1)} / 5`} b={offer.personalScore == null ? 'Nicht bewertet' : `${n(offer.personalScore, 1)} / 5`} />}
    </section>
    <section className="verdict"><span><Sparkles /></span><div><small>Dein rechnerisches Fazit</small><h3>{conclusion}</h3><p>Ob sich der Wechsel persönlich richtig anfühlt, entscheidest natürlich du.</p></div></section>
    <section className="salary-playground"><div className="salary-copy"><span><CircleDollarSign /> Spielerisch ausprobieren</span><h3>Ab welchem Lohn lohnt’s sich?</h3><p>Verschiebe den Regler. Dein Vergleich oben aktualisiert sich sofort.</p>{thresholdValue == null ? <strong>Schwelle nicht berechenbar</strong> : thresholdValue <= 0 ? <strong>Schwelle bereits erreicht</strong> : <strong>{fmt(thresholdValue, currency)} <small>{salaryKindLabel.toLowerCase()} {data.situation.salaryPeriod === 'monthly' ? 'pro Gehaltszahlung' : 'pro Jahr'}</small></strong>}<p className="threshold-note">Gleicher effektiver {salaryKindLabel}-Stundenlohn wie heute – keine marktübliche Lohnempfehlung.{isGross ? ' Keine Netto-Schätzung.' : ''}</p></div><div className="salary-control"><label><span>{salaryKindLabel}lohn neues Angebot</span><b>{fmt(offerSalaryValue, currency)}</b></label><input type="range" min="0" max={data.situation.salaryPeriod === 'monthly' ? 20000 : 240000} step={data.situation.salaryPeriod === 'monthly' ? 100 : 1000} value={offerSalaryValue || 0} onChange={(e) => setOfferSalary(e.target.valueAsNumber)} /><NumberInput aria-label={`${salaryKindLabel}lohn neues Angebot`} min="0" step={data.situation.salaryPeriod === 'monthly' ? 100 : 1000} value={offerSalaryValue} onChange={(e) => setOfferSalary(e.target.valueAsNumber)} /></div></section>
    <details className="method weights-panel"><summary>Persönliche Faktoren gewichten <ChevronDown /></summary><div><p>Die Gewichtung wirkt auf beide Jobs. Fehlende Bewertungen bleiben ausgeschlossen.</p>{(Object.keys(ratingLabels) as RatingKey[]).map((key) => <label key={key}><span>{ratingLabels[key]}</span><input aria-label={`Gewichtung ${ratingLabels[key]}`} type="range" min="0" max="3" step="1" value={data.weights[key]} onChange={(e) => setData((old) => ({ ...old, weights: { ...old.weights, [key]: e.target.valueAsNumber } }))} /><b>{data.weights[key]}×</b></label>)}</div></details>
    <details className="method"><summary>Wie rechnet jobsi? <ChevronDown /></summary><div><p>Wir rechnen mit 52 Wochen und 365 Tagen. Ferientage werden durch deine tatsächlichen Arbeitstage pro Woche geteilt. Zusätzliche freie Tage wie Feiertage werden separat abgezogen.</p><p>Gebundene Jobzeit umfasst das Arbeitszeitfenster abzüglich frei verfügbarer Pause, Pendelzeit, jobbedingte Zeit vor der Abfahrt und zusätzliche Stunden. Private Fixkosten gehören nicht in den effektiven Stundenlohn.</p><p>Alle Werte sind Schätzungen aus deinen Angaben. Es gibt keine Routen-, Steuer-, Brutto-Netto- oder Währungsberechnung.</p></div></details>
    <div className="result-actions"><button className="round-button back" data-analytics="edit_inputs" onClick={onEdit}><ArrowLeft /> Angaben ändern</button><button className="round-button reset" data-analytics="restart_from_results" onClick={onReset}><RotateCcw /> Neu vergleichen</button><span><LockKeyhole /> Deine Angaben bleiben in diesem Browser.</span></div>
  </div>
}

function ChangeCard({ tone, icon, title, items, empty }: { tone: 'gain' | 'loss' | 'same'; icon: ReactNode; title: string; items: ChangeItem[]; empty: string }) { return <article className={`change-card ${tone}`}><div className="change-title"><span>{icon}</span><h3>{title}</h3></div>{items.length ? <ul>{items.map((item, index) => <li key={`${item.text}-${index}`}><Check /><div><b>{item.text}</b>{item.detail && <small>{item.detail}</small>}</div></li>)}</ul> : <p>{empty}</p>}</article> }
function CompareRow({ icon, label, note, a, b, suffix, highlight }: { icon: ReactNode; label: string; note?: string; a: string; b: string; suffix?: string; highlight?: boolean }) { return <div className={`compare-row ${highlight ? 'highlight' : ''}`}><div>{icon}<span><b>{label}</b>{note && <small>{note}</small>}</span></div><div><b>{a}</b>{suffix && <small>{suffix}</small>}</div><div><b>{b}</b>{suffix && <small>{suffix}</small>}</div></div> }

export default App
