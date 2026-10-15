import type { PostHog } from 'posthog-js'

export type AnalyticsConsent = 'accepted' | 'rejected' | null
export type AnalyticsEvent =
  | 'app_viewed'
  | 'button_clicked'
  | 'comparison_started'
  | 'step_completed'
  | 'step_validation_failed'
  | 'results_viewed'

type EventProperties = Record<string, boolean | number | string>

const CONSENT_KEY = 'jobsi-analytics-consent-v1'
const projectKey = import.meta.env.VITE_POSTHOG_KEY?.trim()
const apiHost = import.meta.env.VITE_POSTHOG_HOST?.trim() || 'https://eu.i.posthog.com'

export const analyticsConfigured = Boolean(projectKey)

let consent: AnalyticsConsent = readStoredConsent()
let client: PostHog | null = null
let initialization: Promise<PostHog | null> | null = null
let pageViewCaptured = false

function readStoredConsent(): AnalyticsConsent {
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    return stored === 'accepted' || stored === 'rejected' ? stored : null
  } catch {
    return null
  }
}

export function getAnalyticsConsent(): AnalyticsConsent {
  return consent
}

export function setAnalyticsConsent(next: Exclude<AnalyticsConsent, null>) {
  consent = next
  try { localStorage.setItem(CONSENT_KEY, next) } catch { /* consent still applies for this page */ }

  if (next === 'rejected') {
    client?.opt_out_capturing()
    return
  }

  if (client) client.opt_in_capturing()
  void initializeAnalytics()
}

export async function initializeAnalytics(): Promise<PostHog | null> {
  if (!analyticsConfigured || consent !== 'accepted') return null
  if (client) return client
  if (initialization) return initialization

  initialization = import('posthog-js').then(({ default: posthog }) => {
    posthog.init(projectKey!, {
      api_host: apiHost,
      ui_host: 'https://eu.posthog.com',
      autocapture: false,
      capture_pageview: false,
      capture_pageleave: false,
      cookieless_mode: 'always',
      disable_session_recording: true,
      person_profiles: 'never',
    })
    client = posthog
    if (!pageViewCaptured) {
      pageViewCaptured = true
      posthog.capture('app_viewed', privacyProperties())
    }
    return posthog
  }).catch(() => null)

  return initialization
}

export function capture(event: AnalyticsEvent, properties: EventProperties = {}) {
  if (!analyticsConfigured || consent !== 'accepted') return
  void initializeAnalytics().then((posthog) => posthog?.capture(event, { ...privacyProperties(), ...properties }))
}

function privacyProperties(): EventProperties {
  return {
    $process_person_profile: false,
    $geoip_disable: true,
  }
}
