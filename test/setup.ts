import '@testing-library/jest-dom'
import { vi } from 'vitest'
import React from 'react'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => 
    React.createElement('img', { src, alt, ...props }),
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) =>
    React.createElement('a', { href, ...props }, children),
}))