import { describe, expect, it } from 'vitest'
import { translatedValue } from './i18n'

describe('translations', () => {
  it('keeps German as the default language', () => {
    expect(translatedValue('Dein Job', 'de')).toBe('Dein Job')
  })

  it('translates the interface to English', () => {
    expect(translatedValue('Weiter zum neuen Job', 'en')).toBe('Continue to new job')
  })

  it('translates the interface to Albanian', () => {
    expect(translatedValue('Weiter zum neuen Job', 'sq')).toBe('Vazhdo te puna e re')
  })

  it('preserves whitespace around translated React text nodes', () => {
    expect(translatedValue(' Bleibt bei dir ', 'sq')).toBe(' Mbetet te ti ')
  })

  it('translates dynamic comparison values', () => {
    expect(translatedValue('12 Std. mehr Zeit für dich', 'en')).toBe('12 hrs more time for yourself')
    expect(translatedValue('12 Std. mehr Zeit für dich', 'sq')).toBe('12 orë më shumë për veten')
  })
})
