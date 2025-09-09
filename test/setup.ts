import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'
import React from 'react'

// Mock Next.js Image component
vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => 
    React.createElement('img', { src, alt, ...props }),
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) =>
    React.createElement('a', { href, ...props }, children),
}))