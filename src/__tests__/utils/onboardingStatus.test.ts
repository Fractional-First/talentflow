import { describe, it, expect } from 'vitest'
import {
  raiseOnboardingStatus,
  routeForOnboardingStatus,
  type OnboardingStatus,
} from '@/utils/onboardingStatus'

describe('raiseOnboardingStatus', () => {
  it('moves a user forward', () => {
    expect(raiseOnboardingStatus('SIGNED_UP', 'EMAIL_CONFIRMED')).toBe('EMAIL_CONFIRMED')
    expect(raiseOnboardingStatus('EMAIL_CONFIRMED', 'PROFILE_GENERATED')).toBe('PROFILE_GENERATED')
  })

  it('never moves a user backwards', () => {
    expect(raiseOnboardingStatus('PREFERENCES_SET', 'EMAIL_CONFIRMED')).toBe('PREFERENCES_SET')
    expect(raiseOnboardingStatus('PREFERENCES_SET', 'PROFILE_GENERATED')).toBe('PREFERENCES_SET')
    expect(raiseOnboardingStatus('PROFILE_CONFIRMED', 'PROFILE_GENERATED')).toBe('PROFILE_CONFIRMED')
  })

  it('keeps the same status when the target equals it', () => {
    expect(raiseOnboardingStatus('EMAIL_CONFIRMED', 'EMAIL_CONFIRMED')).toBe('EMAIL_CONFIRMED')
  })

  it('leaves SET_PASSWORD alone', () => {
    expect(raiseOnboardingStatus('SET_PASSWORD', 'PROFILE_GENERATED')).toBe('SET_PASSWORD')
  })

  it('uses the target when there is no status yet', () => {
    expect(raiseOnboardingStatus(null, 'EMAIL_CONFIRMED')).toBe('EMAIL_CONFIRMED')
    expect(raiseOnboardingStatus(undefined, 'PROFILE_GENERATED')).toBe('PROFILE_GENERATED')
  })
})

describe('routeForOnboardingStatus', () => {
  it.each<[OnboardingStatus | null, string]>([
    ['SIGNED_UP', '/check-email'],
    ['EMAIL_CONFIRMED', '/create-profile'],
    ['SET_PASSWORD', '/change-password'],
    ['PROFILE_GENERATED', '/edit-profile'],
    ['PROFILE_CONFIRMED', '/dashboard'],
    ['PREFERENCES_SET', '/dashboard'],
    [null, '/create-profile'],
  ])('%s → %s', (status, route) => {
    expect(routeForOnboardingStatus(status)).toBe(route)
  })

  it('only accepts real onboarding statuses (checked by tsc)', () => {
    // @ts-expect-error not an onboarding status
    expect(routeForOnboardingStatus('NOT_A_STATUS')).toBe('/create-profile')
  })
})
