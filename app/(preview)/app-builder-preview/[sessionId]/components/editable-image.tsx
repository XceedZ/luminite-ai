"use client"

import { useNode } from '@craftjs/core'
import { useState } from 'react'
import Image from 'next/image'

export interface EditableImageProps {
  src?: string
  alt?: string
  width?: number
  height?: number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none'
  className?: string
}

export const EditableImage = ({
  src = 'https://via.placeholder.com/400x300',
  alt = 'Image',
  width = 400,
  height = 300,
  objectFit = 'cover',
  className = '',
}: EditableImageProps) => {
  const {
    connectors: { connect, drag },
    actions: { setProp },
    selected,
  } = useNode((node) => ({
    selected: node.events.selected,
  }))

  const [isEditing, setIsEditing] = useState(false)
  const [tempSrc, setTempSrc] = useState(src)

  const handleImageChange = () => {
    setProp((props: EditableImageProps) => {
      props.src = tempSrc
    })
    setIsEditing(false)
  }

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connect(drag(ref))
        }
      }}
      className={`relative ${className} ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''} transition-all`}
      style={{ width: '100%', maxWidth: width }}
    >
      {isEditing && selected ? (
        <div className="p-4 bg-white border rounded">
          <input
            type="text"
            value={tempSrc}
            onChange={(e) => setTempSrc(e.target.value)}
            className="w-full px-3 py-2 border rounded mb-2"
            placeholder="Enter image URL"
          />
          <div className="flex gap-2">
            <button
              onClick={handleImageChange}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={() => {
                setTempSrc(src)
                setIsEditing(false)
              }}
              className="px-3 py-1 bg-gray-200 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            style={{ objectFit, width: '100%', height: 'auto' }}
            className="rounded"
          />
          {selected && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-2 right-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
            >
              Change Image
            </button>
          )}
        </div>
      )}
    </div>
  )
}

EditableImage.craft = {
  displayName: 'Image',
  props: {
    src: 'https://via.placeholder.com/400x300',
    alt: 'Image',
    width: 400,
    height: 300,
    objectFit: 'cover',
  },
  related: {
    toolbar: () => <div>Image Settings</div>,
  },
}

