import type { AppData, JobInput, JobResult, RatingKey, Situation } from './types'

const timeMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number)
  return hours * 60 + minutes
}

export function workWindowMinutes(job: JobInput): number {
  const start = timeMinutes(job.startTime)
  let end = timeMinutes(job.endTime)
  if (job.endsNextDay) end += 1440
  return Math.max(0, end - start)
}

export function calculatePersonalScore(job: JobInput, weights: AppData['weights']) {
  const keys = Object.keys(weights) as RatingKey[]
  const rated = keys.filter((key) => job.ratings[key] != null)
  if (!rated.length) return { score: null, count: 0 }
  const weight = rated.reduce((sum, key) => sum + weights[key], 0)
  if (weight <= 0) return { score: null, count: rated.length }
  const score = rated.reduce((sum, key) => sum + (job.ratings[key] ?? 0) * weights[key], 0) / weight
  return { score, count: rated.length }
}

export function calculateJob(job: JobInput, situation: Situation, weights: AppData['weights']): JobResult {
  const workingWeeks = job.daysPerWeek > 0 ? Math.max(0, 52 - job.vacationDays / job.daysPerWeek) : 0
  const workDays = Math.max(0, workingWeeks * job.daysPerWeek - job.extraDaysOff)
  const presenceRatio = job.transport === 'remote' ? 0 : job.daysPerWeek > 0 ? Math.max(0, job.daysPerWeek - job.homeOfficeDays) / job.daysPerWeek : 0
  const presenceDays = workDays * presenceRatio
  const window = workWindowMinutes(job) / 60
  const actualWorkHours = Math.max(0, window - job.breakMinutes / 60)
  const boundDailyHours = Math.max(0, window - job.freeBreakMinutes / 60)
  const commuteKm = job.distanceOneWayKm * 2 * presenceDays
  const commuteHours = job.commuteOneWayMinutes * 2 * presenceDays / 60
  const preDepartureHours = job.preDepartureMinutes * presenceDays / 60
  const boundHours = boundDailyHours * workDays + commuteHours + preDepartureHours + job.extraHoursWeekly * workingWeeks
  const awakeHours = 365 * Math.max(0, 24 - situation.sleepHours)
  const awakeOutsideJobHours = awakeHours - boundHours
  const reserved = (situation.reservedPrivateHoursWeekly ?? 0) * 52
  const freelyPlannableHours = awakeOutsideJobHours - reserved

  let commuteEnergyOrTickets = 0
  let vehicleCosts = 0
  let parkingCosts = 0
  let commuteFixedCosts = 0
  if (job.transport === 'petrol' || job.transport === 'diesel' || job.transport === 'electric') {
    commuteEnergyOrTickets = commuteKm / 100 * job.consumptionPer100 * job.energyPrice
    vehicleCosts = commuteKm * job.variableCostPerKm
    parkingCosts = presenceDays * job.parkingPerDay
    commuteFixedCosts = job.commuteFixedMonthly * 12
  } else if (job.transport === 'transit') {
    commuteEnergyOrTickets = job.transitPricing === 'trip' ? presenceDays * job.transitRoundTrip : job.transitPassMonthly * 12
  } else if (job.transport === 'bike') vehicleCosts = commuteKm * job.variableCostPerKm

  const jobExtraCosts = job.jobCostsMonthly * 12
  const totalJobCosts = commuteEnergyOrTickets + vehicleCosts + parkingCosts + commuteFixedCosts + jobExtraCosts
  const benefits = (job.mobilityAllowanceMonthly + job.benefitsMonthly) * 12
  const annualSalary = job.monthlyNetSalary * job.salaryPayments + job.annualNetBonus
  const availableAfterJobCosts = annualSalary + benefits - totalJobCosts
  const availableAfterFixedCosts = availableAfterJobCosts - (situation.fixedCostsMonthly ?? 0) * 12
  const personal = calculatePersonalScore(job, weights)
  return {
    workingWeeks, workDays, presenceDays, workWindowHours: window, actualWorkHours, boundDailyHours,
    commuteKm, commuteHours, preDepartureHours, boundHours, awakeOutsideJobHours, freelyPlannableHours, annualSalary,
    commuteEnergyOrTickets, vehicleCosts, parkingCosts, commuteFixedCosts, jobExtraCosts, totalJobCosts,
    benefits, availableAfterJobCosts, availableAfterFixedCosts,
    effectiveHourlyRate: boundHours > 0 ? availableAfterJobCosts / boundHours : null,
    personalScore: personal.score, ratedDimensions: personal.count,
  }
}

export function requiredSalaryPerPayment(current: JobResult, offer: JobResult, offerInput: JobInput): number | null {
  if (current.effectiveHourlyRate == null || offerInput.salaryPayments <= 0) return null
  const neededAnnualSalary = current.effectiveHourlyRate * offer.boundHours - offer.benefits + offer.totalJobCosts
  return (neededAnnualSalary - offerInput.annualNetBonus) / offerInput.salaryPayments
}
