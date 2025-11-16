"use client"

import { useEffect, useState } from 'react'
import { getCodeFromUpstash, saveCodeToUpstash } from '@/lib/actions/ai'
import { renderReactComponent } from '@/lib/utils/react-to-html'
import { EditorHeader } from './components/editor-header'
import { EditorToolbar } from './components/editor-toolbar'
import { EditorCanvas } from './components/editor-canvas'
import { Element } from '@craftjs/core'
import { EditableText } from './components/editable-text'
import { EditableImage } from './components/editable-image'
import { EditableButton } from './components/editable-button'
import { EditableContainer } from './components/editable-container'

interface PreviewWithEditorProps {
  sessionId: string
}

export default function PreviewWithEditor({ sessionId }: PreviewWithEditorProps) {
  const [componentHtml, setComponentHtml] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editorState, setEditorState] = useState<string>('')

  useEffect(() => {
    async function loadAndRenderComponent() {
      try {
        setIsLoading(true)
        const code = await getCodeFromUpstash(sessionId)
        
        if (!code) {
          setError('No code found for this session')
          setIsLoading(false)
          return
        }

        // Extract React component code from markdown code blocks (if present)
        let componentCode = code.trim()
        const tsxMatch = code.match(/```tsx\s*\n?([\s\S]*?)```/) || 
                        code.match(/```ts\s*\n?([\s\S]*?)```/) ||
                        code.match(/```jsx\s*\n?([\s\S]*?)```/)
        
        if (tsxMatch && tsxMatch[1]) {
          componentCode = tsxMatch[1].trim()
          console.log('[Preview] Extracted code from markdown block')
        } else {
          componentCode = code.trim()
          console.log('[Preview] Code already extracted, using as-is')
        }
        
        // Validate that we have actual React code
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

  const handleSave = async () => {
    try {
      // Save editor state to Upstash
      if (editorState) {
        await saveCodeToUpstash(sessionId, editorState)
        alert('Changes saved successfully!')
      }
    } catch (err) {
      console.error('Error saving:', err)
      alert('Failed to save changes')
    }
  }

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

  if (!componentHtml) {
    return null
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header dengan Edit Button */}
      <EditorHeader
        sessionId={sessionId}
        editMode={editMode}
        onEditModeChange={setEditMode}
        onSave={handleSave}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden" style={{ marginTop: '64px' }}>
        {/* Toolbar - hanya tampil saat edit mode */}
        {editMode && <EditorToolbar />}

        {/* Canvas Area */}
        <div className={`flex-1 overflow-auto ${editMode ? 'ml-64' : ''} bg-gray-50`}>
          {editMode ? (
            <EditorCanvas
              enabled={editMode}
              onStateChange={setEditorState}
            >
              {/* Default content untuk editor */}
              <Element is={EditableText} text="<h1>Welcome to App Builder</h1>" fontSize="32px" fontWeight="bold" />
              <Element is={EditableText} text="<p>Click Edit button to start customizing. Click any element to edit it.</p>" />
              <Element is={EditableButton} text="Get Started" />
              <Element is={EditableImage} />
            </EditorCanvas>
          ) : (
            <iframe
              srcDoc={componentHtml}
              className="w-full h-full border-0"
              title="Component Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          )}
        </div>
      </div>
    </div>
  )
}

