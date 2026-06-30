import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import BookingCtaBand from '@/components/Layout/BookingCtaBand'
import { contactInfo } from '@/lib/data/contactInfo'

vi.mock('@/components/BookingButton', () => ({
  BookingButton: ({ children }: { children: React.ReactNode }) => (
    <a href="/contact">{children}</a>
  ),
}))

describe('BookingCtaBand', () => {
  it('renders the relaxation CTA heading', () => {
    render(<BookingCtaBand />)
    expect(
      screen.getByRole('heading', { name: /your journey to relaxation starts here/i }),
    ).toBeInTheDocument()
  })

  it('renders contact details (address, phone, email)', () => {
    render(<BookingCtaBand />)

    const { address, phone, email } = contactInfo

    // Address (street + locality + postcode rendered together)
    expect(screen.getByText(new RegExp(address.streetAddress, 'i'))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(address.postalCode, 'i'))).toBeInTheDocument()

    // Phone links to a sanitised tel: href
    const phoneLink = screen.getByRole('link', { name: phone })
    expect(phoneLink).toHaveAttribute('href', `tel:${phone.replace(/\s+/g, '')}`)

    // Email links to mailto:
    const emailLink = screen.getByRole('link', { name: email })
    expect(emailLink).toHaveAttribute('href', `mailto:${email}`)
  })
})
