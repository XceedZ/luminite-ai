"use client"

import { useNode } from '@craftjs/core'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

export interface EditableTextProps {
  text?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  className?: string
}

export const EditableText = ({
  text = 'Click to edit text',
  fontSize = '16px',
  fontWeight = 'normal',
  color = '#000000',
  textAlign = 'left',
  className = '',
}: EditableTextProps) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }))

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Click to edit text...',
      }),
    ],
    content: text,
    editable: selected,
    onUpdate: ({ editor }) => {
      setProp((props: EditableTextProps) => {
        props.text = editor.getHTML()
      })
    },
  })

  // Update editor content when text prop changes
  useEffect(() => {
    if (editor && !selected) {
      editor.commands.setContent(text)
    }
  }, [text, editor, selected])

  // Enable/disable editing based on selection
  useEffect(() => {
    if (editor) {
      editor.setEditable(selected)
    }
  }, [selected, editor])

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`${className} ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} transition-all`}
      style={{
        fontSize,
        fontWeight,
        color,
        textAlign,
        cursor: selected ? 'text' : 'pointer',
        padding: '8px',
        minHeight: '32px',
      }}
    >
      <EditorContent editor={editor} />
    </div>
  )
}

EditableText.craft = {
  displayName: 'Text',
  props: {
    text: 'Click to edit text',
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#000000',
    textAlign: 'left',
  },
  related: {
    toolbar: () => <div>Text Settings</div>,
  },
}

