# Visual Editor Documentation

## Overview
Visual editor untuk Luminite AI menggunakan **Craft.js** dan **TipTap** untuk memberikan pengalaman editing WYSIWYG (What You See Is What You Get) yang powerful.

## Features

### 1. **Edit Mode Toggle**
- **Preview Mode**: Menampilkan hasil akhir tanpa kemampuan edit
- **Edit Mode**: Mengaktifkan editing interaktif untuk semua elemen

### 2. **Editable Components**
#### Text Component
- Click untuk edit langsung
- Rich text editing dengan TipTap
- Support HTML formatting (bold, italic, headings, etc)
- Customizable font size, weight, color, dan alignment

#### Image Component
- Click "Change Image" untuk ganti URL
- Responsive sizing
- Object-fit customization
- Alt text support

#### Button Component
- Edit text langsung
- Customizable background & text color
- Adjustable padding & border radius
- Link URL configuration

#### Container Component
- Drag & drop layout
- Flexbox configuration (direction, justify, align)
- Background color & spacing
- Nested containers support

### 3. **Toolbar**
Component toolbar di sisi kiri dengan drag & drop support:
- Text
- Image  
- Button
- Container

### 4. **Header Controls**
- **Back Button**: Kembali ke app builder
- **Preview/Edit Toggle**: Switch antara mode preview dan edit
- **Save Button**: Save perubahan ke database
- **Share Button**: Copy share link ke clipboard

## How to Use

### Basic Editing Flow

1. **Buka Preview Page**
   ```
   /app-builder-preview/[sessionId]
   ```

2. **Klik "Edit" Button**
   - Toolbar akan muncul di kiri
   - Semua elemen menjadi selectable

3. **Edit Elements**
   - **Text**: Klik langsung pada text untuk edit
   - **Image**: Klik elemen, lalu klik "Change Image"
   - **Button**: Klik untuk edit text, color, dan link
   - **Container**: Klik untuk adjust layout

4. **Add New Components**
   - Drag component dari toolbar ke canvas
   - Drop ke dalam container

5. **Save Changes**
   - Klik "Save Changes" di header
   - State akan disimpan ke Upstash

6. **Preview Result**
   - Klik "Preview" untuk lihat hasil final

## Technical Implementation

### Dependencies
```json
{
  "@craftjs/core": "^0.2.12",
  "@tiptap/react": "^3.10.7",
  "@tiptap/starter-kit": "^3.10.7",
  "@tiptap/extension-placeholder": "^3.10.7"
}
```

### File Structure
```
app/(preview)/app-builder-preview/[sessionId]/
├── page.tsx                          # Main route (server component)
├── preview-with-editor.tsx           # Client component wrapper
└── components/
    ├── editable-text.tsx             # Text component with TipTap
    ├── editable-image.tsx            # Image component
    ├── editable-button.tsx           # Button component
    ├── editable-container.tsx        # Container/layout component
    ├── editor-canvas.tsx             # Craft.js Editor wrapper
    ├── editor-toolbar.tsx            # Component toolbar
    └── editor-header.tsx             # Header with controls
```

### Component Architecture

#### Craft.js Integration
```typescript
import { Editor, Frame, Element, useNode } from '@craftjs/core'

// Each editable component uses useNode hook
const { connectors, actions, selected } = useNode()

// Components register with Craft.js resolver
<Editor resolver={{ EditableText, EditableImage, ... }}>
  <Frame>
    {/* Canvas content */}
  </Frame>
</Editor>
```

#### TipTap Integration (for Text)
```typescript
import { useEditor, EditorContent } from '@tiptap/react'

const editor = useEditor({
  extensions: [StarterKit, Placeholder],
  content: text,
  editable: selected,
  onUpdate: ({ editor }) => {
    // Update Craft.js props
    setProp(props => props.text = editor.getHTML())
  }
})
```

## API Reference

### EditorCanvas Props
```typescript
interface EditorCanvasProps {
  children?: ReactNode
  enabled: boolean                    // Edit mode enabled
  onStateChange?: (state: string) => void  // Called on any change
}
```

### EditorHeader Props
```typescript
interface EditorHeaderProps {
  sessionId: string
  editMode: boolean
  onEditModeChange: (enabled: boolean) => void
  onSave?: () => void
}
```

### EditableText Props
```typescript
interface EditableTextProps {
  text?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  className?: string
}
```

### EditableImage Props
```typescript
interface EditableImageProps {
  src?: string
  alt?: string
  width?: number
  height?: number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none'
  className?: string
}
```

### EditableButton Props
```typescript
interface EditableButtonProps {
  text?: string
  backgroundColor?: string
  textColor?: string
  padding?: string
  borderRadius?: string
  fontSize?: string
  href?: string
  className?: string
}
```

### EditableContainer Props
```typescript
interface EditableContainerProps {
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
```

## Customization

### Adding New Components

1. **Create Component File**
```typescript
// components/editable-custom.tsx
"use client"

import { useNode } from '@craftjs/core'

export const EditableCustom = (props) => {
  const { connectors, actions, selected } = useNode()
  
  return (
    <div ref={ref => ref && connectors.connect(connectors.drag(ref))}>
      {/* Your component */}
    </div>
  )
}

EditableCustom.craft = {
  displayName: 'Custom',
  props: { /* default props */ }
}
```

2. **Register in Resolver**
```typescript
// editor-canvas.tsx
<Editor resolver={{
  EditableText,
  EditableImage,
  EditableButton,
  EditableContainer,
  EditableCustom  // Add here
}}>
```

3. **Add to Toolbar**
```typescript
// editor-toolbar.tsx
<button ref={ref => ref && connectors.create(ref, <EditableCustom />)}>
  Custom Component
</button>
```

### Styling Components

Use Tailwind classes or custom CSS:
```typescript
<div className="hover:bg-blue-50 transition-all">
  {/* Content */}
</div>
```

Or inline styles for dynamic values:
```typescript
<div style={{
  backgroundColor: props.backgroundColor,
  padding: props.padding
}}>
```

## Best Practices

1. **Always use `ref` with connectors**
   ```typescript
   ref={ref => ref && connect(drag(ref))}
   ```

2. **Update props through `setProp`**
   ```typescript
   setProp(props => {
     props.text = newValue
   })
   ```

3. **Show edit UI only when `selected`**
   ```typescript
   {selected ? <EditUI /> : <DisplayUI />}
   ```

4. **Use visual feedback for selection**
   ```typescript
   className={`${selected ? 'ring-2 ring-blue-500' : ''}`}
   ```

5. **Handle state carefully**
   - Use `onStateChange` to track changes
   - Debounce auto-save to avoid too many requests
   - Always validate before saving

## Troubleshooting

### Component not draggable
- Ensure `connect` and `drag` are properly chained
- Check if component is registered in resolver

### Text editing not working
- Verify TipTap editor is receiving correct `editable` prop
- Check if `selected` state is updating

### Changes not saving
- Implement `onStateChange` handler
- Check `saveCodeToUpstash` is being called
- Verify sessionId is correct

### Styling issues
- Import `preview-globals.css` in layout
- Check Tailwind classes are compiled
- Verify inline styles are not overridden

## Future Enhancements

- [ ] Undo/Redo functionality
- [ ] Component duplication
- [ ] Advanced styling panel
- [ ] Responsive breakpoint editor
- [ ] Component library/templates
- [ ] Export to various formats
- [ ] Collaborative editing
- [ ] Version history

## Resources

- [Craft.js Documentation](https://craft.js.org/)
- [TipTap Documentation](https://tiptap.dev/)
- [React DnD](https://react-dnd.github.io/react-dnd/)

