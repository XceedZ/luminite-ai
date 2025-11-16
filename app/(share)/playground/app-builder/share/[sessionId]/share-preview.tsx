"use client"

import { useMemo, useEffect, useState } from "react"
import { renderReactComponent } from '@/lib/utils/react-to-html'

interface SharePreviewProps {
  code: string
}

export function SharePreview({ code }: SharePreviewProps) {
  const [mounted, setMounted] = useState(false)
  const [reactHtml, setReactHtml] = useState<string>('')
  const [isRenderingReact, setIsRenderingReact] = useState(false)
  const [reactRenderError, setReactRenderError] = useState<string | null>(null)

  // Only render iframe on client-side to avoid hydration mismatch
  useEffect(() => {
    console.log('[SharePreview] Mounting component, code length:', code?.length || 0)
    setMounted(true)
  }, [code])

  // Helper function to remove external CSS links from HTML
  const removeExternalCssLinks = (html: string): string => {
    return html.replace(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi, '')
  }

  // Extract HTML from code blocks or use code directly
  const extractHtml = (code: string): string => {
    // Try to extract from markdown code blocks
    const htmlMatch = code.match(/```html\s*\n?([\s\S]*?)```/);
    if (htmlMatch) {
      return htmlMatch[1].trim();
    }

    // Check if code is already HTML
    if (code.includes('<!DOCTYPE') || code.includes('<html') || code.includes('<HTML')) {
      return code.trim();
    }

    // If code contains HTML-like tags, assume it's HTML
    if (code.includes('<') && code.includes('>')) {
      return code.trim();
    }

    return code.trim();
  }

  // Extract React/TSX code from markdown blocks
  const extractReactCode = (code: string): string | null => {
    const tsxMatch = code?.match(/```tsx\s*\n?([\s\S]*?)```/) || 
                     code?.match(/```ts\s*\n?([\s\S]*?)```/) ||
                     code?.match(/```jsx\s*\n?([\s\S]*?)```/);
    
    if (tsxMatch) {
      return tsxMatch[1].trim();
    }

    // Check if code is already React/TSX (no markdown wrapper)
    const isReactCodeDirect = code?.includes('"use client"') || 
                              code?.includes("'use client'") || 
                              code?.includes('export default') || 
                              code?.includes('import {') || 
                              code?.includes('from "@/components/ui') ||
                              (code?.includes('function ') && code?.includes('return')) ||
                              (code?.includes('const ') && code?.includes('return <'))
    
    if (isReactCodeDirect) {
      return code.trim();
    }

    return null;
  }

  const reactCode = extractReactCode(code);

  // Render React component if detected
  useEffect(() => {
    if (reactCode && !isRenderingReact && !reactHtml && mounted) {
      setIsRenderingReact(true)
      setReactRenderError(null)
      console.log('[SharePreview] Rendering React component', {
        reactCodeLength: reactCode.length,
        codePreview: reactCode.substring(0, 200)
      })
      
      renderReactComponent(reactCode)
        .then(html => {
          console.log('[SharePreview] React component rendered successfully', {
            htmlLength: html.length
          })
          setReactHtml(html)
          setIsRenderingReact(false)
        })
        .catch(err => {
          console.error('[SharePreview] Error rendering React component:', err)
          setReactRenderError(err instanceof Error ? err.message : 'Failed to render component')
          setIsRenderingReact(false)
        })
    }
  }, [reactCode, mounted, isRenderingReact, reactHtml])

  // Reset reactHtml when code changes
  useEffect(() => {
    if (!reactCode) {
      setReactHtml('')
      setReactRenderError(null)
      setIsRenderingReact(false)
    } else {
      // If reactCode changes, reset to trigger re-render
      setReactHtml('')
      setReactRenderError(null)
      setIsRenderingReact(false)
    }
  }, [reactCode])

  // Memoize complete HTML for iframe srcDoc
  const completeHtml = useMemo(() => {
    // If React HTML is ready, use it
    if (reactHtml) {
      console.log('[SharePreview] Using rendered React HTML')
      return reactHtml;
    }

    // Otherwise process as regular HTML
    console.log('[SharePreview] Processing HTML, raw code length:', code?.length || 0)
    try {
      let htmlCode = extractHtml(code);
      console.log('[SharePreview] After extraction:', {
        length: htmlCode.length,
        hasDoctype: htmlCode.includes('<!DOCTYPE'),
        hasHtml: htmlCode.includes('<html'),
        preview: htmlCode.substring(0, 150)
      })

      // Remove external CSS links
      htmlCode = removeExternalCssLinks(htmlCode);

      // Check if HTML is already complete
      if (htmlCode.includes('<!DOCTYPE') || htmlCode.includes('<html')) {
        console.log('[SharePreview] HTML is complete, using as-is')
        return htmlCode;
      }

      // If HTML has inline CSS, wrap it properly
      if (htmlCode.includes('<style>') || htmlCode.includes('<STYLE>')) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shared Preview</title>
</head>
${htmlCode}
</html>`
      }

      // Wrap in complete HTML structure
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shared Preview</title>
</head>
<body>
${htmlCode}
</body>
</html>`
    } catch (error) {
      console.error('Error creating complete HTML:', error)
      // Return safe fallback HTML
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error</title>
</head>
<body>
  <h1>Error loading preview</h1>
  <p>Please try again later.</p>
</body>
</html>`
    }
  }, [code, reactHtml])

  // Show loading state during SSR and initial client render
  if (!mounted) {
    return (
      <div className="w-full h-full fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading preview...</p>
        </div>
      </div>
    )
  }

  // Show rendering state for React components
  if (reactCode && isRenderingReact) {
    return (
      <div className="w-full h-full fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Rendering React component...</p>
        </div>
      </div>
    )
  }

  // Show error state if React rendering failed
  if (reactCode && reactRenderError) {
    return (
      <div className="w-full h-full fixed inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Render Error</h2>
          <p className="text-gray-600 text-sm mb-4">{reactRenderError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full fixed inset-0 bg-background" suppressHydrationWarning>
      <iframe
        srcDoc={completeHtml}
        className="w-full h-full border-0 block"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          border: 'none',
          margin: 0,
          padding: 0
        }}
        title="Shared Preview"
        sandbox="allow-scripts allow-forms allow-popups allow-modals allow-same-origin"
      />
    </div>
  )
}

