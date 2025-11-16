"use client"

import { Editor, Frame, Element, useEditor } from '@craftjs/core'
import { EditableText } from './editable-text'
import { SimpleText } from './simple-text'
import { EditableImage } from './editable-image'
import { EditableButton } from './editable-button'
import { EditableContainer } from './editable-container'
import { EditorErrorBoundary } from './editor-error-boundary'
import { ReactNode, useState, useEffect } from 'react'

interface EditorCanvasProps {
  children?: ReactNode
  enabled: boolean
  onStateChange?: (state: string) => void
  showToolbar?: boolean
  showWelcome?: boolean
}

// Toolbar component - must be inside <Editor> context
const InlineToolbar = () => {
  const { connectors } = useEditor()

  return (
    <div className="w-64 border-l border-border bg-card overflow-y-auto p-3 flex-shrink-0">
      <h3 className="font-semibold text-sm text-foreground mb-3">Components</h3>
      <div className="space-y-2">
        <button
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, <SimpleText />)
            }
          }}
          className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg hover:border-primary hover:bg-accent transition-all text-left text-sm font-medium text-foreground"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Text
          </div>
        </button>

        <button
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, <EditableImage />)
            }
          }}
          className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg hover:border-primary hover:bg-accent transition-all text-left text-sm font-medium text-foreground"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Image
          </div>
        </button>

        <button
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, <EditableButton />)
            }
          }}
          className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg hover:border-primary hover:bg-accent transition-all text-left text-sm font-medium text-foreground"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Button
          </div>
        </button>

        <button
          ref={(ref) => {
            if (ref) {
              connectors.create(ref, <EditableContainer />)
            }
          }}
          className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg hover:border-primary hover:bg-accent transition-all text-left text-sm font-medium text-foreground"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Container
          </div>
        </button>
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="font-semibold text-sm text-foreground mb-3">Instructions</h3>
        <div className="text-xs text-muted-foreground space-y-2">
          <p>• Drag components to canvas</p>
          <p>• Click to select and edit</p>
          <p>• Drag to reorder elements</p>
        </div>
      </div>
    </div>
  )
}

export const EditorCanvas = ({ children, enabled, onStateChange, showToolbar = true, showWelcome = false }: EditorCanvasProps) => {
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [editorKey, setEditorKey] = useState(0)
  
  // Ensure resolver and all components are ready before rendering
  useEffect(() => {
    // Clear any potentially corrupt Craft.js state from localStorage
    try {
      const craftKeys = Object.keys(localStorage).filter(key => 
        key.includes('craftjs') || key.includes('editor-state')
      )
      if (craftKeys.length > 0) {
        console.log('[EditorCanvas] Clearing old Craft.js state:', craftKeys)
        craftKeys.forEach(key => localStorage.removeItem(key))
      }
    } catch (error) {
      console.warn('[EditorCanvas] Could not clear localStorage:', error)
    }
    
    // Verify all components are loaded and have craft config
    const componentsReady = 
      typeof EditableText !== 'undefined' &&
      typeof SimpleText !== 'undefined' &&
      typeof EditableImage !== 'undefined' &&
      typeof EditableButton !== 'undefined' &&
      typeof EditableContainer !== 'undefined' &&
      EditableText.craft &&
      SimpleText.craft &&
      EditableImage.craft &&
      EditableButton.craft &&
      EditableContainer.craft
    
    if (componentsReady) {
      console.log('[EditorCanvas] ✅ All components and craft configs loaded')
      // Wait for next tick to ensure DOM is ready
      requestAnimationFrame(() => {
        setIsReady(true)
        setEditorKey(prev => prev + 1)
      })
    } else {
      console.error('[EditorCanvas] ❌ Some components failed to load', {
        EditableText: typeof EditableText !== 'undefined',
        EditableImage: typeof EditableImage !== 'undefined', 
        EditableButton: typeof EditableButton !== 'undefined',
        EditableContainer: typeof EditableContainer !== 'undefined',
      })
      // Retry after delay
      const retryTimer = setTimeout(() => {
        setHasError(true)
      }, 2000)
      return () => clearTimeout(retryTimer)
    }
  }, [])
  
  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-sm text-destructive">Failed to load editor components</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }
  
  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-3 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Initializing editor...</p>
        </div>
      </div>
    )
  }
  
  return (
    <EditorErrorBoundary key={editorKey}>
      <Editor
        key={`editor-${editorKey}`}
        resolver={{
          EditableText,
          SimpleText,
          EditableImage,
          EditableButton,
          EditableContainer,
        }}
        enabled={enabled}
        onNodesChange={(query) => {
          if (onStateChange) {
            try {
              const json = query.serialize()
              onStateChange(json)
            } catch (error) {
              console.error('[EditorCanvas] Serialization error:', error)
            }
          }
        }}
      >
        <div className="flex h-full w-full">
          {/* Canvas Area */}
          <div className="flex-1 overflow-auto bg-muted/20 p-4">
            <div className="max-w-6xl mx-auto">
              <EditorErrorBoundary>
                <Frame>
                  <Element
                    is={EditableContainer}
                    canvas
                    backgroundColor="transparent"
                    padding="24px"
                    className="min-h-[400px] bg-card rounded-lg border border-border"
                  >
                  {showWelcome && (
                    <>
                      <Element
                        is={SimpleText}
                        text="Welcome to Visual Editor" 
                        fontSize="32px" 
                        fontWeight="bold"
                        color="#000000"
                      />
                      <Element
                        is={SimpleText}
                        text="Drag components from the right toolbar to start building your page." 
                        fontSize="16px"
                        color="#666666"
                      />
                      <Element
                        is={SimpleText}
                        text="Tip: Click any element to edit properties, or drag to reorder elements." 
                        fontSize="14px"
                        fontWeight="600"
                        color="#888888"
                      />
                    </>
                  )}
                  {!showWelcome && children}
                  </Element>
                </Frame>
              </EditorErrorBoundary>
            </div>
          </div>
          
          {/* Toolbar - Only shown when enabled */}
          {showToolbar && enabled && <InlineToolbar />}
        </div>
      </Editor>
    </EditorErrorBoundary>
  )
}

