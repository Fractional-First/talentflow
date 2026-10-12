import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react'

const mockSignInWithOAuth = vi.fn()

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithOAuth: (...args: unknown[]) => mockSignInWithOAuth(...args),
    },
  },
}))

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

import { toast } from 'sonner'
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton'

describe('GoogleSignInButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts Google sign-in and returns through /auth/callback', async () => {
    mockSignInWithOAuth.mockReturnValue(new Promise(() => {})) // the browser leaves for Google
    render(<GoogleSignInButton label="Continue with Google" />)

    fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }))

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    expect(await screen.findByRole('button', { name: 'Connecting...' })).toBeDisabled()
  })

  it('shows an error and becomes clickable again when sign-in cannot start', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    mockSignInWithOAuth.mockResolvedValue({ data: null, error: new Error('provider is not enabled') })
    render(<GoogleSignInButton label="Sign up with Google" />)

    fireEvent.click(screen.getByRole('button', { name: 'Sign up with Google' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to sign in with Google'))
    expect(screen.getByRole('button', { name: 'Sign up with Google' })).toBeEnabled()
    consoleError.mockRestore()
  })

  it('becomes clickable again when Back restores the page from the back/forward cache', async () => {
    mockSignInWithOAuth.mockReturnValue(new Promise(() => {}))
    render(<GoogleSignInButton label="Continue with Google" />)
    fireEvent.click(screen.getByRole('button', { name: 'Continue with Google' }))
    expect(await screen.findByRole('button', { name: 'Connecting...' })).toBeDisabled()

    act(() => {
      window.dispatchEvent(new Event('pageshow'))
    })

    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeEnabled()
  })

  it('is disabled while another sign-in is in progress', () => {
    render(<GoogleSignInButton label="Continue with Google" disabled />)

    expect(screen.getByRole('button', { name: 'Continue with Google' })).toBeDisabled()
  })
})
