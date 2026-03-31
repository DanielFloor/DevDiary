import { expect, vi, afterEach } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
import { cleanup } from '@testing-library/react'

// Extend vitest's expect with jest-dom matchers (toBeInTheDocument, toHaveAttribute, etc.)
expect.extend(matchers)

// Automatically unmount and clean up rendered components after each test.
afterEach(cleanup)

// happy-dom does not stub window.matchMedia — provide a default that returns matches:false.
// Individual tests can override this per-test.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockReturnValue({ matches: false }),
})



