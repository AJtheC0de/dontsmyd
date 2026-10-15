import type { AppData, JobInput } from './types'
import { defaultData } from './data'

const KEY = 'jobsi-data-v1'
interface StoredData { version: 1 | 2 | 3 | 4; data: AppData }

function migrate(parsed: StoredData & { data: AppData & { current: JobInputLegacy; offer: JobInputLegacy } }): AppData {
  const defaults = defaultData()
  const situation = { ...defaults.situation, ...parsed.data.situation }
  const convert = (job: JobInputLegacy, fallback: JobInput): JobInput => {
    const { vacationWeeks, ...rest } = job
    return {
      ...fallback, ...rest,
      vacationDays: job.vacationDays ?? (vacationWeeks ?? 0) * (job.daysPerWeek || 0),
      preDepartureMinutes: job.preDepartureMinutes ?? 0,
    }
  }
  return { ...parsed.data, situation, current: convert(parsed.data.current, defaults.current), offer: convert(parsed.data.offer, defaults.offer) }
}

type JobInputLegacy = Omit<JobInput, 'vacationDays' | 'preDepartureMinutes'> & { vacationDays?: number; vacationWeeks?: number; preDepartureMinutes?: number }

export function loadData(): { data: AppData; warning?: string } {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { data: defaultData() }
    const parsed = JSON.parse(raw) as StoredData
    if (![1, 2, 3, 4].includes(parsed.version) || !parsed.data?.situation || !parsed.data.current || !parsed.data.offer) throw new Error('invalid')
    return { data: migrate(parsed as StoredData & { data: AppData & { current: JobInputLegacy; offer: JobInputLegacy } }) }
  } catch {
    return { data: defaultData(), warning: 'Gespeicherte Daten konnten nicht gelesen werden. Wir starten mit einer frischen Eingabe.' }
  }
}

export function saveData(data: AppData): boolean {
  try { localStorage.setItem(KEY, JSON.stringify({ version: 4, data } satisfies StoredData)); return true }
  catch { return false }
}

export function clearData() {
  try { localStorage.removeItem(KEY) } catch { /* storage may be blocked */ }
}
