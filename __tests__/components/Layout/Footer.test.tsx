import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/Layout/Footer'
import { contactInfo } from '@/lib/data/contactInfo'

describe('Footer', () => {
  it('renders explore links wired to existing routes', () => {
    render(<Footer />)
    const nav = screen.getByRole('navigation', { name: /footer/i })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Treatments' })).toHaveAttribute('href', '/treatments')
    // Design specifies "About Me" (not "About") in the footer
    expect(screen.getByRole('link', { name: 'About Me' })).toHaveAttribute('href', '/about')
  })

  it('renders connect details and legal links', () => {
    render(<Footer />)

    const { phone, email } = contactInfo
    expect(screen.getByRole('link', { name: phone })).toHaveAttribute(
      'href',
      `tel:${phone.replace(/\s+/g, '')}`,
    )
    expect(screen.getByRole('link', { name: email })).toHaveAttribute('href', `mailto:${email}`)

    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute('href', '/privacy-policy')
    expect(screen.getByRole('link', { name: /terms of service/i })).toHaveAttribute('href', '/terms')
    expect(screen.getByRole('link', { name: /cookie policy/i })).toHaveAttribute('href', '/cookie-policy')
  })

  it('renders social links as Clay-coloured text (not icon images)', () => {
    render(<Footer />)
    const fb = screen.getByRole('link', { name: /heavenly treatments on facebook/i })
    const ig = screen.getByRole('link', { name: /heavenly treatments on instagram/i })
    expect(fb).toBeInTheDocument()
    expect(ig).toBeInTheDocument()
    // Text content should be visible label, no img inside
    expect(fb.querySelector('img')).toBeNull()
    expect(ig.querySelector('img')).toBeNull()
  })
})
