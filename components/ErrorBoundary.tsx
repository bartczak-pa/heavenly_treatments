'use client'

import { Component, ReactNode, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  // eslint-disable-next-line no-unused-vars
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo)
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error caught by boundary:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert" aria-live="assertive" className="p-4 border border-red-300 rounded">
          <h2 className="font-semibold">Something went wrong</h2>
          <p>Please try refreshing the page.</p>
          <button
            type="button"
            className="mt-2 underline"
            onClick={() => (typeof window !== 'undefined' ? window.location.reload() : undefined)}
          >
            Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}