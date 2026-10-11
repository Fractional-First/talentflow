import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

// Mock the transport only — the page's own flow is real.
const mockInvoke = vi.fn()
const mockSetSession = vi.fn()
let profileRow: { onboarding_status: string; profile_data: Record<string, unknown> | null }

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      setSession: (...args: unknown[]) => mockSetSession(...args),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: profileRow, error: null }) }) }),
      update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    }),
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}))

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import AuthCallback from '@/pages/AuthCallback'

// What the email-verification link lands on: Supabase puts the new session in the URL hash.
const arriveFromVerificationLink = () => {
  window.location.hash = '#access_token=at-123&refresh_token=rt-456&type=signup'
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/auth/callback']}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/create-profile" element={<p>create profile page</p>} />
          <Route path="/edit-profile" element={<p>edit profile page</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AuthCallback — welcome email', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    profileRow = { onboarding_status: 'SIGNED_UP', profile_data: null }
    mockSetSession.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    mockInvoke.mockResolvedValue({ data: { sent: true }, error: null })
  })

  it('asks for the welcome email once after the email is verified', async () => {
    arriveFromVerificationLink()

    expect(await screen.findByText('create profile page')).toBeInTheDocument()
    expect(mockInvoke).toHaveBeenCalledTimes(1)
    expect(mockInvoke).toHaveBeenCalledWith('send-welcome-email')
  })

  it('asks for it on the generated-profile path too', async () => {
    profileRow = { onboarding_status: 'SIGNED_UP', profile_data: { name: 'Claire' } }
    arriveFromVerificationLink()

    expect(await screen.findByText('edit profile page')).toBeInTheDocument()
    expect(mockInvoke).toHaveBeenCalledWith('send-welcome-email')
  })

  it('still continues onboarding, and logs it, when the welcome email fails', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    // What supabase-js resolves with when the function answers non-2xx.
    const failure = new Error('Edge Function returned a non-2xx status code')
    mockInvoke.mockResolvedValue({ data: null, error: failure })
    arriveFromVerificationLink()

    expect(await screen.findByText('create profile page')).toBeInTheDocument()
    await waitFor(() => expect(consoleError).toHaveBeenCalledWith('Welcome email failed:', failure))
    consoleError.mockRestore()
  })

  it('still continues onboarding when the welcome email never answers', async () => {
    mockInvoke.mockReturnValue(new Promise(() => {}))
    arriveFromVerificationLink()

    expect(await screen.findByText('create profile page')).toBeInTheDocument()
  })
})
