"use client"

import { useNode } from '@craftjs/core'
import { ReactNode } from 'react'

export interface EditableContainerProps {
  children?: ReactNode
  backgroundColor?: string
  padding?: string
  margin?: string
  flexDirection?: 'row' | 'column'
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between'
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
  gap?: string
  className?: string
}

export const EditableContainer = ({
  children,
  backgroundColor = 'transparent',
  padding = '16px',
  margin = '0px',
  flexDirection = 'column',
  justifyContent = 'flex-start',
  alignItems = 'flex-start',
  gap = '16px',
  className = '',
}: EditableContainerProps) => {
  const {
    connectors: { connect, drag },
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
      className={`${className} ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} transition-all`}
      style={{
        display: 'flex',
        flexDirection,
        justifyContent,
        alignItems,
        gap,
        backgroundColor,
        padding,
        margin,
        minHeight: '50px',
        position: 'relative',
      }}
    >
      {children}
      {selected && !children && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm pointer-events-none">
          Drop components here
        </div>
      )}
    </div>
  )
}

EditableContainer.craft = {
  displayName: 'Container',
  props: {
    backgroundColor: 'transparent',
    padding: '16px',
    margin: '0px',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: '16px',
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
  },
  related: {
    toolbar: () => <div>Container Settings</div>,
  },
}

