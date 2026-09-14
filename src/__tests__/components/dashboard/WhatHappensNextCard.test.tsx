import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { WhatHappensNextCard } from '@/components/dashboard/WhatHappensNextCard'

const mockUseAgreementStatus = vi.fn()

vi.mock('@/queries/useAgreementAcceptance', () => ({
  useAgreementStatus: () => mockUseAgreementStatus(),
}))

const agreementStatus = (isAccepted: boolean) => ({
  isAccepted,
  isCurrentVersion: isAccepted,
  acceptedAt: null,
  agreementVersion: null,
  acceptanceData: null,
  isLoading: false,
})

const itemState = (label: string) => {
  const item = screen.getByText(label).closest('li')
  if (!item) throw new Error(`No list item found for "${label}"`)
  return within(item).queryByText('Done') ? 'done' : 'not done'
}

describe('WhatHappensNextCard', () => {
  beforeEach(() => {
    mockUseAgreementStatus.mockReturnValue(agreementStatus(false))
  })

  it('shows all three steps outstanding, in any order, for a freshly confirmed candidate', () => {
    render(<WhatHappensNextCard isPublished={false} hasJobPreferences={false} />)

    expect(itemState('Publish your profile')).toBe('not done')
    expect(itemState('Set your job preferences')).toBe('not done')
    expect(itemState('Accept your agreement with Fractional First')).toBe(
      'not done'
    )
    expect(
      screen.getByText('You can complete these in any order.')
    ).toBeInTheDocument()
  })

  it('marks the agreement done when it was signed before job preferences were set', () => {
    mockUseAgreementStatus.mockReturnValue(agreementStatus(true))

    render(<WhatHappensNextCard isPublished={false} hasJobPreferences={false} />)

    expect(itemState('Accept your agreement with Fractional First')).toBe('done')
    expect(itemState('Set your job preferences')).toBe('not done')
    expect(
      screen.getByText('You can complete these in any order.')
    ).toBeInTheDocument()
  })

  it('marks publishing and preferences done when the agreement has not been signed yet', () => {
    render(<WhatHappensNextCard isPublished hasJobPreferences />)

    expect(itemState('Publish your profile')).toBe('done')
    expect(itemState('Set your job preferences')).toBe('done')
    expect(itemState('Accept your agreement with Fractional First')).toBe(
      'not done'
    )
  })

  it('leaves the agreement outstanding when the accepted version is no longer current', () => {
    mockUseAgreementStatus.mockReturnValue({
      ...agreementStatus(true),
      isCurrentVersion: false,
    })

    render(<WhatHappensNextCard isPublished hasJobPreferences />)

    expect(itemState('Accept your agreement with Fractional First')).toBe(
      'not done'
    )
  })

  it('confirms everything is complete once all three are done', () => {
    mockUseAgreementStatus.mockReturnValue(agreementStatus(true))

    render(<WhatHappensNextCard isPublished hasJobPreferences />)

    expect(
      screen.getByText("You're all set — our team is reviewing your profile.")
    ).toBeInTheDocument()
    expect(
      screen.queryByText('You can complete these in any order.')
    ).not.toBeInTheDocument()
  })
})
