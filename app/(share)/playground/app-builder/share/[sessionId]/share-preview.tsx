"use client"

import { useMemo, useEffect, useState } from "react"

interface SharePreviewProps {
  code: string
}

export function SharePreview({ code }: SharePreviewProps) {
  const [mounted, setMounted] = useState(false)

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

  // Memoize complete HTML for iframe srcDoc
  const completeHtml = useMemo(() => {
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
  }, [code])

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

  return (
    <div className="w-full h-full fixed inset-0" suppressHydrationWarning>
      <iframe
        srcDoc={completeHtml}
        className="w-full h-full border-0"
        title="Shared Preview"
        sandbox="allow-scripts allow-forms allow-popups allow-modals"
        // Removed allow-same-origin for security - prevents sandbox escape
      />
    </div>
  )
}

