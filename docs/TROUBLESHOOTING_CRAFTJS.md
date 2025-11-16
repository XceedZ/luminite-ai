# 🔧 Troubleshooting: Craft.js Editor Issues

## Common Error: "Component type undefined does not exist in resolver"

### Quick Fix

1. **Clear Browser Cache & LocalStorage**
   ```javascript
   // Open browser console and run:
   localStorage.clear()
   location.reload()
   ```

2. **Hard Refresh**
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Firefox: `Ctrl+F5` or `Cmd+Shift+R`

3. **Check Console Logs**
   Look for these messages:
   ```
   [EditorCanvas] ✅ All components and craft configs loaded
   [EditorCanvas] Frame rendered successfully
   ```

---

## Root Causes & Solutions

### 1. Component Not Wrapped in `<Element>`

**Problem:**
```tsx
// ❌ BAD - Direct component usage
<EditableText text="Hello" />
```

**Solution:**
```tsx
// ✅ GOOD - Wrapped in Element
<Element is={EditableText} text="Hello" />
```

---

### 2. TipTap Conflict with Craft.js

**Problem:** TipTap creates complex DOM nodes that Craft.js doesn't recognize

**Solution:** Use SimpleText instead of EditableText for static content

```tsx
// For rich text editing
<Element is={EditableText} />

// For simple text (more stable)
<Element is={SimpleText} />
```

---

### 3. Corrupt LocalStorage State

**Problem:** Old/corrupt Craft.js state in localStorage

**Solution:** The editor now auto-clears on mount, but manual clear:

```javascript
// Clear specific keys
Object.keys(localStorage)
  .filter(key => key.includes('craftjs'))
  .forEach(key => localStorage.removeItem(key))
```

---

### 4. Dynamic Import Timing Issues

**Problem:** Components not loaded when Frame initializes

**Solution:** Already fixed with component verification:

```typescript
// Waits for all components to load
const componentsReady = 
  typeof EditableText !== 'undefined' &&
  SimpleText.craft &&
  // ... etc
```

---

## Component Compatibility Matrix

| Component | TipTap | Craft.js | Status | Notes |
|-----------|--------|----------|--------|-------|
| **SimpleText** | ❌ No | ✅ Yes | ✅ Stable | Simple input-based editing |
| **EditableText** | ✅ Yes | ✅ Yes | ⚠️ Complex | Rich text, may have conflicts |
| **EditableImage** | ❌ No | ✅ Yes | ✅ Stable | Image with URL editing |
| **EditableButton** | ❌ No | ✅ Yes | ✅ Stable | Button/link component |
| **EditableContainer** | ❌ No | ✅ Yes | ✅ Stable | Layout container |

---

## Debug Checklist

When you encounter errors:

- [ ] Check console for `[EditorCanvas]` logs
- [ ] Verify all components loaded successfully
- [ ] Check if using `<Element is={...}>` wrapper
- [ ] Clear localStorage and hard refresh
- [ ] Check network tab for failed imports
- [ ] Look for TipTap errors in console
- [ ] Verify resolver includes all components

---

## Error Messages & Meanings

### "Component type undefined"
**Meaning:** Craft.js trying to render a component that doesn't exist in resolver

**Fixes:**
1. Check component is imported
2. Check component has `.craft` property
3. Check component is in resolver object
4. Clear localStorage

### "Invariant failed"
**Meaning:** Craft.js internal validation failed

**Fixes:**
1. Ensure using `<Element>` wrapper
2. Check props are valid
3. Clear state and reload

### "TipTap transaction error"
**Meaning:** TipTap and Craft.js state conflict

**Fixes:**
1. Use SimpleText instead of EditableText
2. Reduce TipTap extensions
3. Disable TipTap collaboration features

---

## Performance Issues

### Editor Loads Slowly

**Causes:**
- Too many TipTap extensions
- Large localStorage state
- Network latency

**Solutions:**
```typescript
// Reduce TipTap extensions
const editor = useEditor({
  extensions: [
    StarterKit.configure({
      // Disable unused features
      history: false,
      collaboration: false,
    }),
  ],
})
```

### Memory Leaks

**Symptoms:**
- Browser becomes sluggish
- Editor freezes
- High memory usage

**Solutions:**
- Clear editor state regularly
- Limit number of nodes
- Use SimpleText for static content

---

## Best Practices

### ✅ DO:

1. **Always use Element wrapper**
   ```tsx
   <Element is={SimpleText} text="Hello" />
   ```

2. **Use SimpleText for static content**
   ```tsx
   <Element is={SimpleText} text="Welcome" />
   ```

3. **Add error boundaries**
   ```tsx
   <EditorErrorBoundary>
     <Editor>...</Editor>
   </EditorErrorBoundary>
   ```

4. **Clear state on errors**
   ```javascript
   localStorage.clear()
   ```

### ❌ DON'T:

1. **Don't use components directly**
   ```tsx
   <SimpleText /> // ❌
   ```

2. **Don't nest TipTap editors**
   ```tsx
   <EditableText>
     <EditableText /> {/* ❌ */}
   </EditableText>
   ```

3. **Don't mix resolver versions**
   ```tsx
   // ❌ Using old component versions
   resolver={{
     Text: OldTextComponent,
     SimpleText: NewSimpleText
   }}
   ```

---

## Recovery Procedures

### Complete Reset

If nothing works:

```javascript
// 1. Clear everything
localStorage.clear()
sessionStorage.clear()

// 2. Unregister service workers
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    registrations.forEach(r => r.unregister())
  })

// 3. Clear cache
caches.keys().then(names => {
  names.forEach(name => caches.delete(name))
})

// 4. Hard reload
location.reload(true)
```

### Debug Mode

Enable verbose logging:

```typescript
// In editor-canvas.tsx
console.log('[EditorCanvas] State:', query.serialize())
console.log('[EditorCanvas] Nodes:', query.getNodes())
console.log('[EditorCanvas] Resolver:', Object.keys(resolver))
```

---

## Known Issues

### Issue #1: TipTap HTML String Props

**Problem:** Passing HTML strings like `text="<h1>Hello</h1>"` causes parsing errors

**Status:** ✅ FIXED in latest version

**Solution:** Use plain text + styling props:
```tsx
<Element 
  is={SimpleText} 
  text="Hello" 
  fontSize="32px" 
  fontWeight="bold" 
/>
```

### Issue #2: Dynamic Import Race Condition

**Problem:** Components not ready when Frame initializes

**Status:** ✅ FIXED with verification check

**Solution:** Automatic - waits for components to load

### Issue #3: LocalStorage Corruption

**Problem:** Old state causes component resolution errors

**Status:** ✅ FIXED with auto-clear on mount

**Solution:** Automatic - clears on component mount

---

## Contact & Support

If issues persist after trying all solutions:

1. **Check Documentation:**
   - `/docs/VISUAL_EDITOR.md`
   - `/docs/BUGFIX_CRAFT_JS_ERROR.md`

2. **Review Logs:**
   - Browser console
   - Network tab
   - React DevTools

3. **Create Minimal Reproduction:**
   - Isolate the issue
   - Test with minimal components
   - Document steps to reproduce

---

## Version History

### v2.0 (Current) - Major Stability Update
- ✅ Added SimpleText component
- ✅ Automatic localStorage clearing
- ✅ Component verification before render
- ✅ Double error boundaries
- ✅ Force re-render with keys

### v1.0 - Initial Release
- ⚠️ TipTap conflicts
- ⚠️ LocalStorage issues
- ⚠️ Race conditions

---

**Last Updated:** 2025-11-16  
**Applies To:** Luminite AI v2.0+

