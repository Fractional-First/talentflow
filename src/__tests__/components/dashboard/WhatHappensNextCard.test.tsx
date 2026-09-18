import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import { WhatHappensNextCard } from '@/components/dashboard/WhatHappensNextCard'

// This card is Daniel's design from talentflow#148, restored verbatim after QA round 3 on #159.
// It is deliberately STATIC: it sets expectations about what the team does next and lists the
// three prerequisites as a fixed 1-2-3, without reading any query or reflecting what the
// candidate has already completed. An earlier revision on this branch made it stateful — filled
// checkmarks, an "any order" line, a tinted card — and that is exactly what was rejected. These
// tests pin his version so the adaptation cannot creep back in unnoticed.

const PREREQUISITES = [
  'Published your profile',
  'Set your job preferences',
  'Accepted your agreement with Fractional First',
]

describe('WhatHappensNextCard', () => {
  it('renders with no props and no query provider', () => {
    // The component takes no props and calls no hook that needs a QueryClientProvider. If it
    // ever starts reading state again, this render is where it breaks first.
    expect(() => render(<WhatHappensNextCard />)).not.toThrow()

    expect(
      screen.getByRole('heading', { name: 'What Happens Next' })
    ).toBeInTheDocument()
    expect(
      screen.getByText("Here's what to expect now that your profile is complete")
    ).toBeInTheDocument()
  })

  it("lists the three prerequisites in Daniel's wording and order, numbered 1-2-3", () => {
    render(<WhatHappensNextCard />)

    expect(
      screen.getByText("Our team reviews your completed profile once you've:")
    ).toBeInTheDocument()

    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(PREREQUISITES.length)

    PREREQUISITES.forEach((label, index) => {
      const item = screen.getByText(label).closest('li')
      if (!item) throw new Error(`No list item found for "${label}"`)
      expect(items[index]).toBe(item)
      // The badge is the ordinal, always — never a checkmark, whatever the candidate has done.
      expect(within(item).getByText(String(index + 1))).toBeInTheDocument()
    })
  })

  it('states what the team does next', () => {
    render(<WhatHappensNextCard />)

    expect(
      screen.getByText(
        'We match you to relevant fractional and full-time opportunities as we uncover them'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText("We reach out directly when there's a strong fit")
    ).toBeInTheDocument()
  })

  it('carries none of the rejected stateful affordances', () => {
    const { container } = render(<WhatHappensNextCard />)

    expect(
      screen.queryByText('You can complete these in any order.')
    ).not.toBeInTheDocument()
    expect(screen.queryByText(/You're all set/i)).not.toBeInTheDocument()
    expect(screen.queryByText('Done')).not.toBeInTheDocument()
    expect(screen.queryByText('Not done yet')).not.toBeInTheDocument()
    expect(container.querySelector('.line-through')).toBeNull()
  })
})
