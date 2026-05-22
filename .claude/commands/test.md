# TDD Workflow

Use this command to follow test-driven development practices.

## Quick Start

```bash
# Run tests in watch mode (talentflow)
cd talentflow && npm run test -- --watch

# Run tests in watch mode (public-profiles)
cd public-profiles && npm run test -- --watch

# Run specific test file
npm run test -- src/__tests__/queries/usePublicProfile.test.ts
```

## TDD Cycle

### 1. Write the Test First

Create a test file that describes the expected behavior:

```typescript
// src/__tests__/queries/myFeature.test.ts
import { describe, it, expect } from 'vitest'

describe('myFeature', () => {
  it('should do something specific', () => {
    // Arrange
    const input = 'test'

    // Act
    const result = myFeature(input)

    // Assert
    expect(result).toBe('expected output')
  })
})
```

### 2. Run and Verify Failure

```bash
npm run test -- src/__tests__/queries/myFeature.test.ts
```

The test should fail because the feature doesn't exist yet.

**Red flags** (test is wrong, not the code):
- Import errors
- Syntax errors
- Mock configuration issues

### 3. Implement Minimum Code

Write just enough code to make the test pass. No more.

### 4. Run and Verify Success

```bash
npm run test -- src/__tests__/queries/myFeature.test.ts
```

### 5. Refactor (Optional)

Clean up the code while keeping tests green.

## Test Patterns

### Mocking Supabase RPC

```typescript
import { vi } from 'vitest'
import { supabase } from '@/integrations/supabase/client'

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    rpc: vi.fn()
  }
}))

// In test
vi.mocked(supabase.rpc).mockResolvedValueOnce({
  data: { /* mock data */ },
  error: null
})
```

### Testing React Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
)

const { result } = renderHook(() => useMyHook(), { wrapper })
await waitFor(() => expect(result.current.data).toBeDefined())
```

### Testing Error Handling

```typescript
it('handles 42501 permission error', async () => {
  vi.mocked(supabase.rpc).mockResolvedValueOnce({
    data: null,
    error: { code: '42501', message: 'Permission denied' }
  })

  const { result } = renderHook(() => usePublicProfile({ slug: 'test' }))

  await waitFor(() => {
    expect(result.current.error).toBeDefined()
    expect(result.current.error.code).toBe('42501')
  })
})
```

## Test File Locations

```
talentflow/src/__tests__/
├── fixtures/           # Shared test data
│   ├── mockProfile.ts
│   └── mockSupabase.ts
├── queries/            # Hook tests
├── components/         # Component tests
└── utils/              # Utility function tests

public-profiles/src/__tests__/
├── fixtures/           # Shared test data
├── lib/                # Server utility tests
├── components/         # Component tests
└── app/                # Page/route tests
```

## Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```
