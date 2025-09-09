'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div role="alert" className="p-4 border border-red-300 rounded">
          <h2 className="font-semibold">Something went wrong</h2>
          <p>Please try again or reload the page.</p>
          {process.env.NODE_ENV !== 'production' && (
            <details className="mt-2 text-sm text-gray-600">
              <summary>Error details</summary>
              <pre className="mt-1 whitespace-pre-wrap">{error.message || 'An error occurred'}</pre>
            </details>
          )}
          <button
            type="button"
            className="mt-2 underline mr-4"
            onClick={() => reset()}
          >
            Try again
          </button>
          <button
            type="button"
            className="mt-2 underline"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </div>
      </body>
    </html>
  )
}