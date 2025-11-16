"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface EditorHeaderProps {
  sessionId: string
  editMode: boolean
  onEditModeChange: (enabled: boolean) => void
  onSave?: () => void
}

export const EditorHeader = ({ sessionId, editMode, onEditModeChange, onSave }: EditorHeaderProps) => {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (onSave) {
      setIsSaving(true)
      await onSave()
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b shadow-sm z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left - Logo/Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/playground/app-builder')}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">App Builder</h1>
            <p className="text-xs text-gray-500">Session: {sessionId.slice(0, 8)}...</p>
          </div>
        </div>

        {/* Center - Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onEditModeChange(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              !editMode
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </div>
          </button>
          <button
            onClick={() => onEditModeChange(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              editMode
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </div>
          </button>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-3">
          {editMode && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          )}
          <button
            onClick={() => {
              const url = `${window.location.origin}/playground/app-builder/share/${sessionId}`
              navigator.clipboard.writeText(url)
              alert('Share link copied!')
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
          >
            Share
          </button>
        </div>
      </div>
    </div>
  )
}

