export type Currency = 'CHF' | 'EUR'
export type SalaryPeriod = 'monthly' | 'annual'
export type SalaryKind = 'net' | 'gross'
export type Transport = 'petrol' | 'diesel' | 'electric' | 'transit' | 'bike' | 'walk' | 'remote'
export type TransitPricing = 'trip' | 'pass'
export type RatingKey = 'interest' | 'growth' | 'flexibility' | 'environment' | 'stability'

export interface Situation {
  location: string
  currency: Currency
  salaryPeriod: SalaryPeriod
  salaryKind: SalaryKind
  sleepHours: number
  fixedCostsMonthly?: number
  reservedPrivateHoursWeekly?: number
}

export interface JobInput {
  company: string
  position: string
  monthlyNetSalary: number
  salaryPayments: number
  annualNetBonus: number
  bonusUncertain: boolean
  daysPerWeek: number
  startTime: string
  endTime: string
  endsNextDay: boolean
  breakMinutes: number
  freeBreakMinutes: number
  vacationDays: number
  extraDaysOff: number
  homeOfficeDays: number
  extraHoursWeekly: number
  transport: Transport
  distanceOneWayKm: number
  commuteOneWayMinutes: number
  preDepartureMinutes: number
  consumptionPer100: number
  energyPrice: number
  variableCostPerKm: number
  parkingPerDay: number
  commuteFixedMonthly: number
  transitPricing: TransitPricing
  transitRoundTrip: number
  transitPassMonthly: number
  mobilityAllowanceMonthly: number
  benefitsMonthly: number
  jobCostsMonthly: number
  benefitNotes: string
  ratings: Partial<Record<RatingKey, number>>
}

export interface AppData {
  situation: Situation
  current: JobInput
  offer: JobInput
  weights: Record<RatingKey, number>
}

export interface JobResult {
  workingWeeks: number
  workDays: number
  presenceDays: number
  workWindowHours: number
  actualWorkHours: number
  boundDailyHours: number
  commuteKm: number
  commuteHours: number
  preDepartureHours: number
  boundHours: number
  awakeOutsideJobHours: number
  freelyPlannableHours: number
  annualSalary: number
  commuteEnergyOrTickets: number
  vehicleCosts: number
  parkingCosts: number
  commuteFixedCosts: number
  jobExtraCosts: number
  totalJobCosts: number
  benefits: number
  availableAfterJobCosts: number
  availableAfterFixedCosts: number
  effectiveHourlyRate: number | null
  personalScore: number | null
  ratedDimensions: number
}
