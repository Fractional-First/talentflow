import { vi } from 'vitest'

/**
 * Creates a mock Supabase client for testing
 *
 * Usage:
 * ```typescript
 * import { createMockSupabase, mockRpcSuccess, mockRpcError } from '../fixtures/mockSupabase'
 *
 * vi.mock('@/integrations/supabase/client', () => ({
 *   supabase: createMockSupabase()
 * }))
 *
 * // In test:
 * mockRpcSuccess(supabase, 'get_public_profile', mockData)
 * mockRpcError(supabase, 'get_public_profile', { code: '42501', message: 'Permission denied' })
 * ```
 */

export interface MockSupabaseClient {
  rpc: ReturnType<typeof vi.fn>
  from: ReturnType<typeof vi.fn>
  auth: {
    getSession: ReturnType<typeof vi.fn>
    getUser: ReturnType<typeof vi.fn>
    signInWithPassword: ReturnType<typeof vi.fn>
    signUp: ReturnType<typeof vi.fn>
    signOut: ReturnType<typeof vi.fn>
    onAuthStateChange: ReturnType<typeof vi.fn>
  }
  storage: {
    from: ReturnType<typeof vi.fn>
  }
}

/**
 * Creates a fresh mock Supabase client
 */
export const createMockSupabase = (): MockSupabaseClient => ({
  rpc: vi.fn(),
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(),
        maybeSingle: vi.fn(),
      })),
      order: vi.fn(() => ({
        limit: vi.fn(),
      })),
    })),
    insert: vi.fn(() => ({
      select: vi.fn(),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(),
    })),
  })),
  auth: {
    getSession: vi.fn(),
    getUser: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
  },
  storage: {
    from: vi.fn(() => ({
      upload: vi.fn(),
      download: vi.fn(),
      getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://example.com/image.jpg' } })),
    })),
  },
})

/**
 * Mock a successful RPC call
 */
export const mockRpcSuccess = <T>(
  supabase: MockSupabaseClient,
  _functionName: string,
  data: T
) => {
  vi.mocked(supabase.rpc).mockResolvedValueOnce({
    data,
    error: null,
  })
}

/**
 * Mock an array response from RPC (common pattern)
 */
export const mockRpcArraySuccess = <T>(
  supabase: MockSupabaseClient,
  _functionName: string,
  data: T[]
) => {
  vi.mocked(supabase.rpc).mockResolvedValueOnce({
    data,
    error: null,
  })
}

/**
 * Mock an RPC error
 */
export const mockRpcError = (
  supabase: MockSupabaseClient,
  _functionName: string,
  error: { code?: string; message?: string; details?: string }
) => {
  vi.mocked(supabase.rpc).mockResolvedValueOnce({
    data: null,
    error,
  })
}

/**
 * Mock a permission denied error (42501)
 */
export const mockRpcPermissionDenied = (supabase: MockSupabaseClient) => {
  mockRpcError(supabase, '', {
    code: '42501',
    message: 'permission denied for function get_public_profile',
  })
}

/**
 * Mock an empty result (profile not found)
 */
export const mockRpcEmpty = (supabase: MockSupabaseClient) => {
  vi.mocked(supabase.rpc).mockResolvedValueOnce({
    data: [],
    error: null,
  })
}

/**
 * Mock a network error
 */
export const mockRpcNetworkError = (supabase: MockSupabaseClient) => {
  vi.mocked(supabase.rpc).mockRejectedValueOnce(new Error('Network error'))
}

/**
 * Reset all mocks on the Supabase client
 */
export const resetSupabaseMocks = (supabase: MockSupabaseClient) => {
  vi.mocked(supabase.rpc).mockReset()
  vi.mocked(supabase.from).mockReset()
  vi.mocked(supabase.auth.getSession).mockReset()
  vi.mocked(supabase.auth.getUser).mockReset()
}
