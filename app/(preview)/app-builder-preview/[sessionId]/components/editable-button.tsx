"use client"

import { useNode } from '@craftjs/core'

export interface EditableButtonProps {
  text?: string
  backgroundColor?: string
  textColor?: string
  padding?: string
  borderRadius?: string
  fontSize?: string
  href?: string
  className?: string
}

export const EditableButton = ({
  text = 'Button',
  backgroundColor = '#3b82f6',
  textColor = '#ffffff',
  padding = '12px 24px',
  borderRadius = '8px',
  fontSize = '16px',
  href = '#',
  className = '',
}: EditableButtonProps) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }))

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`inline-block ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} transition-all`}
    >
      {selected ? (
        <div className="space-y-2 p-2 bg-white border rounded">
          <input
            type="text"
            value={text}
            onChange={(e) =>
              setProp((props: EditableButtonProps) => {
                props.text = e.target.value
              })
            }
            className="w-full px-2 py-1 border rounded text-sm"
            placeholder="Button text"
          />
          <input
            type="text"
            value={href}
            onChange={(e) =>
              setProp((props: EditableButtonProps) => {
                props.href = e.target.value
              })
            }
            className="w-full px-2 py-1 border rounded text-sm"
            placeholder="Link URL"
          />
          <div className="flex gap-2">
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) =>
                setProp((props: EditableButtonProps) => {
                  props.backgroundColor = e.target.value
                })
              }
              className="h-8 w-16"
              title="Background color"
            />
            <input
              type="color"
              value={textColor}
              onChange={(e) =>
                setProp((props: EditableButtonProps) => {
                  props.textColor = e.target.value
                })
              }
              className="h-8 w-16"
              title="Text color"
            />
          </div>
        </div>
      ) : (
        <a
          href={href}
          className={className}
          style={{
            display: 'inline-block',
            backgroundColor,
            color: textColor,
            padding,
            borderRadius,
            fontSize,
            textDecoration: 'none',
            cursor: 'pointer',
            fontWeight: '500',
          }}
          onClick={(e) => selected && e.preventDefault()}
        >
          {text}
        </a>
      )}
    </div>
  )
}

EditableButton.craft = {
  displayName: 'Button',
  props: {
    text: 'Button',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    href: '#',
  },
  related: {
    toolbar: () => <div>Button Settings</div>,
  },
}

