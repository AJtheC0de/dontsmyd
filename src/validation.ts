import type { AppData, JobInput } from './types'
import { workWindowMinutes } from './calculations'

export type Errors = Record<string, string>
const nonNegative = (value: number) => Number.isFinite(value) && value >= 0

export function validateSituation(data: AppData): Errors {
  const e: Errors = {}
  if (!Number.isFinite(data.situation.sleepHours) || data.situation.sleepHours < 0 || data.situation.sleepHours >= 24) e.sleepHours = 'Bitte zwischen 0 und weniger als 24 Stunden eingeben.'
  if (data.situation.fixedCostsMonthly != null && !nonNegative(data.situation.fixedCostsMonthly)) e.fixedCostsMonthly = 'Fixkosten dürfen nicht negativ sein.'
  if (data.situation.reservedPrivateHoursWeekly != null && !nonNegative(data.situation.reservedPrivateHoursWeekly)) e.reservedPrivateHoursWeekly = 'Reservierte Zeit darf nicht negativ sein.'
  if ((data.situation.reservedPrivateHoursWeekly ?? 0) * 52 > 365 * (24 - data.situation.sleepHours)) e.reservedPrivateHoursWeekly = 'Die reservierte Zeit übersteigt deine gesamte wache Jahreszeit.'
  return e
}

export function validateJob(job: JobInput): Errors {
  const e: Errors = {}
  if (!job.startTime) e.startTime = 'Bitte eine Startzeit eingeben.'
  if (!job.endTime) e.endTime = 'Bitte eine Endzeit eingeben.'
  if (job.startTime && job.endTime && !job.endsNextDay && job.endTime <= job.startTime) e.endTime = 'Für ein Ende nach Mitternacht bitte «Ende am Folgetag» aktivieren.'
  if (workWindowMinutes(job) > 1440) e.endTime = 'Ein Arbeitszeitfenster kann höchstens 24 Stunden lang sein.'
  const requiredNonNegative: (keyof JobInput)[] = ['monthlyNetSalary','annualNetBonus','daysPerWeek','breakMinutes','freeBreakMinutes','vacationDays','extraDaysOff','homeOfficeDays','extraHoursWeekly','distanceOneWayKm','commuteOneWayMinutes','preDepartureMinutes','consumptionPer100','energyPrice','variableCostPerKm','parkingPerDay','commuteFixedMonthly','transitRoundTrip','transitPassMonthly','mobilityAllowanceMonthly','benefitsMonthly','jobCostsMonthly']
  requiredNonNegative.forEach((key) => { if (!nonNegative(job[key] as number)) e[key] = 'Bitte 0 oder einen positiven Wert eingeben.' })
  if (!Number.isFinite(job.salaryPayments) || job.salaryPayments <= 0) e.salaryPayments = 'Mindestens eine Gehaltszahlung erforderlich.'
  if (job.daysPerWeek > 7) e.daysPerWeek = 'Maximal 7 Arbeitstage pro Woche.'
  if (job.homeOfficeDays > job.daysPerWeek) e.homeOfficeDays = 'Homeoffice darf die Arbeitstage nicht übersteigen.'
  if (job.freeBreakMinutes > job.breakMinutes) e.freeBreakMinutes = 'Die frei verfügbare Pause darf nicht länger als die Gesamtpause sein.'
  if (job.breakMinutes > workWindowMinutes(job)) e.breakMinutes = 'Die Pause ist länger als das Arbeitszeitfenster.'
  if (job.vacationDays + job.extraDaysOff > 52 * job.daysPerWeek) e.extraDaysOff = 'Ferien und freie Tage übersteigen die möglichen Arbeitstage.'
  return e
}
