import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { OnboardingStatus } from '@/utils/onboardingStatus'
import { AUTH_ERROR_CODE, OAUTH_ERROR } from '@/integrations/supabase/authRedirect'

// Mock the transport only — the page's own flow is real.
const mockInvoke = vi.fn()
const mockSetSession = vi.fn()
const mockUpdate = vi.fn()
let profileRow: { onboarding_status: OnboardingStatus; profile_data: Record<string, unknown> | null }

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      setSession: (...args: unknown[]) => mockSetSession(...args),
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: profileRow, error: null }) }) }),
      update: (values: unknown) => {
        mockUpdate(values)
        return { eq: () => Promise.resolve({ data: null, error: null }) }
      },
    }),
    functions: {
      invoke: (...args: unknown[]) => mockInvoke(...args),
    },
  },
}))

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { toast } from 'sonner'
import AuthCallback from '@/pages/AuthCallback'
import { profileStorage, type GeneratedProfile } from '@/utils/profileStorage'

// `suffix` is the hash ('#…') or query string ('?…') Supabase redirects back with.
const arriveAt = (suffix: string) => {
  window.history.replaceState(null, '', `/auth/callback${suffix}`)
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/auth/callback']}>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/create-profile" element={<p>create profile page</p>} />
          <Route path="/edit-profile" element={<p>edit profile page</p>} />
          <Route path="/dashboard" element={<p>dashboard page</p>} />
          <Route path="/change-password" element={<p>change password page</p>} />
          <Route path="/login" element={<p>login page</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

// What the email-verification link lands on: Supabase puts the new session in the URL hash.
const arriveFromVerificationLink = () =>
  arriveAt('#access_token=at-123&refresh_token=rt-456&type=signup')

const arriveFromOAuth = () => arriveAt('#access_token=at-123&refresh_token=rt-456&provider_token=pt')

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

describe('AuthCallback — onboarding status on sign-in (ff-workspace#42)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    profileStorage.remove()
    mockSetSession.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
    mockInvoke.mockResolvedValue({ data: { sent: true }, error: null })
  })

  it('sends a fully onboarded returning user to the dashboard without lowering their status', async () => {
    profileRow = { onboarding_status: 'PREFERENCES_SET', profile_data: { name: 'Claire' } }
    arriveFromOAuth()

    expect(await screen.findByText('dashboard page')).toBeInTheDocument()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('sends a returning user who confirmed their profile to the dashboard too', async () => {
    profileRow = { onboarding_status: 'PROFILE_CONFIRMED', profile_data: { name: 'Claire' } }
    arriveFromOAuth()

    expect(await screen.findByText('dashboard page')).toBeInTheDocument()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('sends a new Google user, already EMAIL_CONFIRMED by the signup trigger, to create a profile', async () => {
    profileRow = { onboarding_status: 'EMAIL_CONFIRMED', profile_data: null }
    arriveFromOAuth()

    expect(await screen.findByText('create profile page')).toBeInTheDocument()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('raises a just-verified email user from SIGNED_UP to EMAIL_CONFIRMED', async () => {
    profileRow = { onboarding_status: 'SIGNED_UP', profile_data: null }
    arriveFromVerificationLink()

    expect(await screen.findByText('create profile page')).toBeInTheDocument()
    expect(mockUpdate).toHaveBeenCalledWith({ onboarding_status: 'EMAIL_CONFIRMED' })
  })

  it('submits a profile generated before sign-up and opens it for editing', async () => {
    profileRow = { onboarding_status: 'EMAIL_CONFIRMED', profile_data: null }
    profileStorage.set({ id: 'gen-1', generatedAt: '2026-10-12', name: 'Claire' } as GeneratedProfile)
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }))
    arriveFromOAuth()

    expect(await screen.findByText('edit profile page')).toBeInTheDocument()
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/webhook/submit-profile'),
      expect.objectContaining({ method: 'POST' })
    )
    expect(mockUpdate).toHaveBeenCalledWith({ onboarding_status: 'PROFILE_GENERATED' })
    fetchSpy.mockRestore()
  })

  it('leaves an account that must set a password on that track', async () => {
    profileRow = { onboarding_status: 'SET_PASSWORD', profile_data: null }
    arriveFromOAuth()

    expect(await screen.findByText('change password page')).toBeInTheDocument()
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('returns to login with a message when the user cancels on Google', async () => {
    arriveAt(`#error=${OAUTH_ERROR.accessDenied}&error_code=${OAUTH_ERROR.accessDenied}&error_description=The+user+denied+access`)

    expect(await screen.findByText('login page')).toBeInTheDocument()
    expect(toast.error).toHaveBeenCalledWith('Sign-in was cancelled.')
    expect(mockSetSession).not.toHaveBeenCalled()
  })

  it('returns to login with a message on any other sign-in error', async () => {
    arriveAt(`#error=${OAUTH_ERROR.serverError}&error_description=Unable+to+exchange+external+code`)

    expect(await screen.findByText('login page')).toBeInTheDocument()
    expect(toast.error).toHaveBeenCalledWith('Sign-in failed. Please try again.')
    expect(mockSetSession).not.toHaveBeenCalled()
  })

  it('reads a sign-in error from the query string too', async () => {
    arriveAt(`?error=${OAUTH_ERROR.accessDenied}&error_description=The+user+denied+access`)

    expect(await screen.findByText('login page')).toBeInTheDocument()
    expect(toast.error).toHaveBeenCalledWith('Sign-in was cancelled.')
    expect(mockSetSession).not.toHaveBeenCalled()
  })

  it('says so when an email link has expired or was already used, instead of "cancelled"', async () => {
    arriveAt(`#error=${OAUTH_ERROR.accessDenied}&error_code=${AUTH_ERROR_CODE.otpExpired}&error_description=Email+link+is+invalid+or+has+expired`)

    expect(await screen.findByText('login page')).toBeInTheDocument()
    expect(toast.error).toHaveBeenCalledWith('This link has expired or was already used. Please log in.')
    expect(toast.error).not.toHaveBeenCalledWith('Sign-in was cancelled.')
  })
})
