import { describe, expect, it } from 'vitest'
import { calculateJob, calculatePersonalScore, requiredSalaryPerPayment, workWindowMinutes } from './calculations'
import { defaultData, emptyJob } from './data'
import type { JobInput } from './types'

const setup = (patch: Partial<JobInput> = {}) => {
  const data = defaultData()
  const job = { ...emptyJob(), position: 'Test', ...patch }
  return { data, job, result: calculateJob(job, data.situation, data.weights) }
}

describe('jobsi calculations', () => {
  it('returns identical results for identical jobs', () => {
    const { data, job } = setup()
    expect(calculateJob(job, data.situation, data.weights)).toEqual(calculateJob({ ...job }, data.situation, data.weights))
  })

  it('combines a higher salary with a longer commute', () => {
    const a = setup({ monthlyNetSalary: 6000, commuteOneWayMinutes: 10 }).result
    const b = setup({ monthlyNetSalary: 7000, commuteOneWayMinutes: 60 }).result
    expect(b.availableAfterJobCosts).toBeGreaterThan(a.availableAfterJobCosts)
    expect(b.boundHours).toBeGreaterThan(a.boundHours)
  })

  it('has no presence days or commute in full homeoffice', () => {
    const { result } = setup({ daysPerWeek: 4, homeOfficeDays: 4, transport: 'remote', preDepartureMinutes: 35 })
    expect(result.presenceDays).toBe(0)
    expect(result.commuteKm).toBe(0)
    expect(result.commuteHours).toBe(0)
    expect(result.preDepartureHours).toBe(0)
  })

  it('handles part-time and zero days without division by zero', () => {
    expect(setup({ daysPerWeek: 2.5, homeOfficeDays: 1 }).result.workDays).toBeCloseTo(95)
    const zero = setup({ daysPerWeek: 0, homeOfficeDays: 0 }).result
    expect(zero.presenceDays).toBe(0)
    expect(zero.effectiveHourlyRate).toBeNull()
  })

  it('accounts for a thirteenth salary payment', () => {
    expect(setup({ monthlyNetSalary: 6000, salaryPayments: 13 }).result.annualSalary).toBe(78000)
  })

  it('converts vacation days using the actual working days', () => {
    expect(setup({ daysPerWeek: 5, vacationDays: 30, extraDaysOff: 10 }).result.workDays).toBe(220)
    expect(setup({ daysPerWeek: 4, vacationDays: 20, extraDaysOff: 0 }).result.workingWeeks).toBe(47)
  })

  it('calculates petrol and electric energy cost', () => {
    const petrol = setup({ transport: 'petrol', distanceOneWayKm: 10, consumptionPer100: 7, energyPrice: 2 }).result
    const electric = setup({ transport: 'electric', distanceOneWayKm: 10, consumptionPer100: 20, energyPrice: .3 }).result
    expect(petrol.commuteEnergyOrTickets).toBeCloseTo(petrol.commuteKm / 100 * 14)
    expect(electric.commuteEnergyOrTickets).toBeCloseTo(electric.commuteKm / 100 * 6)
  })

  it('chooses either transit pass or tickets', () => {
    const pass = setup({ transport: 'transit', transitPricing: 'pass', transitPassMonthly: 100, transitRoundTrip: 999 }).result
    const trip = setup({ transport: 'transit', transitPricing: 'trip', transitPassMonthly: 999, transitRoundTrip: 10 }).result
    expect(pass.commuteEnergyOrTickets).toBe(1200)
    expect(trip.commuteEnergyOrTickets).toBeCloseTo(trip.presenceDays * 10)
  })

  it('distinguishes actual work and freely usable breaks', () => {
    const { result } = setup({ startTime: '08:00', endTime: '17:00', breakMinutes: 60, freeBreakMinutes: 30 })
    expect(result.actualWorkHours).toBe(8)
    expect(result.boundDailyHours).toBe(8.5)
  })

  it('supports shifts over midnight', () => {
    const job = { ...emptyJob(), startTime: '22:00', endTime: '06:00', endsNextDay: true }
    expect(workWindowMinutes(job)).toBe(480)
    expect(workWindowMinutes({ ...job, endsNextDay: false })).toBe(0)
  })

  it('solves the salary threshold against the current effective rate', () => {
    const { data } = setup()
    const currentJob = { ...emptyJob(), monthlyNetSalary: 6000, position: 'A' }
    const offerJob = { ...emptyJob(), monthlyNetSalary: 1, position: 'B' }
    const current = calculateJob(currentJob, data.situation, data.weights)
    const offer = calculateJob(offerJob, data.situation, data.weights)
    const threshold = requiredSalaryPerPayment(current, offer, offerJob)
    expect(threshold).toBeCloseTo(6000)
  })

  it('excludes missing personal ratings', () => {
    const data = defaultData()
    const job = { ...emptyJob(), ratings: { interest: 5, stability: 1 } }
    expect(calculatePersonalScore(job, data.weights)).toEqual({ score: 3, count: 2 })
    expect(calculatePersonalScore({ ...job, ratings: {} }, data.weights).score).toBeNull()
  })
})
