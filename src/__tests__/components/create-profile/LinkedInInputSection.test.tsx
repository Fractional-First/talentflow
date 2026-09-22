import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LinkedInInputSection } from '@/components/create-profile/LinkedInInputSection'

// LinkedIn's OIDC sign-in does not return the account's profile URL, so a candidate who signed up
// that way still has to paste it — which reads as a broken or duplicated step without an
// explanation. The explanation must appear for exactly those candidates and nobody else.
const renderSection = (signedUpViaLinkedIn?: boolean) =>
  render(
    <LinkedInInputSection
      onLinkedInSubmit={vi.fn()}
      onResumeFallback={vi.fn()}
      signedUpViaLinkedIn={signedUpViaLinkedIn}
    />
  )

const THANKS = /Thanks for signing up with LinkedIn/i
const WHY = /LinkedIn does not share this information as part of the authentication process/i

describe('LinkedInInputSection — LinkedIn sign-up explanation', () => {
  it('explains why the URL is still needed when the candidate signed up via LinkedIn', () => {
    renderSection(true)

    expect(screen.getByText(THANKS)).toBeInTheDocument()
    expect(screen.getByText(WHY)).toBeInTheDocument()
    // The instruction itself must survive alongside the explanation, not be replaced by it.
    expect(
      screen.getByText(/Enter your LinkedIn username or URL to automatically generate your profile/i)
    ).toBeInTheDocument()
  })

  it('shows the plain instruction for an email sign-up', () => {
    renderSection(false)

    expect(screen.queryByText(THANKS)).not.toBeInTheDocument()
    expect(screen.queryByText(WHY)).not.toBeInTheDocument()
    expect(
      screen.getByText('Enter your LinkedIn username or URL to automatically generate your profile.')
    ).toBeInTheDocument()
  })

  it('defaults to the plain instruction when the prop is not passed at all', () => {
    renderSection(undefined)

    expect(screen.queryByText(THANKS)).not.toBeInTheDocument()
    expect(
      screen.getByText('Enter your LinkedIn username or URL to automatically generate your profile.')
    ).toBeInTheDocument()
  })
})
