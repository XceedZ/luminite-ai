"use client"

import { useEffect, useState } from 'react'
import { getCodeFromUpstash } from '@/lib/actions/ai'
import { renderReactComponent } from '@/lib/utils/react-to-html'

interface PreviewPageProps {
  params: Promise<{
    sessionId: string
  }>
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const [componentHtml, setComponentHtml] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId, setSessionId] = useState<string | null>(null)

  // Await params first
  useEffect(() => {
    async function getParams() {
      const resolvedParams = await params
      setSessionId(resolvedParams.sessionId)
    }
    getParams()
  }, [params])

  useEffect(() => {
    if (!sessionId) return

    async function loadAndRenderComponent() {
      try {
        setIsLoading(true)
        const code = await getCodeFromUpstash(sessionId!)
        
        if (!code) {
          setError('No code found for this session')
          setIsLoading(false)
          return
        }

        // Extract React component code from markdown code blocks (if present)
        // Code might already be extracted (no markdown blocks) or still wrapped in markdown
        let componentCode = code.trim()
        const tsxMatch = code.match(/```tsx\s*\n?([\s\S]*?)```/) || 
                        code.match(/```ts\s*\n?([\s\S]*?)```/) ||
                        code.match(/```jsx\s*\n?([\s\S]*?)```/)
        
        if (tsxMatch && tsxMatch[1]) {
          // Code is wrapped in markdown blocks, extract it
          componentCode = tsxMatch[1].trim()
          console.log('[Preview] Extracted code from markdown block')
        } else {
          // Code is already extracted (no markdown blocks), use as-is
          componentCode = code.trim()
          console.log('[Preview] Code already extracted, using as-is')
        }
        
        // Validate that we have actual React code
        // Check for React/TSX indicators: "use client", import statements, JSX, or function definitions
        const hasReactIndicators = componentCode.includes('"use client"') || 
                                   componentCode.includes("'use client'") ||
                                   componentCode.includes('import ') ||
                                   componentCode.includes('export ') ||
                                   componentCode.includes('function ') ||
                                   componentCode.includes('const ') ||
                                   componentCode.includes('return (') ||
                                   componentCode.includes('return <')
        
        if (!componentCode || componentCode.length < 50 || !hasReactIndicators) {
          setError('No valid React component code found. Code must be a React/TSX component.')
          console.error('[Preview] Invalid code:', {
            codeLength: componentCode?.length || 0,
            hasReactIndicators,
            codePreview: componentCode?.substring(0, 200)
          })
          setIsLoading(false)
          return
        }
        
        // Render React component to HTML
        const html = await renderReactComponent(componentCode)
        setComponentHtml(html)
      } catch (err) {
        console.error('Error loading component:', err)
        setError(err instanceof Error ? err.message : 'Failed to load component')
      } finally {
        setIsLoading(false)
      }
    }

    loadAndRenderComponent()
  }, [sessionId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-3 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center p-4">
          <p className="text-sm font-medium text-destructive mb-2">Error</p>
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  // Render the HTML directly using iframe to avoid hydration issues
  // The HTML is already a complete document with its own <html> and <body>
  if (!componentHtml) {
    return null
  }

  return (
    <div className="w-full h-full">
    <iframe
      srcDoc={componentHtml}
      className="w-full h-full border-0"
        style={{ minHeight: '100vh', width: '100%' }}
      title="Component Preview"
      sandbox="allow-scripts allow-same-origin"
    />
    </div>
  )
}
