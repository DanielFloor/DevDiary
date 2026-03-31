import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ThemeToggle from '../index'
import * as ThemeContextModule from '../../../context/ThemeContext'

vi.mock('../../../context/ThemeContext', () => ({
  useTheme: vi.fn(),
}))

const mockUseTheme = vi.mocked(ThemeContextModule.useTheme)

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a Moon icon (Switch to dark mode) when theme is light', () => {
    mockUseTheme.mockReturnValue({ theme: 'light', toggleTheme: vi.fn() })
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Switch to dark mode' })).toBeInTheDocument()
  })

  it('renders a Sun icon (Switch to light mode) when theme is dark', () => {
    mockUseTheme.mockReturnValue({ theme: 'dark', toggleTheme: vi.fn() })
    render(<ThemeToggle />)
    expect(screen.getByRole('button', { name: 'Switch to light mode' })).toBeInTheDocument()
  })

  it('has aria-label "Switch to dark mode" in light mode', () => {
    mockUseTheme.mockReturnValue({ theme: 'light', toggleTheme: vi.fn() })
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode')
  })

  it('has aria-label "Switch to light mode" in dark mode', () => {
    mockUseTheme.mockReturnValue({ theme: 'dark', toggleTheme: vi.fn() })
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode')
  })

  it('calls toggleTheme exactly once when clicked', async () => {
    const toggleTheme = vi.fn()
    mockUseTheme.mockReturnValue({ theme: 'light', toggleTheme })
    render(<ThemeToggle />)
    await userEvent.setup().click(screen.getByRole('button'))
    expect(toggleTheme).toHaveBeenCalledOnce()
  })
})

