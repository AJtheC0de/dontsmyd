import type { AppData, JobInput } from './types'

export const emptyJob = (offer = false): JobInput => ({
  company: '', position: '', monthlyNetSalary: offer ? 6500 : 6000, salaryPayments: 12,
  annualNetBonus: 0, bonusUncertain: false, daysPerWeek: 5, startTime: '08:00', endTime: '17:00',
  endsNextDay: false, breakMinutes: 60, freeBreakMinutes: 30, vacationDays: 25, extraDaysOff: 10,
  homeOfficeDays: offer ? 2 : 1, extraHoursWeekly: 0, transport: 'transit', distanceOneWayKm: offer ? 18 : 8,
  commuteOneWayMinutes: offer ? 35 : 20, consumptionPer100: 6.5, energyPrice: 1.85,
  preDepartureMinutes: 0,
  variableCostPerKm: 0, parkingPerDay: 0, commuteFixedMonthly: 0, transitPricing: 'pass',
  transitRoundTrip: 10, transitPassMonthly: 90, mobilityAllowanceMonthly: 0, benefitsMonthly: 0,
  jobCostsMonthly: 0, benefitNotes: '', ratings: {},
})

export const defaultData = (): AppData => ({
  situation: { location: '', currency: 'CHF', salaryPeriod: 'monthly', salaryKind: 'net', sleepHours: 8 },
  current: emptyJob(), offer: emptyJob(true),
  weights: { interest: 1, growth: 1, flexibility: 1, environment: 1, stability: 1 },
})

export const exampleData = (): AppData => ({
  situation: { location: 'Winterthur', currency: 'CHF', salaryPeriod: 'monthly', salaryKind: 'net', sleepHours: 7.5, fixedCostsMonthly: 2450, reservedPrivateHoursWeekly: 12 },
  current: {
    ...emptyJob(), company: 'Nordlicht AG', position: 'Projektleiterin', monthlyNetSalary: 6100,
    salaryPayments: 13, homeOfficeDays: 1, transport: 'transit', transitPassMonthly: 165,
    benefitsMonthly: 40, benefitNotes: 'Weiterbildungsbudget, Firmenhandy',
    ratings: { interest: 3, growth: 3, flexibility: 3, environment: 4, stability: 5 },
  },
  offer: {
    ...emptyJob(true), company: 'Morgenwerk GmbH', position: 'Senior Product Manager', monthlyNetSalary: 6900,
    annualNetBonus: 4000, bonusUncertain: true, daysPerWeek: 5, startTime: '08:30', endTime: '17:45',
    freeBreakMinutes: 20, vacationDays: 25, extraDaysOff: 8, homeOfficeDays: 2, extraHoursWeekly: 1,
    transport: 'electric', distanceOneWayKm: 28, commuteOneWayMinutes: 42, preDepartureMinutes: 35, consumptionPer100: 18,
    energyPrice: .31, variableCostPerKm: .08, parkingPerDay: 7, mobilityAllowanceMonthly: 120,
    benefitsMonthly: 80, jobCostsMonthly: 90, benefitNotes: 'Flexible Arbeitszeit, Mentoring, Firmenhandy',
    ratings: { interest: 5, growth: 5, flexibility: 4, environment: 4, stability: 3 },
  },
  weights: { interest: 2, growth: 2, flexibility: 1, environment: 1, stability: 1 },
})

export const restartData = (): AppData => {
  const data = defaultData()
  const zeroJob = (job: JobInput): JobInput => ({
    ...job, company: '', position: '', monthlyNetSalary: 0, salaryPayments: 0, annualNetBonus: 0,
    bonusUncertain: false, daysPerWeek: 0, startTime: '00:00', endTime: '00:00', endsNextDay: false,
    breakMinutes: 0, freeBreakMinutes: 0, vacationDays: 0, extraDaysOff: 0, homeOfficeDays: 0,
    extraHoursWeekly: 0, distanceOneWayKm: 0, commuteOneWayMinutes: 0, preDepartureMinutes: 0,
    consumptionPer100: 0, energyPrice: 0, variableCostPerKm: 0, parkingPerDay: 0,
    commuteFixedMonthly: 0, transitRoundTrip: 0, transitPassMonthly: 0, mobilityAllowanceMonthly: 0,
    benefitsMonthly: 0, jobCostsMonthly: 0, benefitNotes: '', ratings: {},
  })
  return {
    ...data,
    situation: { ...data.situation, sleepHours: 0, fixedCostsMonthly: undefined, reservedPrivateHoursWeekly: undefined },
    current: zeroJob(data.current), offer: zeroJob(data.offer),
  }
}
