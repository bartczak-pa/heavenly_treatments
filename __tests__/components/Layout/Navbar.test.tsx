import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Navbar from '@/components/Layout/Navbar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Stub BookingButton to avoid pulling in A/B-test hooks; render a simple link.
vi.mock('@/components/BookingButton', () => ({
  BookingButton: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <a href="/contact" onClick={onClick}>
      {children}
    </a>
  ),
}))

describe('Navbar', () => {
  it('renders the wordmark lockup and inline nav links', () => {
    render(<Navbar />)

    expect(screen.getByText('Heavenly Treatments')).toBeInTheDocument()
    expect(screen.getByText('with Hayleybell · Kelso')).toBeInTheDocument()

    const primaryNav = screen.getByRole('navigation', { name: /primary/i })
    expect(within(primaryNav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(within(primaryNav).getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(within(primaryNav).getByRole('link', { name: 'Treatments' })).toHaveAttribute('href', '/treatments')
    expect(within(primaryNav).getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })

  it('marks the active route with aria-current', () => {
    render(<Navbar />)

    const primaryNav = screen.getByRole('navigation', { name: /primary/i })
    // usePathname is mocked to '/', so Home is the active route.
    expect(within(primaryNav).getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(within(primaryNav).getByRole('link', { name: 'About' })).not.toHaveAttribute('aria-current')
  })

  it('opens the full-screen overlay from the hamburger and closes on Esc', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /open menu/i }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: 'About' })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the overlay when a nav link is selected', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    await user.click(screen.getByRole('button', { name: /open menu/i }))
    const dialog = screen.getByRole('dialog')

    await user.click(within(dialog).getByRole('link', { name: 'Contact' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
