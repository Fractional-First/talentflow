import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { ReactNode } from 'react'

// Mock the transport only — the page, the hook and the request body it builds are real.
const mockRpc = vi.fn()
const mockInvoke = vi.fn()

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: 'user-1', email: 'candidate@example.com' } },
        error: null,
      }),
    },
    rpc: (...args: unknown[]) => mockRpc(...args),
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}))

import Agreement from '@/pages/dashboard/Agreement'
import { CURRENT_AGREEMENT_VERSION } from '@/queries/useAgreementAcceptance'

// A previously-accepted (but out-of-date) acceptance row. The page pre-fills the
// whole form from it, so the submit button is enabled without driving every field.
const previousAcceptance = {
  is_accepted: true,
  is_current_version: false,
  accepted_at: '2026-01-02T03:04:05Z',
  agreement_version: 'Master Candidate Agreement (01.01.2025) PDF',
  signature_name: 'Jane Candidate',
  contact_email: 'candidate@example.com',
  mobile_country_code: '+65',
  mobile_number: '91234567',
  full_legal_name: 'Jane Candidate',
  residential_address: {
    addressLine1: '1 Raffles Place',
    addressLine2: '',
    city: 'Singapore',
    stateProvince: '',
    postalCode: '048616',
    country: 'Singapore',
  },
  contracting_type: 'individual',
  entity_name: null,
  entity_registration_number: null,
  entity_address: null,
  entity_confirmed: null,
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  )
}

describe('Agreement page — acceptance payload', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRpc.mockResolvedValue({ data: [previousAcceptance], error: null })
    mockInvoke.mockResolvedValue({ data: { success: true }, error: null })
  })

  it('declares agreement kind "talent" when recording an acceptance', async () => {
    const user = userEvent.setup()
    const Wrapper = createWrapper()

    render(<Agreement />, { wrapper: Wrapper })

    const submit = await screen.findByRole('button', {
      name: /Accept All & Get Engagement-Ready/i,
    })

    // Wait for the pre-fill effect to run, otherwise the click is a no-op.
    await waitFor(() => expect(mockRpc).toHaveBeenCalled())

    await user.click(submit)

    await waitFor(() => expect(mockInvoke).toHaveBeenCalledTimes(1))

    const [fnName, options] = mockInvoke.mock.calls[0] as [
      string,
      { body: Record<string, unknown> },
    ]

    expect(fnName).toBe('record-agreement-acceptance')
    // The talent portal must declare its kind, alongside the version string the
    // database used to infer it from.
    expect(options.body).toMatchObject({
      p_agreement_kind: 'talent',
      p_agreement_version: CURRENT_AGREEMENT_VERSION,
    })
  })
})
