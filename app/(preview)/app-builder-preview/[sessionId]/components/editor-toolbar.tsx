"use client"

import { useEditor } from '@craftjs/core'
import { EditableText } from './editable-text'
import { EditableImage } from './editable-image'
import { EditableButton } from './editable-button'
import { EditableContainer } from './editable-container'

export const EditorToolbar = () => {
  const { connectors } = useEditor()

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r shadow-sm overflow-y-auto z-40">
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Components</h3>
        <div className="space-y-2">
          <button
            ref={(ref) => {
              if (ref) {
                connectors.create(ref, <EditableText />)
              }
            }}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left text-sm font-medium"
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
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left text-sm font-medium"
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
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left text-sm font-medium"
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
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left text-sm font-medium"
          >
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
              Container
            </div>
          </button>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold text-sm text-gray-700 mb-3">Instructions</h3>
          <div className="text-xs text-gray-600 space-y-2">
            <p>• Drag components from the toolbar</p>
            <p>• Click to select and edit</p>
            <p>• Drag to reorder elements</p>
            <p>• Drop into containers</p>
          </div>
        </div>
      </div>
    </div>
  )
}

