// Registers the @testing-library/jest-dom matchers (toBeInTheDocument, toBeEnabled, …)
// with vitest's Assertion type. vitest.setup.ts imports them at runtime, but it sits
// outside tsconfig.app.json's "src" include, so the augmentation has to be pulled in here
// for `tsc` to see it.
import "@testing-library/jest-dom/vitest"
