"use client"

import { useNode } from '@craftjs/core'
import { useState, useEffect } from 'react'

export interface SimpleTextProps {
  text?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  className?: string
}

export const SimpleText = ({
  text = 'Click to edit text',
  fontSize = '16px',
  fontWeight = 'normal',
  color = '#000000',
  textAlign = 'left',
  className = '',
}: SimpleTextProps) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }))

  const [editable, setEditable] = useState(false)
  const [editValue, setEditValue] = useState(text)

  useEffect(() => {
    if (!selected) {
      setEditable(false)
    }
  }, [selected])

  useEffect(() => {
    setEditValue(text)
  }, [text])

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      onClick={() => {
        if (selected) {
          setEditable(true)
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
      {editable ? (
        <input
          type="text"
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value)
          }}
          onBlur={() => {
            setProp((props: SimpleTextProps) => {
              props.text = editValue
            })
            setEditable(false)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setProp((props: SimpleTextProps) => {
                props.text = editValue
              })
              setEditable(false)
            }
          }}
          autoFocus
          className="w-full bg-transparent border-none outline-none"
          style={{ fontSize, fontWeight, color, textAlign }}
        />
      ) : (
        <span>{text}</span>
      )}
    </div>
  )
}

SimpleText.craft = {
  displayName: 'SimpleText',
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


