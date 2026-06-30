import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Footer from '@/components/Layout/Footer'
import { contactInfo } from '@/lib/data/contactInfo'

describe('Footer', () => {
  it('renders quick links wired to existing routes', () => {
    render(<Footer />)
    const nav = screen.getByRole('navigation', { name: /footer/i })
    expect(nav).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Treatments' })).toHaveAttribute('href', '/treatments')
  })

  it('renders contact details and legal links', () => {
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
})
