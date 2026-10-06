import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { NextStepsCard } from '@/components/dashboard/NextStepsCard'

// Spy on navigation while keeping MemoryRouter real
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// Control agreement acceptance per test
const mockUseAgreementStatus = vi.fn()

vi.mock('@/queries/useAgreementAcceptance', () => ({
  useAgreementStatus: () => mockUseAgreementStatus(),
}))

// The publish modal subtree pulls in unrelated deps; stub it out
vi.mock('@/components/edit-profile/PublishConfirmationModal', () => ({
  PublishConfirmationModal: () => null,
}))

const agreementStatus = (isAccepted: boolean) => ({
  isAccepted,
  isCurrentVersion: isAccepted,
  acceptedAt: null,
  agreementVersion: null,
  acceptanceData: null,
  isLoading: false,
})

const renderCard = (
  props: { hasJobPreferences?: boolean; isPreferencesLoading?: boolean } = {}
) =>
  render(
    <MemoryRouter>
      <NextStepsCard {...props} />
    </MemoryRouter>
  )

describe('NextStepsCard', () => {
  beforeEach(() => {
    mockNavigate.mockReset()
    mockUseAgreementStatus.mockReturnValue(agreementStatus(false))
  })

  it('offers all three actions when job preferences are unset and the agreement is unsigned', () => {
    renderCard({ hasJobPreferences: false })

    expect(
      screen.getByRole('heading', { name: 'Publish Your Profile' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Job Preferences' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Get Engagement-Ready' })
    ).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Set Preferences' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Accept Agreement' })).toBeEnabled()
  })

  it('navigates to the agreement without requiring job preferences first', async () => {
    const user = userEvent.setup()
    renderCard({ hasJobPreferences: false })

    await user.click(screen.getByRole('button', { name: 'Accept Agreement' }))

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/agreement')
  })

  it('links to existing preferences while keeping the agreement action available', async () => {
    const user = userEvent.setup()
    renderCard({ hasJobPreferences: true })

    await user.click(
      screen.getByRole('button', { name: 'View or Edit Preferences' })
    )

    expect(mockNavigate).toHaveBeenCalledWith('/work-preferences')
    expect(screen.getByRole('button', { name: 'Accept Agreement' })).toBeEnabled()
  })

  it('disables both actions while their own queries are in flight', () => {
    mockUseAgreementStatus.mockReturnValue({
      ...agreementStatus(false),
      isLoading: true,
    })

    renderCard({ hasJobPreferences: false, isPreferencesLoading: true })

    expect(screen.getAllByRole('button', { name: 'Loading…' })).toHaveLength(2)
    expect(
      screen.queryByRole('button', { name: 'Accept Agreement' })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Set Preferences' })
    ).not.toBeInTheDocument()
  })

  it('never offers to accept an agreement whose status is still unknown', () => {
    // The dangerous case: the candidate HAS accepted, but the query has not resolved, so the
    // card cannot know. Saying "Accept Agreement" here leads to a form whose own read-only
    // guard has not settled either — and acceptances are append-only INSERTs, so following it
    // writes a second row into the legal record.
    mockUseAgreementStatus.mockReturnValue({
      ...agreementStatus(true),
      isLoading: true,
    })

    renderCard({ hasJobPreferences: true })

    expect(
      screen.queryByRole('button', { name: 'Accept Agreement' })
    ).not.toBeInTheDocument()
  })

  it('keeps job preferences usable while a slow agreement query is still retrying', () => {
    // The two queries are independent: a retrying agreement request says nothing about
    // preferences and must not lock a candidate out of the page they came for.
    mockUseAgreementStatus.mockReturnValue({
      ...agreementStatus(false),
      isLoading: true,
    })

    renderCard({ hasJobPreferences: true, isPreferencesLoading: false })

    const prefs = screen.getByRole('button', { name: 'View or Edit Preferences' })
    expect(prefs).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Loading…' })).toBeDisabled()
  })

  it('asks for a re-accept when the accepted agreement version is superseded', () => {
    mockUseAgreementStatus.mockReturnValue({
      ...agreementStatus(true),
      isCurrentVersion: false,
    })

    renderCard({ hasJobPreferences: false })

    expect(screen.getByRole('button', { name: 'Review Agreement' })).toBeEnabled()
    expect(
      screen.getByText(
        'Our agreement has been updated. Review and re-accept to stay engagement-ready.'
      )
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Set Preferences' })).toBeEnabled()
  })

  it('keeps job preferences available after the agreement is accepted', () => {
    mockUseAgreementStatus.mockReturnValue(agreementStatus(true))

    renderCard({ hasJobPreferences: false })

    expect(screen.getByRole('button', { name: 'View Agreement' })).toBeEnabled()
    expect(
      screen.getByRole('heading', { name: 'Job Preferences' })
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Set Preferences' })).toBeEnabled()
  })
})
