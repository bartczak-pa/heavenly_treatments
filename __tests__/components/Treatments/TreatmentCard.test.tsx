import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TreatmentCard from '@/components/Treatments/TreatmentCard'
import { Treatment } from '@/lib/data/treatments'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('TreatmentCard', () => {
  const mockTreatment: Treatment = {
    id: 'test-treatment-1',
    title: 'Relaxing Massage',
    slug: 'relaxing-massage',
    description: 'A soothing and relaxing massage to help you unwind and release tension.',
    image: '/images/treatments/massage.jpg',
    duration: '60 mins',
    price: '£80',
    category: 'massages'
  }

  const mockTreatmentWithoutImage: Treatment = {
    ...mockTreatment,
    id: 'test-treatment-2',
    title: 'Face Treatment',
    image: ''
  }

  it('renders treatment information correctly', () => {
    render(<TreatmentCard treatment={mockTreatment} />)
    
    expect(screen.getByText('Relaxing Massage')).toBeInTheDocument()
    expect(screen.getByText('A soothing and relaxing massage to help you unwind and release tension.')).toBeInTheDocument()
    expect(screen.getByText('60 mins')).toBeInTheDocument()
    expect(screen.getByText('80')).toBeInTheDocument()
  })

  it('renders image when treatment has image', () => {
    render(<TreatmentCard treatment={mockTreatment} />)
    
    const image = screen.getByAltText('Relaxing Massage')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/treatments/massage.jpg')
  })

  it('renders fallback when treatment has no image', () => {
    render(<TreatmentCard treatment={mockTreatmentWithoutImage} />)
    
    expect(screen.getByText('Image coming soon')).toBeInTheDocument()
    expect(screen.queryByAltText('Face Treatment')).not.toBeInTheDocument()
  })

  it('renders correct links', () => {
    render(<TreatmentCard treatment={mockTreatment} />)
    
    const detailLinks = screen.getAllByRole('link', { name: /relaxing massage/i })
    expect(detailLinks.length).toBeGreaterThan(0)
    expect(detailLinks[0]).toHaveAttribute('href', '/treatments/massages/relaxing-massage')
    
    const bookNowLink = screen.getByRole('link', { name: /book now/i })
    expect(bookNowLink).toHaveAttribute('href', '/contact?treatment=Relaxing%20Massage')
  })

  it('displays duration and price with icons', () => {
    render(<TreatmentCard treatment={mockTreatment} />)
    
    // Check that duration and price are displayed
    expect(screen.getByText('60 mins')).toBeInTheDocument()
    expect(screen.getByText('80')).toBeInTheDocument()
  })

  it('has proper accessibility structure', () => {
    render(<TreatmentCard treatment={mockTreatment} />)
    
    // Check that the title is rendered as a heading
    const heading = screen.getByRole('heading', { name: 'Relaxing Massage' })
    expect(heading).toBeInTheDocument()
    
    // Check that links are accessible
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)
  })
})