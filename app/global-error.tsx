'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div role="alert" className="p-4 border border-red-300 rounded">
          <h2 className="font-semibold">Something went wrong</h2>
          <p>Please try again or reload the page.</p>
          <details className="mt-2 text-sm text-gray-600">
            <summary>Error details</summary>
            <pre className="mt-1 whitespace-pre-wrap">{error.message}</pre>
          </details>
          <button
            className="mt-2 underline mr-4"
            onClick={() => reset()}
          >
            Try again
          </button>
          <button
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