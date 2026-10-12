import { describe, it, expect } from 'vitest'
import { AUTH_ERROR_CODE, type AuthErrorCode } from '@/integrations/supabase/authRedirect'

// The type assertions here are checked by `tsc -p tsconfig.app.json`, not by vitest.
describe('AuthErrorCode', () => {
  it("accepts Supabase's known codes and rejects anything else", () => {
    const known: AuthErrorCode = 'otp_expired'
    // @ts-expect-error not a Supabase auth error code
    const unknown: AuthErrorCode = 'not_a_code'

    expect(known).toBe(AUTH_ERROR_CODE.otpExpired)
    expect(unknown).toBe('not_a_code')
  })
})
