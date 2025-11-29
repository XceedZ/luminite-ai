# Custom Toast Component

Custom toast notification component dengan support untuk 2 tema (light/dark) dan 2 mode (expandable/non-expandable).

## Fitur

- ✅ 2 Tema: Light dan Dark
- ✅ 2 Mode: Expandable dan Non-expandable
- ✅ 4 Tipe: Success, Error, Warning, Info
- ✅ Auto-close dengan countdown timer
- ✅ Progress bar visual
- ✅ Stop countdown functionality
- ✅ Customizable duration
- ✅ Multiple positions

## Instalasi

Component sudah tersedia di `components/ui/custom-toast.tsx`. Pastikan untuk wrap aplikasi dengan `ToastProvider`.

## Setup

### 1. Tambahkan ToastProvider ke Layout

```tsx
// app/layout.tsx
import { ToastProvider } from '@/components/ui/toast-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider position="top-right">
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
```

### 2. Gunakan di Komponen

```tsx
"use client";

import { useToastContext } from '@/components/ui/toast-provider';

export function MyComponent() {
  const { success, error, warning, info } = useToastContext();

  const handleSave = () => {
    success("Changes saved", {
      description: "Your changes have been saved successfully",
      expandable: true,
      duration: 13,
      theme: "light"
    });
  };

  return <button onClick={handleSave}>Save</button>;
}
```

## API Reference

### useToastContext()

Hook untuk mengakses toast functions.

```tsx
const {
  success,    // (message, options?) => string
  error,      // (message, options?) => string
  warning,    // (message, options?) => string
  info,       // (message, options?) => string
  showToast,  // (props) => string
  removeToast, // (id) => void
  clear,      // () => void
  toasts      // Toast[]
} = useToastContext();
```

### Toast Options

```tsx
interface CustomToastProps {
  message: string;              // Required: Main message
  description?: string;         // Optional: Additional description
  type?: "success" | "error" | "warning" | "info"; // Default: "success"
  theme?: "light" | "dark";     // Default: "light"
  expandable?: boolean;         // Default: false
  duration?: number;            // Seconds, 0 = no auto close, Default: 5
  position?: ToastPosition;     // Default: "top-right"
  onClose?: () => void;         // Callback when toast closes
  onStopCountdown?: () => void; // Callback when countdown stops
  className?: string;           // Additional CSS classes
}
```

## Contoh Penggunaan

### Success Toast (Expandable, Light Theme)

```tsx
success("Changes saved", {
  description: "Your changes have been saved successfully",
  expandable: true,
  duration: 13,
  theme: "light",
  onStopCountdown: () => {
    console.log("Countdown stopped");
  }
});
```

### Error Toast (Non-expandable, Dark Theme)

```tsx
error("Failed to save", {
  expandable: false,
  duration: 5,
  theme: "dark",
  description: "Please try again later"
});
```

### Warning Toast dengan Custom Callback

```tsx
warning("Warning message", {
  expandable: true,
  duration: 8,
  theme: "light",
  description: "This action cannot be undone",
  onClose: () => {
    console.log("Toast closed");
  }
});
```

### Info Toast tanpa Auto-close

```tsx
info("Information", {
  expandable: false,
  duration: 0, // No auto close
  theme: "dark",
  description: "New features are available"
});
```

## Toast Types

### Success
- Icon: Green checkmark circle
- Use case: Success operations, saved changes

### Error
- Icon: Red alert circle
- Use case: Failed operations, errors

### Warning
- Icon: Yellow alert triangle
- Use case: Warnings, important notices

### Info
- Icon: Blue info circle
- Use case: General information, updates

## Themes

### Light Theme
- Background: White
- Text: Dark gray
- Shadow: Subtle gray shadow

### Dark Theme
- Background: Dark gray (gray-900)
- Text: Light gray
- Border: Gray-800 border

## Expandable Mode

Ketika `expandable: true`:
- Menampilkan chevron button untuk expand/collapse
- Saat expanded, menampilkan:
  - Progress bar (jika duration > 0)
  - Description text
  - Countdown timer dengan "Click to stop" button

Ketika `expandable: false`:
- Tidak ada chevron button
- Description langsung ditampilkan (jika ada)
- Tidak ada countdown timer

## Positions

```tsx
type ToastPosition = 
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"
```

Set position di `ToastProvider`:

```tsx
<ToastProvider position="bottom-right">
  {children}
</ToastProvider>
```

## Advanced Usage

### Manual Toast Control

```tsx
const { showToast, removeToast } = useToastContext();

// Show custom toast
const toastId = showToast({
  message: "Custom message",
  type: "info",
  theme: "dark",
  expandable: true,
  duration: 10
});

// Remove specific toast
removeToast(toastId);

// Clear all toasts
clear();
```

### Multiple Toasts

```tsx
const { success, error } = useToastContext();

// Show multiple toasts
success("First message");
setTimeout(() => {
  error("Second message");
}, 1000);
```

## Styling

Component menggunakan Tailwind CSS dan mengikuti design system aplikasi. Untuk custom styling, gunakan `className` prop:

```tsx
success("Message", {
  className: "custom-class",
  // ...
});
```

## Best Practices

1. **Gunakan duration yang sesuai**: 3-5 detik untuk simple notifications, 10-15 detik untuk important messages
2. **Gunakan expandable untuk informasi penting**: Biarkan user baca detail jika diperlukan
3. **Pilih theme sesuai context**: Light untuk light mode, dark untuk dark mode
4. **Gunakan type yang tepat**: Success untuk success, error untuk errors, dll
5. **Jangan spam toasts**: Batasi jumlah toast yang muncul bersamaan

## Troubleshooting

### Toast tidak muncul
- Pastikan `ToastProvider` sudah di-wrap di root layout
- Cek console untuk errors

### Countdown tidak berfungsi
- Pastikan `duration > 0`
- Cek apakah `onStopCountdown` tidak menginterfere

### Theme tidak sesuai
- Pastikan `theme` prop sesuai dengan kebutuhan
- Cek apakah ada CSS override
