"use server"

/**
 * Security: Validate component code before execution
 * Only allow safe React component patterns
 */
function validateComponentCode(code: string): { valid: boolean; error?: string } {
  // Block dangerous patterns
  const dangerousPatterns = [
    /eval\s*\(/i,
    /Function\s*\(/i,
    /new\s+Function/i,
    /document\.(write|writeln)/i,
    /window\.(location|open)/i,
    /XMLHttpRequest/i,
    /import\s+\(/i, // Dynamic imports
    /require\s*\(/i,
  ]

  for (const pattern of dangerousPatterns) {
    if (pattern.test(code)) {
      return {
        valid: false,
        error: `Code contains potentially unsafe pattern: ${pattern.source}`
      }
    }
  }

  // Must contain React component structure
  if (!code.includes('export default') && !code.includes('export function')) {
    return {
      valid: false,
      error: 'Code must export a React component'
    }
  }

  return { valid: true }
}

/**
 * Render React component code to HTML string
 * This function safely converts TSX/JSX code to HTML for iframe rendering
 * Uses Babel standalone to transpile JSX in the browser
 */
export async function renderReactComponent(componentCode: string): Promise<string> {
  try {
    // Validate code security
    const validation = validateComponentCode(componentCode)
    if (!validation.valid) {
      throw new Error(validation.error || 'Code validation failed')
    }

    // Extract component code (remove "use client" directive)
    const componentBody = componentCode
      .replace(/^"use client"\s*/m, '')
      .replace(/^'use client'\s*/m, '')
      .trim()

    // For iframe rendering, we'll use Babel standalone to transpile JSX in browser
    // This is safer than server-side eval and works well for preview purposes
    // Remove ALL import/export statements and convert to window assignments
    // Babel standalone doesn't handle ES6 modules well in non-module context
    let processedCode = componentBody
      // Remove all import statements - be very aggressive
      // Pattern 1: import { ... } from "..."
      .replace(/import\s*\{[^}]*\}\s*from\s*["'][^"']*["'];?\s*/g, '')
      // Pattern 2: import * as ... from "..."
      .replace(/import\s*\*\s*as\s+\w+\s*from\s*["'][^"']*["'];?\s*/g, '')
      // Pattern 3: import ... from "..."
      .replace(/import\s+\w+\s+from\s*["'][^"']*["'];?\s*/g, '')
      // Pattern 4: import "..." (side-effect imports)
      .replace(/import\s*["'][^"']*["'];?\s*/g, '')
      // Pattern 5: import type ... (TypeScript type imports)
      .replace(/import\s+type\s+.*?from\s*["'][^"']*["'];?\s*/g, '')
      // Pattern 6: Any remaining import lines (catch-all)
      .replace(/^[\s]*import\s+.*$/gm, '')
      .trim()
    
    // Clean up any empty lines left by removed imports
    processedCode = processedCode
      .split('\n')
      .filter(line => line.trim() !== '' && !line.trim().startsWith('import'))
      .join('\n')
    
    // Extract component name BEFORE removing exports (so we can find export default)
    let componentName = null;
    
    // Pattern 1: export default function ComponentName() { ... }
    const defaultFunctionMatch = componentBody.match(/export\s+default\s+function\s+(\w+)\s*\(/);
    if (defaultFunctionMatch) {
      componentName = defaultFunctionMatch[1];
      console.log('[react-to-html] Found component name (export default function):', componentName);
    }
    
    // Pattern 2: export default const ComponentName = () => { ... }
    if (!componentName) {
      const defaultConstMatch = componentBody.match(/export\s+default\s+(?:const|let|var)\s+(\w+)\s*=/);
      if (defaultConstMatch) {
        componentName = defaultConstMatch[1];
        console.log('[react-to-html] Found component name (export default const):', componentName);
      }
    }
    
    // Pattern 3: function ComponentName() { ... } (no export, but might be the main component)
    if (!componentName) {
      // Look for function declarations that might be the component
      // Escape special characters properly
      const functionMatch = componentBody.match(/function\s+(\w+)\s*\([^)]*\)\s*\{/);
      if (functionMatch) {
        componentName = functionMatch[1];
        console.log('[react-to-html] Found component name (function declaration):', componentName);
      }
    }
    
    // Pattern 4: const ComponentName = () => { ... } (no export)
    if (!componentName) {
      // Simplified pattern to avoid regex issues
      const constMatch = componentBody.match(/(?:const|let|var)\s+(\w+)\s*=\s*(?:\(|function)/);
      if (constMatch) {
        componentName = constMatch[1];
        console.log('[react-to-html] Found component name (const arrow function):', componentName);
      }
    }
    
    // Remove ALL export statements first
    processedCode = processedCode
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+function\s+/g, 'function ')
      .replace(/export\s+const\s+/g, 'const ')
      .replace(/export\s+let\s+/g, 'let ')
      .replace(/export\s+var\s+/g, 'var ')
      .replace(/export\s+class\s+/g, 'class ')
      .replace(/export\s+type\s+.*$/gm, '')
      .replace(/export\s+interface\s+.*$/gm, '')
      .replace(/export\s+enum\s+.*$/gm, '')
      .replace(/^export\s+.*$/gm, '')
      .replace(/export\s*\{[^}]*\}\s*;?\s*/g, '')
      .replace(/export\s*\*\s*from\s*["'][^"']*["'];?\s*/g, '')
    
    // Add window assignment at the end if we found a component name
    // This must be outside IIFE to be accessible
    if (componentName) {
      // Don't wrap in IIFE if we have a component name - we need it globally accessible
      // Instead, just add window assignment after the component definition
      processedCode += `\n\n// Make component available globally\nif (typeof ${componentName} !== 'undefined') {\n  window.${componentName} = ${componentName};\n  console.log('[react-to-html] Assigned component to window:', '${componentName}', typeof window.${componentName});\n} else {\n  console.warn('[react-to-html] Component ${componentName} is undefined, cannot assign to window');\n}`;
    }
    
    // Remove icon declarations that conflict with pre-defined icons
    // These icons are already available globally - AI should not declare them
    const iconNames = [
      // Arrow & Navigation
      'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 
      'ChevronRight', 'ChevronLeft', 'ChevronUp', 'ChevronDown',
      // Common UI
      'Search', 'Menu', 'X', 'Check', 'Star', 'Heart', 'ShoppingCart', 
      'User', 'Mail', 'Phone', 'MapPin', 'Calendar', 'Clock', 
      'Plus', 'Minus', 'Copy', 'Download', 'Share', 'Edit', 'Trash', 'Eye', 'Globe',
      // Business & Finance
      'DollarSign', 'CreditCard', 'TrendingUp', 'TrendingDown', 'BarChart2', 'Activity', 'Briefcase',
      // Navigation & UI
      'Home', 'Settings', 'Bell', 'LogOut', 'MoreVertical', 'MoreHorizontal', 'ExternalLink', 'Link',
      // E-commerce & Shopping
      'Package', 'ShoppingBag', 'Tag', 'Truck', 'Gift', 'Utensils', 'Wine',
      // Social Media
      'Facebook', 'Twitter', 'Instagram', 'Linkedin', 'Youtube', 'Github',
      // File & Document
      'FileText', 'File', 'Folder', 'Upload', 'ImageIcon',
      // Media & Playback
      'Play', 'Pause', 'Video', 'Camera', 'Music',
      // Miscellaneous
      'Users', 'Award', 'Zap', 'Shield', 'Lock', 'Unlock', 
      'AlertCircle', 'CheckCircle', 'XCircle', 'Filter', 'Loader',
      // Additional Template Icons
      'Sparkles', 'Code', 'Palette', 'Layout', 'ChefHat', 'Coffee',
      'MessageCircle', 'Share2', 'Bookmark', 'SlidersHorizontal'
    ];
    
    iconNames.forEach(iconName => {
      // Remove const/let/var declarations of icons (e.g., "const Search = ...", "let Search = ...", "var Search = ...")
      // Match patterns like:
      // - const Search = () => <span>...</span>;
      // - const Search = () => { return ... };
      // - let Search = ...
      // - var Search = ...
      // - function Search() { ... }
      const patterns = [
        // Arrow function: const Search = () => ...
        new RegExp(`(const|let|var)\\s+${iconName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*[^;\\n]+[;\\n]?`, 'g'),
        // Regular function: const Search = function() { ... }
        new RegExp(`(const|let|var)\\s+${iconName}\\s*=\\s*function[^;\\n]+[;\\n]?`, 'g'),
        // Function declaration: function Search() { ... }
        new RegExp(`function\\s+${iconName}\\s*\\([^)]*\\)\\s*\\{[^}]*\\}`, 'g'),
        // Simple assignment: const Search = <span>...</span>;
        new RegExp(`(const|let|var)\\s+${iconName}\\s*=\\s*[^;\\n]+[;\\n]?`, 'g'),
      ];
      
      patterns.forEach(pattern => {
        processedCode = processedCode.replace(pattern, `// ${iconName} is already available globally - removed duplicate declaration\n`);
      });
    });
    
    // Final aggressive cleanup - remove any remaining export/import statements
    processedCode = processedCode
      .split('\n')
      .filter(line => {
        const trimmed = line.trim();
        return !trimmed.startsWith('import ') && 
               !trimmed.startsWith('export ') &&
               !trimmed.match(/^import\s+/) &&
               !trimmed.match(/^export\s+/);
      })
      .join('\n')
    
    // One more pass to catch any remaining exports/imports
    if (processedCode.includes('export ') || processedCode.includes('import ')) {
      processedCode = processedCode
        .replace(/^.*export\s+.*$/gm, '')
        .replace(/^.*import\s+.*$/gm, '')
    }
    
    // Final validation - throw error if export/import still exists
    // This helps catch issues early
    const hasExport = /export\s+/.test(processedCode);
    const hasImport = /import\s+/.test(processedCode);
    if (hasExport || hasImport) {
      console.warn('Warning: Export/import statements may still exist in processed code');
      // Last resort: remove everything that looks like export/import
      processedCode = processedCode
        .split('\n')
        .map(line => {
          if (/^\s*export\s+/.test(line) || /^\s*import\s+/.test(line)) {
            return '// Removed: ' + line.trim();
          }
          return line;
        })
        .join('\n');
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Preview</title>
  <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.tailwindcss.com?v=3.4.1"></script>
  <script>
    // Configure Tailwind IMMEDIATELY before it initializes
    window.tailwind = window.tailwind || {};
    window.tailwind.config = {
      // Force Tailwind to scan ALL content
      content: [''],
      // Add all CSS variable colors to ensure they work
      theme: {
        extend: {
          colors: {
            border: 'var(--border)',
            input: 'var(--input)',
            ring: 'var(--ring)',
            background: 'var(--background)',
            foreground: 'var(--foreground)',
            primary: {
              DEFAULT: 'var(--primary)',
              foreground: 'var(--primary-foreground)',
            },
            secondary: {
              DEFAULT: 'var(--secondary)',
              foreground: 'var(--secondary-foreground)',
            },
            destructive: {
              DEFAULT: 'var(--destructive)',
              foreground: 'var(--destructive-foreground)',
            },
            muted: {
              DEFAULT: 'var(--muted)',
              foreground: 'var(--muted-foreground)',
            },
            accent: {
              DEFAULT: 'var(--accent)',
              foreground: 'var(--accent-foreground)',
            },
            popover: {
              DEFAULT: 'var(--popover)',
              foreground: 'var(--popover-foreground)',
            },
            card: {
              DEFAULT: 'var(--card)',
              foreground: 'var(--card-foreground)',
            },
          },
        },
      },
    };
    console.log('[react-to-html] Tailwind config set BEFORE load');
  </script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    /* Shadcn UI base styles and CSS variables - matching main app */
    :root {
      --radius: 0.625rem;
      --background: oklch(1 0 0);
      --foreground: oklch(0.141 0.005 285.823);
      --card: oklch(1 0 0);
      --card-foreground: oklch(0.141 0.005 285.823);
      --popover: oklch(1 0 0);
      --popover-foreground: oklch(0.141 0.005 285.823);
      --primary: oklch(0.21 0.006 285.885);
      --primary-foreground: oklch(0.985 0 0);
      --secondary: oklch(0.967 0.001 286.375);
      --secondary-foreground: oklch(0.21 0.006 285.885);
      --muted: oklch(0.967 0.001 286.375);
      --muted-foreground: oklch(0.552 0.016 285.938);
      --accent: oklch(0.967 0.001 286.375);
      --accent-foreground: oklch(0.21 0.006 285.885);
      --destructive: oklch(0.577 0.245 27.325);
      --destructive-foreground: oklch(0.985 0 0);
      --border: oklch(0.92 0.004 286.32);
      --input: oklch(0.92 0.004 286.32);
      --ring: oklch(0.705 0.015 286.067);
    }
    
    .dark {
      --background: oklch(0.141 0.005 285.823);
      --foreground: oklch(0.985 0 0);
      --card: oklch(0.21 0.006 285.885);
      --card-foreground: oklch(0.985 0 0);
      --popover: oklch(0.21 0.006 285.885);
      --popover-foreground: oklch(0.985 0 0);
      --primary: oklch(0.92 0.004 286.32);
      --primary-foreground: oklch(0.21 0.006 285.885);
      --secondary: oklch(0.274 0.006 286.033);
      --secondary-foreground: oklch(0.985 0 0);
      --muted: oklch(0.274 0.006 286.033);
      --muted-foreground: oklch(0.705 0.015 286.067);
      --accent: oklch(0.274 0.006 286.033);
      --accent-foreground: oklch(0.985 0 0);
      --destructive: oklch(0.704 0.191 22.216);
      --destructive-foreground: oklch(0.985 0 0);
      --border: oklch(1 0 0 / 10%);
      --input: oklch(1 0 0 / 15%);
      --ring: oklch(0.552 0.016 285.938);
    }
    
    * {
      border-color: var(--border);
      box-sizing: border-box;
    }
    
    html {
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: var(--background);
      color: var(--foreground);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.5;
      min-height: 100vh;
      width: 100%;
      overflow-x: hidden;
      /* Force visibility */
      opacity: 1 !important;
      visibility: visible !important;
      display: block !important;
    }
    
    #root {
      width: 100%;
      min-height: 100vh;
      display: block !important;
      /* Force visibility */
      opacity: 1 !important;
      visibility: visible !important;
      position: relative;
    }
    
    /* Force show all children */
    #root > * {
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    /* Utility classes fallback - ensure core Tailwind utilities work */
    .bg-background { background-color: var(--background) !important; }
    .bg-card { background-color: var(--card) !important; }
    .bg-primary { background-color: var(--primary) !important; color: var(--primary-foreground) !important; }
    .bg-secondary { background-color: var(--secondary) !important; color: var(--secondary-foreground) !important; }
    .bg-muted { background-color: var(--muted) !important; color: var(--muted-foreground) !important; }
    .bg-destructive { background-color: var(--destructive) !important; color: var(--destructive-foreground) !important; }
    
    .text-foreground { color: var(--foreground) !important; }
    .text-card-foreground { color: var(--card-foreground) !important; }
    .text-primary { color: var(--primary) !important; }
    .text-primary-foreground { color: var(--primary-foreground) !important; }
    .text-secondary-foreground { color: var(--secondary-foreground) !important; }
    .text-muted-foreground { color: var(--muted-foreground) !important; }
    .text-destructive-foreground { color: var(--destructive-foreground) !important; }
    
    .border-border { border-color: var(--border) !important; }
    .border-input { border-color: var(--input) !important; }
    
    /* Basic Shadcn UI component styles */
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: calc(var(--radius) - 2px);
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s;
      cursor: pointer;
      border: 1px solid transparent;
    }
    
    .bg-background { background-color: var(--background); }
    .bg-card { background-color: var(--card); }
    .bg-primary { background-color: var(--primary); color: var(--primary-foreground); }
    .bg-secondary { background-color: var(--secondary); color: var(--secondary-foreground); }
    .bg-muted { background-color: var(--muted); color: var(--muted-foreground); }
    .bg-destructive { background-color: var(--destructive); color: var(--destructive-foreground); }
    
    .text-foreground { color: var(--foreground); }
    .text-card-foreground { color: var(--card-foreground); }
    .text-primary-foreground { color: var(--primary-foreground); }
    .text-secondary-foreground { color: var(--secondary-foreground); }
    .text-muted-foreground { color: var(--muted-foreground); }
    .text-destructive-foreground { color: var(--destructive-foreground); }
    
    .border-border { border-color: var(--border); }
    .border-input { border-color: var(--input); }
    
    /* Card styles */
    .card {
      border-radius: calc(var(--radius) - 2px);
      border: 1px solid var(--border);
      background-color: var(--card);
      color: var(--card-foreground);
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    // Default to light mode - do not sync with parent to avoid unwanted dark mode
    // Component should control its own theme independently
    (function() {
      // Explicitly remove dark class if present
      document.documentElement.classList.remove('dark');
      console.log('[react-to-html] Preview initialized with light mode (default)');
    })();
  </script>
  <script type="text/babel" data-presets="react,typescript">
    const { useState, useEffect, useRef } = React;
    
    // Prevent redeclaration errors by checking if icons already exist
    const iconExists = (name) => typeof window[name] !== 'undefined';
    
    // Create stub components to replace Shadcn UI components
    // These match the actual Shadcn UI components from the main app
    const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
      // Base classes matching buttonVariants from components/ui/button.tsx
      const baseClasses = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';
      
      // Variant classes matching actual button variants
      const variantClasses = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline'
      };
      
      // Size classes matching actual button sizes
      const sizeClasses = {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md gap-1.5 px-3',
        lg: 'h-10 rounded-md px-6',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10'
      };
      
      const finalClassName = [baseClasses, variantClasses[variant] || variantClasses.default, sizeClasses[size] || sizeClasses.default, className].filter(Boolean).join(' ');
      return React.createElement('button', {
        className: finalClassName.trim(),
        ...props
      }, children);
    };
    
    const Card = ({ children, className = '', ...props }) => {
      // Matching Card from components/ui/card.tsx
      return React.createElement('div', {
        className: ('bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm ' + className).trim(),
        'data-slot': 'card',
        ...props
      }, children);
    };
    
    const CardHeader = ({ children, className = '', ...props }) => {
      // Matching CardHeader from components/ui/card.tsx
      return React.createElement('div', {
        className: ('grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 ' + className).trim(),
        'data-slot': 'card-header',
        ...props
      }, children);
    };
    
    const CardTitle = ({ children, className = '', ...props }) => {
      // Matching CardTitle from components/ui/card.tsx
      return React.createElement('div', {
        className: ('leading-none font-semibold ' + className).trim(),
        'data-slot': 'card-title',
        ...props
      }, children);
    };
    
    const CardDescription = ({ children, className = '', ...props }) => {
      // Matching CardDescription from components/ui/card.tsx
      return React.createElement('div', {
        className: ('text-muted-foreground text-sm ' + className).trim(),
        'data-slot': 'card-description',
        ...props
      }, children);
    };
    
    const CardContent = ({ children, className = '', ...props }) => {
      // Matching CardContent from components/ui/card.tsx
      return React.createElement('div', {
        className: ('px-6 ' + className).trim(),
        'data-slot': 'card-content',
        ...props
      }, children);
    };
    
    const CardFooter = ({ children, className = '', ...props }) => {
      // Matching CardFooter from components/ui/card.tsx
      return React.createElement('div', {
        className: ('flex items-center px-6 ' + className).trim(),
        'data-slot': 'card-footer',
        ...props
      }, children);
    };
    
    const Badge = ({ children, variant = 'default', className = '', ...props }) => {
      // Base classes matching badgeVariants from components/ui/badge.tsx
      const baseClasses = 'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-[color,box-shadow] overflow-hidden focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]';
      
      // Variant classes matching actual badge variants
      const variantClasses = {
        default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive: 'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground'
      };
      
      const finalBadgeClassName = [baseClasses, variantClasses[variant] || variantClasses.default, className].filter(Boolean).join(' ');
      return React.createElement('span', {
        className: finalBadgeClassName.trim(),
        'data-slot': 'badge',
        ...props
      }, children);
    };
    
    // Avatar components (matching components/ui/avatar.tsx)
    const Avatar = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        className: ('relative flex size-8 shrink-0 overflow-hidden rounded-full ' + className).trim(),
        'data-slot': 'avatar',
        ...props
      }, children);
    };
    
    const AvatarImage = ({ src, alt, className = '', ...props }) => {
      return React.createElement('img', {
        src: src,
        alt: alt || '',
        className: ('aspect-square size-full ' + className).trim(),
        'data-slot': 'avatar-image',
        ...props
      });
    };
    
    const AvatarFallback = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        className: ('bg-muted flex size-full items-center justify-center rounded-full ' + className).trim(),
        'data-slot': 'avatar-fallback',
        ...props
      }, children);
    };
    
    // Separator component (matching components/ui/separator.tsx)
    const Separator = ({ orientation = 'horizontal', className = '', ...props }) => {
      const orientationClasses = orientation === 'horizontal' 
        ? 'h-px w-full' 
        : 'h-full w-px';
      return React.createElement('div', {
        className: ('bg-border shrink-0 ' + orientationClasses + ' ' + className).trim(),
        'data-slot': 'separator',
        'data-orientation': orientation,
        ...props
      });
    };
    
    // Section component (matching components/ui/section.tsx)
    const Section = ({ children, className = '', ...props }) => {
      return React.createElement('section', {
        'data-slot': 'section',
        className: ('bg-background text-foreground px-4 py-12 sm:py-24 md:py-32 ' + className).trim(),
        ...props
      }, children);
    };
    
    // Make stub components available in both local scope and window
    // Babel will look for these in local scope when transpiling JSX
    // Also make them available on window for explicit access
    const Image = ({ src, alt, className = '', ...props }) => {
      return React.createElement('img', {
        src: src,
        alt: alt || '',
        className: className,
        ...props
      });
    };
    
    // Export to window for global access
    window.Button = Button;
    window.Card = Card;
    window.CardHeader = CardHeader;
    window.CardTitle = CardTitle;
    window.CardDescription = CardDescription;
    window.CardContent = CardContent;
    window.CardFooter = CardFooter;
    window.Badge = Badge;
    window.Avatar = Avatar;
    window.AvatarImage = AvatarImage;
    window.AvatarFallback = AvatarFallback;
    window.Separator = Separator;
    window.Section = Section;
    window.Image = Image;
    
    // Basic Icons (from lucide-react) - simple SVG icons for common use cases
    // These are basic icons that AI can use in generated components
    const createIcon = (path, viewBox = "0 0 24 24") => ({ className = "h-4 w-4", ...props }) => {
      return React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: viewBox,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className,
        ...props
      }, path);
    };
    
    // Arrow icons
    const ArrowRight = createIcon([
      React.createElement('path', { key: '1', d: "M5 12h14" }),
      React.createElement('path', { key: '2', d: "m12 5 7 7-7 7" })
    ]);
    const ArrowLeft = createIcon([
      React.createElement('path', { key: '1', d: "M19 12H5" }),
      React.createElement('path', { key: '2', d: "m12 19-7-7 7-7" })
    ]);
    const ArrowUp = createIcon([
      React.createElement('path', { key: '1', d: "m18 15-6-6-6 6" }),
      React.createElement('path', { key: '2', d: "M12 21V9" })
    ]);
    const ArrowDown = createIcon([
      React.createElement('path', { key: '1', d: "m6 9 6 6 6-6" }),
      React.createElement('path', { key: '2', d: "M12 3v18" })
    ]);
    const ChevronRight = createIcon([
      React.createElement('path', { key: '1', d: "m9 18 6-6-6-6" })
    ]);
    const ChevronLeft = createIcon([
      React.createElement('path', { key: '1', d: "m15 18-6-6 6-6" })
    ]);
    const ChevronDown = createIcon([
      React.createElement('path', { key: '1', d: "m6 9 6 6 6-6" })
    ]);
    const ChevronUp = createIcon([
      React.createElement('path', { key: '1', d: "m18 15-6-6-6 6" })
    ]);
    
    // Common UI icons
    const Search = createIcon([
      React.createElement('circle', { key: '1', cx: "11", cy: "11", r: "8" }),
      React.createElement('path', { key: '2', d: "m21 21-4.35-4.35" })
    ]);
    const Menu = createIcon([
      React.createElement('line', { key: '1', x1: "4", x2: "20", y1: "12", y2: "12" }),
      React.createElement('line', { key: '2', x1: "4", x2: "20", y1: "6", y2: "6" }),
      React.createElement('line', { key: '3', x1: "4", x2: "20", y1: "18", y2: "18" })
    ]);
    const X = createIcon([
      React.createElement('path', { key: '1', d: "M18 6 6 18" }),
      React.createElement('path', { key: '2', d: "m6 6 12 12" })
    ]);
    const Check = createIcon([
      React.createElement('path', { key: '1', d: "M20 6 9 17l-5-5" })
    ]);
    const Star = createIcon([
      React.createElement('polygon', { key: '1', points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
    ]);
    const Heart = createIcon([
      React.createElement('path', { key: '1', d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" })
    ]);
    const ShoppingCart = createIcon([
      React.createElement('circle', { key: '1', cx: "8", cy: "21", r: "1" }),
      React.createElement('circle', { key: '2', cx: "19", cy: "21", r: "1" }),
      React.createElement('path', { key: '3', d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" })
    ]);
    const User = createIcon([
      React.createElement('path', { key: '1', d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
      React.createElement('circle', { key: '2', cx: "12", cy: "7", r: "4" })
    ]);
    const Mail = createIcon([
      React.createElement('rect', { key: '1', width: "20", height: "16", x: "2", y: "4", rx: "2" }),
      React.createElement('path', { key: '2', d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" })
    ]);
    const Phone = createIcon([
      React.createElement('path', { key: '1', d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })
    ]);
    const MapPin = createIcon([
      React.createElement('path', { key: '1', d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" }),
      React.createElement('circle', { key: '2', cx: "12", cy: "10", r: "3" })
    ]);
    const Calendar = createIcon([
      React.createElement('path', { key: '1', d: "M8 2v4" }),
      React.createElement('path', { key: '2', d: "M16 2v4" }),
      React.createElement('rect', { key: '3', width: "18", height: "18", x: "3", y: "4", rx: "2" }),
      React.createElement('path', { key: '4', d: "M3 10h18" })
    ]);
    const Clock = createIcon([
      React.createElement('circle', { key: '1', cx: "12", cy: "12", r: "10" }),
      React.createElement('polyline', { key: '2', points: "12 6 12 12 16 14" })
    ]);
    const Plus = createIcon([
      React.createElement('path', { key: '1', d: "M5 12h14" }),
      React.createElement('path', { key: '2', d: "M12 5v14" })
    ]);
    const Minus = createIcon([
      React.createElement('path', { key: '1', d: "M5 12h14" })
    ]);
    const Copy = createIcon([
      React.createElement('rect', { key: '1', width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }),
      React.createElement('path', { key: '2', d: "M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2" })
    ]);
    const Download = createIcon([
      React.createElement('path', { key: '1', d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
      React.createElement('polyline', { key: '2', points: "7 10 12 15 17 10" }),
      React.createElement('line', { key: '3', x1: "12", x2: "12", y1: "15", y2: "3" })
    ]);
    const Share = createIcon([
      React.createElement('circle', { key: '1', cx: "18", cy: "5", r: "3" }),
      React.createElement('circle', { key: '2', cx: "6", cy: "12", r: "3" }),
      React.createElement('circle', { key: '3', cx: "18", cy: "19", r: "3" }),
      React.createElement('line', { key: '4', x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49" }),
      React.createElement('line', { key: '5', x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49" })
    ]);
    const Edit = createIcon([
      React.createElement('path', { key: '1', d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }),
      React.createElement('path', { key: '2', d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" })
    ]);
    const Trash = createIcon([
      React.createElement('path', { key: '1', d: "M3 6h18" }),
      React.createElement('path', { key: '2', d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }),
      React.createElement('path', { key: '3', d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" })
    ]);
    const Eye = createIcon([
      React.createElement('path', { key: '1', d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" }),
      React.createElement('circle', { key: '2', cx: "12", cy: "12", r: "3" })
    ]);
    const Globe = createIcon([
      React.createElement('circle', { key: '1', cx: "12", cy: "12", r: "10" }),
      React.createElement('line', { key: '2', x1: "2", x2: "22", y1: "12", y2: "12" }),
      React.createElement('path', { key: '3', d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
    ]);
    
    // Business & Finance Icons
    const DollarSign = createIcon([
      React.createElement('line', { key: '1', x1: "12", x2: "12", y1: "2", y2: "22" }),
      React.createElement('path', { key: '2', d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" })
    ]);
    const CreditCard = createIcon([
      React.createElement('rect', { key: '1', width: "20", height: "14", x: "2", y: "5", rx: "2" }),
      React.createElement('line', { key: '2', x1: "2", x2: "22", y1: "10", y2: "10" })
    ]);
    const TrendingUp = createIcon([
      React.createElement('polyline', { key: '1', points: "22 7 13.5 15.5 8.5 10.5 2 17" }),
      React.createElement('polyline', { key: '2', points: "16 7 22 7 22 13" })
    ]);
    const TrendingDown = createIcon([
      React.createElement('polyline', { key: '1', points: "22 17 13.5 8.5 8.5 13.5 2 7" }),
      React.createElement('polyline', { key: '2', points: "16 17 22 17 22 11" })
    ]);
    const BarChart2 = createIcon([
      React.createElement('line', { key: '1', x1: "18", x2: "18", y1: "20", y2: "10" }),
      React.createElement('line', { key: '2', x1: "12", x2: "12", y1: "20", y2: "4" }),
      React.createElement('line', { key: '3', x1: "6", x2: "6", y1: "20", y2: "14" })
    ]);
    const Activity = createIcon([
      React.createElement('path', { key: '1', d: "M22 12h-4l-3 9L9 3l-3 9H2" })
    ]);
    const Briefcase = createIcon([
      React.createElement('rect', { key: '1', width: "20", height: "14", x: "2", y: "7", rx: "2", ry: "2" }),
      React.createElement('path', { key: '2', d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" })
    ]);
    
    // Navigation & UI Icons
    const Home = createIcon([
      React.createElement('path', { key: '1', d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
      React.createElement('polyline', { key: '2', points: "9 22 9 12 15 12 15 22" })
    ]);
    const Settings = createIcon([
      React.createElement('path', { key: '1', d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" }),
      React.createElement('circle', { key: '2', cx: "12", cy: "12", r: "3" })
    ]);
    const Bell = createIcon([
      React.createElement('path', { key: '1', d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" }),
      React.createElement('path', { key: '2', d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" })
    ]);
    const LogOut = createIcon([
      React.createElement('path', { key: '1', d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }),
      React.createElement('polyline', { key: '2', points: "16 17 21 12 16 7" }),
      React.createElement('line', { key: '3', x1: "21", x2: "9", y1: "12", y2: "12" })
    ]);
    const MoreVertical = createIcon([
      React.createElement('circle', { key: '1', cx: "12", cy: "12", r: "1" }),
      React.createElement('circle', { key: '2', cx: "12", cy: "5", r: "1" }),
      React.createElement('circle', { key: '3', cx: "12", cy: "19", r: "1" })
    ]);
    const MoreHorizontal = createIcon([
      React.createElement('circle', { key: '1', cx: "12", cy: "12", r: "1" }),
      React.createElement('circle', { key: '2', cx: "19", cy: "12", r: "1" }),
      React.createElement('circle', { key: '3', cx: "5", cy: "12", r: "1" })
    ]);
    const ExternalLink = createIcon([
      React.createElement('path', { key: '1', d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }),
      React.createElement('polyline', { key: '2', points: "15 3 21 3 21 9" }),
      React.createElement('line', { key: '3', x1: "10", x2: "21", y1: "14", y2: "3" })
    ]);
    const Link = createIcon([
      React.createElement('path', { key: '1', d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }),
      React.createElement('path', { key: '2', d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" })
    ]);
    
    // E-commerce & Shopping Icons
    const Package = createIcon([
      React.createElement('path', { key: '1', d: "M16.5 9.4 7.55 4.24" }),
      React.createElement('path', { key: '2', d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
      React.createElement('polyline', { key: '3', points: "3.27 6.96 12 12.01 20.73 6.96" }),
      React.createElement('line', { key: '4', x1: "12", x2: "12", y1: "22.08", y2: "12" })
    ]);
    const ShoppingBag = createIcon([
      React.createElement('path', { key: '1', d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
      React.createElement('line', { key: '2', x1: "3", x2: "21", y1: "6", y2: "6" }),
      React.createElement('path', { key: '3', d: "M16 10a4 4 0 0 1-8 0" })
    ]);
    const Tag = createIcon([
      React.createElement('path', { key: '1', d: "M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" }),
      React.createElement('path', { key: '2', d: "M7 7h.01" })
    ]);
    const Truck = createIcon([
      React.createElement('path', { key: '1', d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" }),
      React.createElement('path', { key: '2', d: "M15 18H9" }),
      React.createElement('path', { key: '3', d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" }),
      React.createElement('circle', { key: '4', cx: "17", cy: "18", r: "2" }),
      React.createElement('circle', { key: '5', cx: "7", cy: "18", r: "2" })
    ]);
    const Gift = createIcon([
      React.createElement('polyline', { key: '1', points: "20 12 20 22 4 22 4 12" }),
      React.createElement('rect', { key: '2', width: "20", height: "5", x: "2", y: "7" }),
      React.createElement('line', { key: '3', x1: "12", x2: "12", y1: "22", y2: "7" }),
      React.createElement('path', { key: '4', d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" }),
      React.createElement('path', { key: '5', d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" })
    ]);
    const Utensils = createIcon([
      React.createElement('path', { key: '1', d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" }),
      React.createElement('path', { key: '2', d: "M7 2v20" }),
      React.createElement('path', { key: '3', d: "M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3a2 2 0 0 0 2-2Z" }),
      React.createElement('path', { key: '4', d: "M21 15v7" })
    ]);
    const Wine = createIcon([
      React.createElement('path', { key: '1', d: "M8 22h8" }),
      React.createElement('path', { key: '2', d: "M12 11v11" }),
      React.createElement('path', { key: '3', d: "M19 5v6a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5V5Z" }),
      React.createElement('path', { key: '4', d: "M16 8c0-2.5-2-2.5-2-5C14 2 13 1 12 1s-2 1-2 2c0 2.5-2 2.5-2 5" })
    ]);
    
    // Social Media Icons
    const Facebook = createIcon([
      React.createElement('path', { key: '1', d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" })
    ]);
    const Twitter = createIcon([
      React.createElement('path', { key: '1', d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" })
    ]);
    const Instagram = createIcon([
      React.createElement('rect', { key: '1', width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5" }),
      React.createElement('path', { key: '2', d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
      React.createElement('line', { key: '3', x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5" })
    ]);
    const Linkedin = createIcon([
      React.createElement('path', { key: '1', d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" }),
      React.createElement('rect', { key: '2', width: "4", height: "12", x: "2", y: "9" }),
      React.createElement('circle', { key: '3', cx: "4", cy: "4", r: "2" })
    ]);
    const Youtube = createIcon([
      React.createElement('path', { key: '1', d: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" }),
      React.createElement('polygon', { key: '2', points: "9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" })
    ]);
    const Github = createIcon([
      React.createElement('path', { key: '1', d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" }),
      React.createElement('path', { key: '2', d: "M9 18c-4.51 2-5-2-7-2" })
    ]);
    
    // File & Document Icons
    const FileText = createIcon([
      React.createElement('path', { key: '1', d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
      React.createElement('polyline', { key: '2', points: "14 2 14 8 20 8" }),
      React.createElement('line', { key: '3', x1: "16", x2: "8", y1: "13", y2: "13" }),
      React.createElement('line', { key: '4', x1: "16", x2: "8", y1: "17", y2: "17" }),
      React.createElement('line', { key: '5', x1: "10", x2: "8", y1: "9", y2: "9" })
    ]);
    const File = createIcon([
      React.createElement('path', { key: '1', d: "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" }),
      React.createElement('polyline', { key: '2', points: "14 2 14 8 20 8" })
    ]);
    const Folder = createIcon([
      React.createElement('path', { key: '1', d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" })
    ]);
    const Upload = createIcon([
      React.createElement('path', { key: '1', d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
      React.createElement('polyline', { key: '2', points: "17 8 12 3 7 8" }),
      React.createElement('line', { key: '3', x1: "12", x2: "12", y1: "3", y2: "15" })
    ]);
    const ImageIcon = createIcon([
      React.createElement('rect', { key: '1', width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }),
      React.createElement('circle', { key: '2', cx: "9", cy: "9", r: "2" }),
      React.createElement('path', { key: '3', d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" })
    ]);
    
    // Media & Playback Icons
    const Play = createIcon([
      React.createElement('polygon', { key: '1', points: "5 3 19 12 5 21 5 3" })
    ]);
    const Pause = createIcon([
      React.createElement('rect', { key: '1', width: "4", height: "16", x: "6", y: "4" }),
      React.createElement('rect', { key: '2', width: "4", height: "16", x: "14", y: "4" })
    ]);
    const Video = createIcon([
      React.createElement('path', { key: '1', d: "m22 8-6 4 6 4V8Z" }),
      React.createElement('rect', { key: '2', width: "14", height: "12", x: "2", y: "6", rx: "2", ry: "2" })
    ]);
    const Camera = createIcon([
      React.createElement('path', { key: '1', d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" }),
      React.createElement('circle', { key: '2', cx: "12", cy: "13", r: "3" })
    ]);
    const Music = createIcon([
      React.createElement('path', { key: '1', d: "M9 18V5l12-2v13" }),
      React.createElement('circle', { key: '2', cx: "6", cy: "18", r: "3" }),
      React.createElement('circle', { key: '3', cx: "18", cy: "16", r: "3" })
    ]);
    
    // Miscellaneous Icons
    const Users = createIcon([
      React.createElement('path', { key: '1', d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
      React.createElement('circle', { key: '2', cx: "9", cy: "7", r: "4" }),
      React.createElement('path', { key: '3', d: "M22 21v-2a4 4 0 0 0-3-3.87" }),
      React.createElement('path', { key: '4', d: "M16 3.13a4 4 0 0 1 0 7.75" })
    ]);
    const Award = createIcon([
      React.createElement('circle', { key: '1', cx: "12", cy: "8", r: "7" }),
      React.createElement('polyline', { key: '2', points: "8.21 13.89 7 23 12 20 17 23 15.79 13.88" })
    ]);
    const Zap = createIcon([
      React.createElement('polygon', { key: '1', points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })
    ]);
    const Shield = createIcon([
      React.createElement('path', { key: '1', d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" })
    ]);
    const Lock = createIcon([
      React.createElement('rect', { key: '1', width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" }),
      React.createElement('path', { key: '2', d: "M7 11V7a5 5 0 0 1 10 0v4" })
    ]);
    const Unlock = createIcon([
      React.createElement('rect', { key: '1', width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" }),
      React.createElement('path', { key: '2', d: "M7 11V7a5 5 0 0 1 9.9-1" })
    ]);
    const AlertCircle = createIcon([
      React.createElement('circle', { key: '1', cx: "12", cy: "12", r: "10" }),
      React.createElement('line', { key: '2', x1: "12", x2: "12", y1: "8", y2: "12" }),
      React.createElement('line', { key: '3', x1: "12", x2: "12.01", y1: "16", y2: "16" })
    ]);
    const CheckCircle = createIcon([
      React.createElement('path', { key: '1', d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }),
      React.createElement('polyline', { key: '2', points: "22 4 12 14.01 9 11.01" })
    ]);
    const XCircle = createIcon([
      React.createElement('circle', { key: '1', cx: "12", cy: "12", r: "10" }),
      React.createElement('line', { key: '2', x1: "15", x2: "9", y1: "9", y2: "15" }),
      React.createElement('line', { key: '3', x1: "9", x2: "15", y1: "9", y2: "15" })
    ]);
    const Filter = createIcon([
      React.createElement('polygon', { key: '1', points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" })
    ]);
    const Loader = createIcon([
      React.createElement('line', { key: '1', x1: "12", x2: "12", y1: "2", y2: "6" }),
      React.createElement('line', { key: '2', x1: "12", x2: "12", y1: "18", y2: "22" }),
      React.createElement('line', { key: '3', x1: "4.93", x2: "7.76", y1: "4.93", y2: "7.76" }),
      React.createElement('line', { key: '4', x1: "16.24", x2: "19.07", y1: "16.24", y2: "19.07" }),
      React.createElement('line', { key: '5', x1: "2", x2: "6", y1: "12", y2: "12" }),
      React.createElement('line', { key: '6', x1: "18", x2: "22", y1: "12", y2: "12" }),
      React.createElement('line', { key: '7', x1: "4.93", x2: "7.76", y1: "19.07", y2: "16.24" }),
      React.createElement('line', { key: '8', x1: "16.24", x2: "19.07", y1: "7.76", y2: "4.93" })
    ]);
    
    // Additional Icons for Templates
    const Sparkles = createIcon([
      React.createElement('path', { key: '1', d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" })
    ]);
    const Code = createIcon([
      React.createElement('polyline', { key: '1', points: "16 18 22 12 16 6" }),
      React.createElement('polyline', { key: '2', points: "8 6 2 12 8 18" })
    ]);
    const Palette = createIcon([
      React.createElement('circle', { key: '1', cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor" }),
      React.createElement('circle', { key: '2', cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor" }),
      React.createElement('circle', { key: '3', cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor" }),
      React.createElement('circle', { key: '4', cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor" }),
      React.createElement('path', { key: '5', d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" })
    ]);
    const Layout = createIcon([
      React.createElement('rect', { key: '1', width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }),
      React.createElement('line', { key: '2', x1: "3", x2: "21", y1: "9", y2: "9" }),
      React.createElement('line', { key: '3', x1: "9", x2: "9", y1: "21", y2: "9" })
    ]);
    const ChefHat = createIcon([
      React.createElement('path', { key: '1', d: "M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 15.41 6 4 4 0 0 1 18 13.87V21H6Z" }),
      React.createElement('line', { key: '2', x1: "6", x2: "18", y1: "17", y2: "17" })
    ]);
    const Coffee = createIcon([
      React.createElement('path', { key: '1', d: "M18 8h1a4 4 0 0 1 0 8h-1" }),
      React.createElement('path', { key: '2', d: "M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z" }),
      React.createElement('line', { key: '3', x1: "6", x2: "6", y1: "1", y2: "4" }),
      React.createElement('line', { key: '4', x1: "10", x2: "10", y1: "1", y2: "4" }),
      React.createElement('line', { key: '5', x1: "14", x2: "14", y1: "1", y2: "4" })
    ]);
    const MessageCircle = createIcon([
      React.createElement('path', { key: '1', d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" })
    ]);
    const Share2 = createIcon([
      React.createElement('circle', { key: '1', cx: "18", cy: "5", r: "3" }),
      React.createElement('circle', { key: '2', cx: "6", cy: "12", r: "3" }),
      React.createElement('circle', { key: '3', cx: "18", cy: "19", r: "3" }),
      React.createElement('line', { key: '4', x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49" }),
      React.createElement('line', { key: '5', x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49" })
    ]);
    const Bookmark = createIcon([
      React.createElement('path', { key: '1', d: "M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" })
    ]);
    const SlidersHorizontal = createIcon([
      React.createElement('line', { key: '1', x1: "21", x2: "14", y1: "4", y2: "4" }),
      React.createElement('line', { key: '2', x1: "10", x2: "3", y1: "4", y2: "4" }),
      React.createElement('line', { key: '3', x1: "21", x2: "12", y1: "12", y2: "12" }),
      React.createElement('line', { key: '4', x1: "8", x2: "3", y1: "12", y2: "12" }),
      React.createElement('line', { key: '5', x1: "21", x2: "16", y1: "20", y2: "20" }),
      React.createElement('line', { key: '6', x1: "12", x2: "3", y1: "20", y2: "20" }),
      React.createElement('line', { key: '7', x1: "14", x2: "14", y1: "2", y2: "6" }),
      React.createElement('line', { key: '8', x1: "8", x2: "8", y1: "10", y2: "14" }),
      React.createElement('line', { key: '9', x1: "16", x2: "16", y1: "18", y2: "22" })
    ]);
    
    // Export icons to window (only if not already defined to prevent conflicts)
    // Use Object.defineProperty to make them non-configurable and prevent redeclaration
    const defineIcon = (name, icon) => {
      if (!window[name]) {
        Object.defineProperty(window, name, {
          value: icon,
          writable: false,
          configurable: false,
          enumerable: true
        });
      }
    };
    
    // Arrow & Navigation icons
    defineIcon('ArrowRight', ArrowRight);
    defineIcon('ArrowLeft', ArrowLeft);
    defineIcon('ArrowUp', ArrowUp);
    defineIcon('ArrowDown', ArrowDown);
    defineIcon('ChevronRight', ChevronRight);
    defineIcon('ChevronLeft', ChevronLeft);
    defineIcon('ChevronDown', ChevronDown);
    defineIcon('ChevronUp', ChevronUp);
    
    // Common UI icons
    defineIcon('Search', Search);
    defineIcon('Menu', Menu);
    defineIcon('X', X);
    defineIcon('Check', Check);
    defineIcon('Star', Star);
    defineIcon('Heart', Heart);
    defineIcon('ShoppingCart', ShoppingCart);
    defineIcon('User', User);
    defineIcon('Mail', Mail);
    defineIcon('Phone', Phone);
    defineIcon('MapPin', MapPin);
    defineIcon('Calendar', Calendar);
    defineIcon('Clock', Clock);
    defineIcon('Plus', Plus);
    defineIcon('Minus', Minus);
    defineIcon('Copy', Copy);
    defineIcon('Download', Download);
    defineIcon('Share', Share);
    defineIcon('Edit', Edit);
    defineIcon('Trash', Trash);
    defineIcon('Eye', Eye);
    defineIcon('Globe', Globe);
    
    // Business & Finance icons
    defineIcon('DollarSign', DollarSign);
    defineIcon('CreditCard', CreditCard);
    defineIcon('TrendingUp', TrendingUp);
    defineIcon('TrendingDown', TrendingDown);
    defineIcon('BarChart2', BarChart2);
    defineIcon('Activity', Activity);
    defineIcon('Briefcase', Briefcase);
    
    // Navigation & UI icons
    defineIcon('Home', Home);
    defineIcon('Settings', Settings);
    defineIcon('Bell', Bell);
    defineIcon('LogOut', LogOut);
    defineIcon('MoreVertical', MoreVertical);
    defineIcon('MoreHorizontal', MoreHorizontal);
    defineIcon('ExternalLink', ExternalLink);
    defineIcon('Link', Link);
    
    // E-commerce & Shopping icons
    defineIcon('Package', Package);
    defineIcon('ShoppingBag', ShoppingBag);
    defineIcon('Tag', Tag);
    defineIcon('Truck', Truck);
    defineIcon('Gift', Gift);
    defineIcon('Utensils', Utensils);
    defineIcon('Wine', Wine);
    
    // Social Media icons
    defineIcon('Facebook', Facebook);
    defineIcon('Twitter', Twitter);
    defineIcon('Instagram', Instagram);
    defineIcon('Linkedin', Linkedin);
    defineIcon('Youtube', Youtube);
    defineIcon('Github', Github);
    
    // File & Document icons
    defineIcon('FileText', FileText);
    defineIcon('File', File);
    defineIcon('Folder', Folder);
    defineIcon('Upload', Upload);
    defineIcon('ImageIcon', ImageIcon);
    
    // Media & Playback icons
    defineIcon('Play', Play);
    defineIcon('Pause', Pause);
    defineIcon('Video', Video);
    defineIcon('Camera', Camera);
    defineIcon('Music', Music);
    
    // Miscellaneous icons
    defineIcon('Users', Users);
    defineIcon('Award', Award);
    defineIcon('Zap', Zap);
    defineIcon('Shield', Shield);
    defineIcon('Lock', Lock);
    defineIcon('Unlock', Unlock);
    defineIcon('AlertCircle', AlertCircle);
    defineIcon('CheckCircle', CheckCircle);
    defineIcon('XCircle', XCircle);
    defineIcon('Filter', Filter);
    defineIcon('Loader', Loader);
    
    // Additional Template Icons
    defineIcon('Sparkles', Sparkles);
    defineIcon('Code', Code);
    defineIcon('Palette', Palette);
    defineIcon('Layout', Layout);
    defineIcon('ChefHat', ChefHat);
    defineIcon('Coffee', Coffee);
    defineIcon('MessageCircle', MessageCircle);
    defineIcon('Share2', Share2);
    defineIcon('Bookmark', Bookmark);
    defineIcon('SlidersHorizontal', SlidersHorizontal);
    
    // Input components (matching components/ui/input.tsx, textarea.tsx, label.tsx)
    const Input = ({ className = '', type = 'text', ...props }) => {
      return React.createElement('input', {
        type: type,
        'data-slot': 'input',
        className: ('file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ' + className).trim(),
        ...props
      });
    };
    
    // Switch component (matching components/ui/switch.tsx)
    const Switch = ({ className = '', checked = false, onCheckedChange, ...props }) => {
      const [isChecked, setIsChecked] = useState(checked);
      
      useEffect(() => {
        setIsChecked(checked);
      }, [checked]);
      
      const handleClick = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        if (onCheckedChange) onCheckedChange(newValue);
      };
      
      return React.createElement('button', {
        type: 'button',
        role: 'switch',
        'aria-checked': isChecked,
        'data-state': isChecked ? 'checked' : 'unchecked',
        'data-slot': 'switch',
        onClick: handleClick,
        className: ('peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-input shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ' + (isChecked ? 'bg-primary' : 'bg-input') + ' ' + className).trim(),
        ...props
      }, React.createElement('span', {
        'data-slot': 'switch-thumb',
        className: ('pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ' + (isChecked ? 'translate-x-4' : 'translate-x-0')).trim()
      }));
    };
    
    // Checkbox component (matching components/ui/checkbox.tsx)
    const Checkbox = ({ className = '', checked = false, onCheckedChange, ...props }) => {
      const [isChecked, setIsChecked] = useState(checked);
      
      useEffect(() => {
        setIsChecked(checked);
      }, [checked]);
      
      const handleClick = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        if (onCheckedChange) onCheckedChange(newValue);
      };
      
      return React.createElement('button', {
        type: 'button',
        role: 'checkbox',
        'aria-checked': isChecked,
        'data-state': isChecked ? 'checked' : 'unchecked',
        'data-slot': 'checkbox',
        onClick: handleClick,
        className: ('peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ' + (isChecked ? 'bg-primary text-primary-foreground' : 'bg-background') + ' ' + className).trim(),
        ...props
      }, isChecked && React.createElement(Check, { className: 'h-3 w-3' }));
    };
    
    // RadioGroup component (matching components/ui/radio-group.tsx)
    const RadioGroup = ({ children, value, onValueChange, className = '', ...props }) => {
      return React.createElement('div', {
        role: 'radiogroup',
        'data-slot': 'radio-group',
        className: ('grid gap-2 ' + className).trim(),
        ...props
      }, children);
    };
    
    const RadioGroupItem = ({ value, checked = false, onCheckedChange, className = '', ...props }) => {
      const [isChecked, setIsChecked] = useState(checked);
      
      const handleClick = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        if (onCheckedChange) onCheckedChange(newValue);
      };
      
      return React.createElement('button', {
        type: 'button',
        role: 'radio',
        'aria-checked': isChecked,
        'data-state': isChecked ? 'checked' : 'unchecked',
        'data-slot': 'radio',
        onClick: handleClick,
        className: ('aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ' + className).trim(),
        ...props
      }, isChecked && React.createElement('span', {
        className: 'flex items-center justify-center'
      }, React.createElement('span', {
        className: 'h-2 w-2 rounded-full bg-primary'
      })));
    };
    
    // Toggle components (matching components/ui/toggle.tsx)
    const Toggle = ({ children, pressed = false, onPressedChange, variant = 'default', size = 'default', className = '', ...props }) => {
      const [isPressed, setIsPressed] = useState(pressed);
      
      useEffect(() => {
        setIsPressed(pressed);
      }, [pressed]);
      
      const handleClick = () => {
        const newValue = !isPressed;
        setIsPressed(newValue);
        if (onPressedChange) onPressedChange(newValue);
      };
      
      const variantClasses = {
        default: 'bg-transparent hover:bg-muted hover:text-muted-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground data-[state=on]:bg-accent data-[state=on]:text-accent-foreground'
      };
      
      const sizeClasses = {
        default: 'h-9 px-3',
        sm: 'h-8 px-2',
        lg: 'h-10 px-4'
      };
      
      return React.createElement('button', {
        type: 'button',
        'aria-pressed': isPressed,
        'data-state': isPressed ? 'on' : 'off',
        'data-slot': 'toggle',
        onClick: handleClick,
        className: ('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ' + variantClasses[variant] + ' ' + sizeClasses[size] + ' ' + className).trim(),
        ...props
      }, children);
    };
    
    const ToggleGroup = ({ children, type = 'single', value, onValueChange, className = '', ...props }) => {
      return React.createElement('div', {
        role: 'group',
        'data-slot': 'toggle-group',
        className: ('flex items-center justify-center gap-1 ' + className).trim(),
        ...props
      }, children);
    };
    
    // Slider component (matching components/ui/slider.tsx)
    const Slider = ({ value = [50], onValueChange, min = 0, max = 100, step = 1, className = '', ...props }) => {
      const [sliderValue, setSliderValue] = useState(value[0] || 50);
      
      const handleChange = (e) => {
        const newValue = parseInt(e.target.value);
        setSliderValue(newValue);
        if (onValueChange) onValueChange([newValue]);
      };
      
      return React.createElement('div', {
        'data-slot': 'slider',
        className: ('relative flex w-full touch-none select-none items-center ' + className).trim(),
        ...props
      }, React.createElement('input', {
        type: 'range',
        min: min,
        max: max,
        step: step,
        value: sliderValue,
        onChange: handleChange,
        className: 'w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary'
      }));
    };
    
    // InputGroup components (for grouped inputs)
    const InputGroup = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'input-group',
        className: ('flex w-full items-center ' + className).trim(),
        ...props
      }, children);
    };
    
    const InputGroupAddon = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'input-group-addon',
        className: ('flex h-9 items-center rounded-md border border-input bg-muted px-3 text-sm ' + className).trim(),
        ...props
      }, children);
    };
    
    const InputGroupButton = ({ children, className = '', ...props }) => {
      return React.createElement('button', {
        'data-slot': 'input-group-button',
        className: ('flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm hover:bg-accent ' + className).trim(),
        ...props
      }, children);
    };
    
    const InputGroupText = ({ children, className = '', ...props }) => {
      return React.createElement('span', {
        'data-slot': 'input-group-text',
        className: ('flex h-9 items-center px-3 text-sm text-muted-foreground ' + className).trim(),
        ...props
      }, children);
    };
    
    const InputGroupTextarea = ({ className = '', ...props }) => {
      return React.createElement('textarea', {
        'data-slot': 'input-group-textarea',
        className: ('flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ' + className).trim(),
        ...props
      });
    };
    
    const Textarea = ({ className = '', ...props }) => {
      return React.createElement('textarea', {
        'data-slot': 'textarea',
        className: ('border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm ' + className).trim(),
        ...props
      });
    };
    
    const Label = ({ className = '', ...props }) => {
      return React.createElement('label', {
        'data-slot': 'label',
        className: ('flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ' + className).trim(),
        ...props
      });
    };
    
    // Select components (simplified - matching components/ui/select.tsx)
    const Select = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'select',
        className: className,
        ...props
      }, children);
    };
    
    const SelectTrigger = ({ children, className = '', ...props }) => {
      return React.createElement('button', {
        'data-slot': 'select-trigger',
        className: ('border-input data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm h-9 shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 ' + className).trim(),
        ...props
      }, children);
    };
    
    const SelectValue = ({ className = '', ...props }) => {
      return React.createElement('span', {
        'data-slot': 'select-value',
        className: className,
        ...props
      });
    };
    
    const SelectContent = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'select-content',
        className: ('relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md ' + className).trim(),
        ...props
      }, children);
    };
    
    const SelectItem = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'select-item',
        className: ('relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ' + className).trim(),
        ...props
      }, children);
    };
    
    // Tabs components (matching components/ui/tabs.tsx)
    const Tabs = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'tabs',
        className: ('flex flex-col gap-2 ' + className).trim(),
        ...props
      }, children);
    };
    
    const TabsList = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'tabs-list',
        className: ('bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] ' + className).trim(),
        ...props
      }, children);
    };
    
    const TabsTrigger = ({ children, className = '', ...props }) => {
      return React.createElement('button', {
        'data-slot': 'tabs-trigger',
        className: ('data-[state=active]:bg-background text-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm ' + className).trim(),
        ...props
      }, children);
    };
    
    const TabsContent = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'tabs-content',
        className: ('mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ' + className).trim(),
        ...props
      }, children);
    };
    
    // Table components (matching components/ui/table.tsx)
    const Table = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'table-container',
        className: 'relative w-full overflow-x-auto'
      }, React.createElement('table', {
        'data-slot': 'table',
        className: ('w-full caption-bottom text-sm ' + className).trim(),
        ...props
      }, children));
    };
    
    const TableHeader = ({ children, className = '', ...props }) => {
      return React.createElement('thead', {
        'data-slot': 'table-header',
        className: ('[&_tr]:border-b ' + className).trim(),
        ...props
      }, children);
    };
    
    const TableBody = ({ children, className = '', ...props }) => {
      return React.createElement('tbody', {
        'data-slot': 'table-body',
        className: ('[&_tr:last-child]:border-0 ' + className).trim(),
        ...props
      }, children);
    };
    
    const TableRow = ({ children, className = '', ...props }) => {
      return React.createElement('tr', {
        'data-slot': 'table-row',
        className: ('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ' + className).trim(),
        ...props
      }, children);
    };
    
    const TableHead = ({ children, className = '', ...props }) => {
      return React.createElement('th', {
        'data-slot': 'table-head',
        className: ('h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] ' + className).trim(),
        ...props
      }, children);
    };
    
    const TableCell = ({ children, className = '', ...props }) => {
      return React.createElement('td', {
        'data-slot': 'table-cell',
        className: ('p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px] ' + className).trim(),
        ...props
      }, children);
    };
    
    // Skeleton component (matching components/ui/skeleton.tsx)
    const Skeleton = ({ className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'skeleton',
        className: ('bg-accent animate-pulse rounded-md ' + className).trim(),
        ...props
      });
    };
    
    // Progress component (matching components/ui/progress.tsx)
    const Progress = ({ className = '', value = 0, ...props }) => {
      return React.createElement('div', {
        'data-slot': 'progress',
        className: ('bg-primary/20 relative h-2 w-full overflow-hidden rounded-full ' + className).trim(),
        ...props
      }, React.createElement('div', {
        'data-slot': 'progress-indicator',
        className: 'bg-primary h-full w-full flex-1 transition-all',
        style: { transform: \`translateX(-\${100 - (value || 0)}%)\` }
      }));
    };
    
    // Dialog components (matching components/ui/dialog.tsx)
    const Dialog = ({ children, open = false, onOpenChange, ...props }) => {
      const [isOpen, setIsOpen] = useState(open);
      
      useEffect(() => {
        setIsOpen(open);
      }, [open]);
      
      return isOpen ? React.createElement('div', {
        'data-slot': 'dialog',
        className: 'fixed inset-0 z-50 flex items-center justify-center',
        ...props
      }, [
        React.createElement('div', {
          key: 'overlay',
          className: 'fixed inset-0 bg-black/50',
          onClick: () => {
            setIsOpen(false);
            if (onOpenChange) onOpenChange(false);
          }
        }),
        children
      ]) : null;
    };
    
    const DialogContent = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'dialog-content',
        className: ('relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg rounded-lg ' + className).trim(),
        onClick: (e) => e.stopPropagation(),
        ...props
      }, children);
    };
    
    const DialogHeader = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'dialog-header',
        className: ('flex flex-col space-y-1.5 text-center sm:text-left ' + className).trim(),
        ...props
      }, children);
    };
    
    const DialogTitle = ({ children, className = '', ...props }) => {
      return React.createElement('h2', {
        'data-slot': 'dialog-title',
        className: ('text-lg font-semibold leading-none tracking-tight ' + className).trim(),
        ...props
      }, children);
    };
    
    const DialogDescription = ({ children, className = '', ...props }) => {
      return React.createElement('p', {
        'data-slot': 'dialog-description',
        className: ('text-sm text-muted-foreground ' + className).trim(),
        ...props
      }, children);
    };
    
    const DialogFooter = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'dialog-footer',
        className: ('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ' + className).trim(),
        ...props
      }, children);
    };
    
    // AlertDialog components (similar to Dialog)
    const AlertDialog = Dialog;
    const AlertDialogContent = DialogContent;
    const AlertDialogHeader = DialogHeader;
    const AlertDialogTitle = DialogTitle;
    const AlertDialogDescription = DialogDescription;
    const AlertDialogFooter = DialogFooter;
    const AlertDialogAction = ({ children, className = '', ...props }) => {
      return React.createElement('button', {
        'data-slot': 'alert-dialog-action',
        className: ('inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 ' + className).trim(),
        ...props
      }, children);
    };
    const AlertDialogCancel = ({ children, className = '', ...props }) => {
      return React.createElement('button', {
        'data-slot': 'alert-dialog-cancel',
        className: ('inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent ' + className).trim(),
        ...props
      }, children);
    };
    
    // Sheet components (matching components/ui/sheet.tsx)
    const Sheet = ({ children, open = false, onOpenChange, side = 'right', ...props }) => {
      const [isOpen, setIsOpen] = useState(open);
      
      useEffect(() => {
        setIsOpen(open);
      }, [open]);
      
      return isOpen ? React.createElement('div', {
        'data-slot': 'sheet',
        className: 'fixed inset-0 z-50',
        ...props
      }, [
        React.createElement('div', {
          key: 'overlay',
          className: 'fixed inset-0 bg-black/50',
          onClick: () => {
            setIsOpen(false);
            if (onOpenChange) onOpenChange(false);
          }
        }),
        children
      ]) : null;
    };
    
    const SheetContent = ({ children, side = 'right', className = '', ...props }) => {
      const sideClasses = {
        top: 'inset-x-0 top-0 border-b',
        bottom: 'inset-x-0 bottom-0 border-t',
        left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
        right: 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm'
      };
      
      return React.createElement('div', {
        'data-slot': 'sheet-content',
        className: ('fixed z-50 gap-4 bg-background p-6 shadow-lg ' + sideClasses[side] + ' ' + className).trim(),
        onClick: (e) => e.stopPropagation(),
        ...props
      }, children);
    };
    
    const SheetHeader = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'sheet-header',
        className: ('flex flex-col space-y-2 text-center sm:text-left ' + className).trim(),
        ...props
      }, children);
    };
    
    const SheetTitle = ({ children, className = '', ...props }) => {
      return React.createElement('h2', {
        'data-slot': 'sheet-title',
        className: ('text-lg font-semibold text-foreground ' + className).trim(),
        ...props
      }, children);
    };
    
    // Drawer component (similar to Sheet)
    const Drawer = Sheet;
    
    // Popover components (matching components/ui/popover.tsx)
    const Popover = ({ children, open = false, onOpenChange, ...props }) => {
      const [isOpen, setIsOpen] = useState(open);
      
      return React.createElement('div', {
        'data-slot': 'popover',
        className: 'relative inline-block',
        ...props
      }, children);
    };
    
    const PopoverTrigger = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'popover-trigger',
        className: className,
        ...props
      }, children);
    };
    
    const PopoverContent = ({ children, align = 'center', className = '', ...props }) => {
      const alignClasses = {
        start: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0'
      };
      
      return React.createElement('div', {
        'data-slot': 'popover-content',
        className: ('absolute z-50 mt-2 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none ' + alignClasses[align] + ' ' + className).trim(),
        ...props
      }, children);
    };
    
    // Tooltip component (matching components/ui/tooltip.tsx)
    const Tooltip = ({ children, content, ...props }) => {
      const [isVisible, setIsVisible] = useState(false);
      
      return React.createElement('div', {
        'data-slot': 'tooltip',
        className: 'relative inline-block',
        onMouseEnter: () => setIsVisible(true),
        onMouseLeave: () => setIsVisible(false),
        ...props
      }, [
        children,
        isVisible && React.createElement('div', {
          key: 'tooltip-content',
          className: 'absolute z-50 px-3 py-1.5 text-xs text-primary-foreground bg-primary rounded-md shadow-md whitespace-nowrap bottom-full left-1/2 -translate-x-1/2 mb-2',
          role: 'tooltip'
        }, content)
      ]);
    };
    
    // DropdownMenu components (matching components/ui/dropdown-menu.tsx)
    const DropdownMenu = ({ children, ...props }) => {
      return React.createElement('div', {
        'data-slot': 'dropdown-menu',
        className: 'relative inline-block text-left',
        ...props
      }, children);
    };
    
    const DropdownMenuTrigger = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'dropdown-menu-trigger',
        className: className,
        ...props
      }, children);
    };
    
    const DropdownMenuContent = ({ children, align = 'start', className = '', ...props }) => {
      const alignClasses = {
        start: 'left-0',
        center: 'left-1/2 -translate-x-1/2',
        end: 'right-0'
      };
      
      return React.createElement('div', {
        'data-slot': 'dropdown-menu-content',
        className: ('absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md ' + alignClasses[align] + ' ' + className).trim(),
        ...props
      }, children);
    };
    
    const DropdownMenuItem = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'dropdown-menu-item',
        className: ('relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ' + className).trim(),
        ...props
      }, children);
    };
    
    // ContextMenu component (similar to DropdownMenu)
    const ContextMenu = DropdownMenu;
    const ContextMenuTrigger = DropdownMenuTrigger;
    const ContextMenuContent = DropdownMenuContent;
    const ContextMenuItem = DropdownMenuItem;
    
    // Breadcrumb components (matching components/ui/breadcrumb.tsx)
    const Breadcrumb = ({ children, className = '', ...props }) => {
      return React.createElement('nav', {
        'data-slot': 'breadcrumb',
        'aria-label': 'breadcrumb',
        className: className,
        ...props
      }, React.createElement('ol', {
        className: 'flex items-center gap-2 text-sm text-muted-foreground'
      }, children));
    };
    
    const BreadcrumbItem = ({ children, className = '', ...props }) => {
      return React.createElement('li', {
        'data-slot': 'breadcrumb-item',
        className: ('inline-flex items-center gap-2 ' + className).trim(),
        ...props
      }, children);
    };
    
    const BreadcrumbLink = ({ children, href = '#', className = '', ...props }) => {
      return React.createElement('a', {
        'data-slot': 'breadcrumb-link',
        href: href,
        className: ('transition-colors hover:text-foreground ' + className).trim(),
        ...props
      }, children);
    };
    
    const BreadcrumbSeparator = ({ children, className = '', ...props }) => {
      return React.createElement('span', {
        'data-slot': 'breadcrumb-separator',
        role: 'presentation',
        className: ('text-muted-foreground ' + className).trim(),
        ...props
      }, children || '/');
    };
    
    // Command component (matching components/ui/command.tsx)
    const Command = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'command',
        className: ('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground ' + className).trim(),
        ...props
      }, children);
    };
    
    const CommandInput = ({ className = '', placeholder = 'Type a command...', ...props }) => {
      return React.createElement('input', {
        'data-slot': 'command-input',
        type: 'text',
        placeholder: placeholder,
        className: ('flex h-10 w-full rounded-md bg-transparent py-3 px-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 ' + className).trim(),
        ...props
      });
    };
    
    const CommandList = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'command-list',
        className: ('max-h-[300px] overflow-y-auto overflow-x-hidden ' + className).trim(),
        ...props
      }, children);
    };
    
    const CommandItem = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'command-item',
        className: ('relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ' + className).trim(),
        ...props
      }, children);
    };
    
    // Sidebar component (matching components/ui/sidebar.tsx)
    const Sidebar = ({ children, side = 'left', className = '', ...props }) => {
      const sideClasses = side === 'left' ? 'left-0 border-r' : 'right-0 border-l';
      
      return React.createElement('aside', {
        'data-slot': 'sidebar',
        className: ('fixed top-0 z-40 h-screen w-64 bg-background ' + sideClasses + ' ' + className).trim(),
        ...props
      }, children);
    };
    
    // Collapsible component (matching components/ui/collapsible.tsx)
    const Collapsible = ({ children, open = false, onOpenChange, className = '', ...props }) => {
      const [isOpen, setIsOpen] = useState(open);
      
      useEffect(() => {
        setIsOpen(open);
      }, [open]);
      
      return React.createElement('div', {
        'data-slot': 'collapsible',
        'data-state': isOpen ? 'open' : 'closed',
        className: className,
        ...props
      }, children);
    };
    
    const CollapsibleTrigger = ({ children, className = '', ...props }) => {
      return React.createElement('button', {
        'data-slot': 'collapsible-trigger',
        type: 'button',
        className: className,
        ...props
      }, children);
    };
    
    const CollapsibleContent = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'collapsible-content',
        className: ('overflow-hidden transition-all ' + className).trim(),
        ...props
      }, children);
    };
    
    // Kbd component (for keyboard shortcuts display)
    const Kbd = ({ children, className = '', ...props }) => {
      return React.createElement('kbd', {
        'data-slot': 'kbd',
        className: ('pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ' + className).trim(),
        ...props
      }, children);
    };
    
    // ButtonGroup component (for grouped buttons)
    const ButtonGroup = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'button-group',
        className: ('inline-flex rounded-md shadow-sm ' + className).trim(),
        role: 'group',
        ...props
      }, children);
    };
    
    // HideOnCollapse component
    const HideOnCollapse = ({ children, collapsed = false, className = '', ...props }) => {
      return !collapsed ? React.createElement('div', {
        'data-slot': 'hide-on-collapse',
        className: className,
        ...props
      }, children) : null;
    };
    
    // AnimatedShinyText component (for animated text effects)
    const AnimatedShinyText = ({ children, className = '', ...props }) => {
      return React.createElement('span', {
        'data-slot': 'animated-shiny-text',
        className: ('inline-flex animate-shimmer bg-gradient-to-r from-foreground via-foreground/80 to-foreground bg-[length:200%_100%] bg-clip-text text-transparent ' + className).trim(),
        ...props
      }, children);
    };
    
    // Item components (for list items)
    const Item = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'item',
        className: ('flex items-center gap-4 rounded-lg border bg-card p-4 ' + className).trim(),
        ...props
      }, children);
    };
    
    const ItemContent = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'item-content',
        className: ('flex-1 space-y-1 ' + className).trim(),
        ...props
      }, children);
    };
    
    const ItemTitle = ({ children, className = '', ...props }) => {
      return React.createElement('h3', {
        'data-slot': 'item-title',
        className: ('font-semibold leading-none tracking-tight ' + className).trim(),
        ...props
      }, children);
    };
    
    const ItemDescription = ({ children, className = '', ...props }) => {
      return React.createElement('p', {
        'data-slot': 'item-description',
        className: ('text-sm text-muted-foreground ' + className).trim(),
        ...props
      }, children);
    };
    
    const ItemMedia = ({ src, alt, className = '', ...props }) => {
      return React.createElement('img', {
        'data-slot': 'item-media',
        src: src,
        alt: alt || '',
        className: ('h-16 w-16 rounded-md object-cover ' + className).trim(),
        ...props
      });
    };
    
    const ItemActions = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'item-actions',
        className: ('flex items-center gap-2 ' + className).trim(),
        ...props
      }, children);
    };
    
    // Sonner (Toast notifications) - simplified version
    const Sonner = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'sonner',
        className: ('fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px] ' + className).trim(),
        ...props
      }, children);
    };
    
    // Toast function for programmatic toasts
    const toast = (message, options = {}) => {
      // Create toast element
      const toastEl = document.createElement('div');
      toastEl.className = 'fixed bottom-4 right-4 z-50 bg-background border rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-bottom-5';
      toastEl.textContent = message;
      
      // Add to DOM
      document.body.appendChild(toastEl);
      
      // Auto remove after duration
      const duration = options.duration || 3000;
      setTimeout(() => {
        toastEl.remove();
      }, duration);
      
      return {
        dismiss: () => toastEl.remove()
      };
    };
    
    // Make toast available globally
    window.toast = toast;
    window.Sonner = Sonner;
    
    // Chart component (generic wrapper)
    const Chart = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'chart',
        className: ('w-full ' + className).trim(),
        ...props
      }, children);
    };
    
    // Chart Components for Dashboard (simplified recharts-style)
    // Simple Bar Chart visualization
    const BarChart = ({ data = [], dataKey = 'value', nameKey = 'name', className = '', ...props }) => {
      if (!data || data.length === 0) {
        return React.createElement('div', {
          className: 'w-full h-64 flex items-center justify-center text-muted-foreground',
          ...props
        }, 'No data available');
      }
      
      const maxValue = Math.max(...data.map(item => item[dataKey] || 0));
      const minValue = Math.min(...data.map(item => item[dataKey] || 0));
      const range = maxValue - minValue;
      
      return React.createElement('div', {
        'data-slot': 'bar-chart',
        className: ('w-full ' + className).trim(),
        ...props
      }, [
        // Chart container
        React.createElement('div', {
          key: 'chart',
          className: 'w-full h-64 flex items-end justify-around gap-2 p-4'
        }, data.map((item, idx) => {
          const value = item[dataKey] || 0;
          const heightPercent = range > 0 ? ((value - minValue) / range) * 100 : 0;
          
          return React.createElement('div', {
            key: idx,
            className: 'flex-1 flex flex-col items-center gap-2'
          }, [
            // Bar
            React.createElement('div', {
              key: 'bar',
              className: 'w-full bg-primary rounded-t transition-all hover:bg-primary/80',
              style: { 
                height: \`\${Math.max(heightPercent, 5)}%\`,
                minHeight: '8px'
              },
              title: \`\${item[nameKey] || 'Item'}: \${value}\`
            }),
            // Label
            React.createElement('div', {
              key: 'label',
              className: 'text-xs text-muted-foreground text-center truncate w-full'
            }, item[nameKey] || idx)
          ]);
        }))
      ]);
    };
    
    // Simple Line Chart visualization
    const LineChart = ({ data = [], dataKey = 'value', nameKey = 'name', className = '', ...props }) => {
      if (!data || data.length === 0) {
        return React.createElement('div', {
          className: 'w-full h-64 flex items-center justify-center text-muted-foreground',
          ...props
        }, 'No data available');
      }
      
      const maxValue = Math.max(...data.map(item => item[dataKey] || 0));
      const minValue = Math.min(...data.map(item => item[dataKey] || 0));
      const range = maxValue - minValue;
      
      return React.createElement('div', {
        'data-slot': 'line-chart',
        className: ('w-full ' + className).trim(),
        ...props
      }, React.createElement('div', {
        className: 'w-full h-64 relative p-4'
      }, [
        // Grid lines (background)
        React.createElement('div', {
          key: 'grid',
          className: 'absolute inset-4 flex flex-col justify-between'
        }, [0, 1, 2, 3, 4].map(i => 
          React.createElement('div', {
            key: i,
            className: 'w-full border-t border-border/30'
          })
        )),
        // Line path (simplified - using connected divs)
        React.createElement('div', {
          key: 'line',
          className: 'relative h-full flex items-end justify-around'
        }, data.map((item, idx) => {
          const value = item[dataKey] || 0;
          const heightPercent = range > 0 ? ((value - minValue) / range) * 100 : 50;
          
          return React.createElement('div', {
            key: idx,
            className: 'flex-1 flex flex-col items-center gap-1'
          }, [
            // Point marker
            React.createElement('div', {
              key: 'point',
              className: 'relative w-full flex items-end',
              style: { height: '100%' }
            }, React.createElement('div', {
              className: 'w-3 h-3 bg-primary rounded-full mx-auto border-2 border-background shadow-md',
              style: { 
                marginBottom: \`\${heightPercent}%\`,
                transform: 'translateY(50%)'
              },
              title: \`\${item[nameKey] || 'Item'}: \${value}\`
            })),
            // Label
            React.createElement('div', {
              key: 'label',
              className: 'text-xs text-muted-foreground text-center truncate w-full mt-2'
            }, item[nameKey] || idx)
          ]);
        }))
      ]));
    };
    
    // Simple Area Chart (similar to line chart with filled area)
    const AreaChart = ({ data = [], dataKey = 'value', nameKey = 'name', className = '', ...props }) => {
      if (!data || data.length === 0) {
        return React.createElement('div', {
          className: 'w-full h-64 flex items-center justify-center text-muted-foreground',
          ...props
        }, 'No data available');
      }
      
      const maxValue = Math.max(...data.map(item => item[dataKey] || 0));
      const minValue = Math.min(...data.map(item => item[dataKey] || 0));
      const range = maxValue - minValue;
      
      return React.createElement('div', {
        'data-slot': 'area-chart',
        className: ('w-full ' + className).trim(),
        ...props
      }, React.createElement('div', {
        className: 'w-full h-64 relative p-4'
      }, [
        // Grid background
        React.createElement('div', {
          key: 'grid',
          className: 'absolute inset-4 flex flex-col justify-between'
        }, [0, 1, 2, 3, 4].map(i => 
          React.createElement('div', {
            key: i,
            className: 'w-full border-t border-border/30'
          })
        )),
        // Area bars
        React.createElement('div', {
          key: 'area',
          className: 'relative h-full flex items-end justify-around gap-1'
        }, data.map((item, idx) => {
          const value = item[dataKey] || 0;
          const heightPercent = range > 0 ? ((value - minValue) / range) * 100 : 0;
          
          return React.createElement('div', {
            key: idx,
            className: 'flex-1 flex flex-col items-center gap-1'
          }, [
            // Area fill
            React.createElement('div', {
              key: 'fill',
              className: 'w-full bg-gradient-to-t from-primary/40 to-primary/10 rounded-t',
              style: { 
                height: \`\${Math.max(heightPercent, 5)}%\`,
                minHeight: '4px'
              },
              title: \`\${item[nameKey] || 'Item'}: \${value}\`
            }),
            // Label
            React.createElement('div', {
              key: 'label',
              className: 'text-xs text-muted-foreground text-center truncate w-full'
            }, item[nameKey] || idx)
          ]);
        }))
      ]));
    };
    
    // Chart Card Stat - for displaying single stat with trend
    const ChartCardStat = ({ title, value, description, trend, icon, className = '', ...props }) => {
      const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
      const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-muted-foreground';
      
      return React.createElement('div', {
        'data-slot': 'chart-card-stat',
        className: ('flex flex-col gap-2 ' + className).trim(),
        ...props
      }, [
        // Header with icon
        React.createElement('div', {
          key: 'header',
          className: 'flex items-center justify-between'
        }, [
          React.createElement('span', {
            key: 'title',
            className: 'text-sm font-medium text-muted-foreground'
          }, title),
          icon && React.createElement(icon, {
            key: 'icon',
            className: 'h-4 w-4 text-muted-foreground'
          })
        ]),
        // Value
        React.createElement('div', {
          key: 'value',
          className: 'text-2xl font-bold'
        }, value),
        // Description with trend
        description && React.createElement('div', {
          key: 'description',
          className: 'flex items-center gap-1 text-xs ' + trendColor
        }, [
          TrendIcon && React.createElement(TrendIcon, {
            key: 'trend-icon',
            className: 'h-3 w-3'
          }),
          React.createElement('span', { key: 'desc' }, description)
        ])
      ]);
    };
    
    // Empty components (matching components/ui/empty.tsx)
    const Empty = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'empty',
        className: ('flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12 ' + className).trim(),
        ...props
      }, children);
    };
    
    const EmptyHeader = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'empty-header',
        className: ('flex max-w-sm flex-col items-center gap-2 text-center ' + className).trim(),
        ...props
      }, children);
    };
    
    const EmptyTitle = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'empty-title',
        className: ('text-lg font-medium tracking-tight ' + className).trim(),
        ...props
      }, children);
    };
    
    const EmptyDescription = ({ children, className = '', ...props }) => {
      return React.createElement('div', {
        'data-slot': 'empty-description',
        className: ('text-muted-foreground text-sm/relaxed ' + className).trim(),
        ...props
      }, children);
    };
    
    // Export all components to window
    // Form & Input components
    window.Input = Input;
    window.Textarea = Textarea;
    window.Label = Label;
    window.Switch = Switch;
    window.Checkbox = Checkbox;
    window.RadioGroup = RadioGroup;
    window.RadioGroupItem = RadioGroupItem;
    window.Toggle = Toggle;
    window.ToggleGroup = ToggleGroup;
    window.Slider = Slider;
    window.InputGroup = InputGroup;
    window.InputGroupAddon = InputGroupAddon;
    window.InputGroupButton = InputGroupButton;
    window.InputGroupText = InputGroupText;
    window.InputGroupTextarea = InputGroupTextarea;
    
    // Select & Tabs components
    window.Select = Select;
    window.SelectTrigger = SelectTrigger;
    window.SelectValue = SelectValue;
    window.SelectContent = SelectContent;
    window.SelectItem = SelectItem;
    window.Tabs = Tabs;
    window.TabsList = TabsList;
    window.TabsTrigger = TabsTrigger;
    window.TabsContent = TabsContent;
    
    // Table components
    window.Table = Table;
    window.TableHeader = TableHeader;
    window.TableBody = TableBody;
    window.TableRow = TableRow;
    window.TableHead = TableHead;
    window.TableCell = TableCell;
    
    // Progress & Feedback components
    window.Skeleton = Skeleton;
    window.Progress = Progress;
    
    // Dialog & Overlay components
    window.Dialog = Dialog;
    window.DialogContent = DialogContent;
    window.DialogHeader = DialogHeader;
    window.DialogTitle = DialogTitle;
    window.DialogDescription = DialogDescription;
    window.DialogFooter = DialogFooter;
    window.AlertDialog = AlertDialog;
    window.AlertDialogContent = AlertDialogContent;
    window.AlertDialogHeader = AlertDialogHeader;
    window.AlertDialogTitle = AlertDialogTitle;
    window.AlertDialogDescription = AlertDialogDescription;
    window.AlertDialogFooter = AlertDialogFooter;
    window.AlertDialogAction = AlertDialogAction;
    window.AlertDialogCancel = AlertDialogCancel;
    window.Sheet = Sheet;
    window.SheetContent = SheetContent;
    window.SheetHeader = SheetHeader;
    window.SheetTitle = SheetTitle;
    window.Drawer = Drawer;
    window.Popover = Popover;
    window.PopoverTrigger = PopoverTrigger;
    window.PopoverContent = PopoverContent;
    window.Tooltip = Tooltip;
    
    // Navigation components
    window.DropdownMenu = DropdownMenu;
    window.DropdownMenuTrigger = DropdownMenuTrigger;
    window.DropdownMenuContent = DropdownMenuContent;
    window.DropdownMenuItem = DropdownMenuItem;
    window.ContextMenu = ContextMenu;
    window.ContextMenuTrigger = ContextMenuTrigger;
    window.ContextMenuContent = ContextMenuContent;
    window.ContextMenuItem = ContextMenuItem;
    window.Breadcrumb = Breadcrumb;
    window.BreadcrumbItem = BreadcrumbItem;
    window.BreadcrumbLink = BreadcrumbLink;
    window.BreadcrumbSeparator = BreadcrumbSeparator;
    window.Command = Command;
    window.CommandInput = CommandInput;
    window.CommandList = CommandList;
    window.CommandItem = CommandItem;
    window.Sidebar = Sidebar;
    
    // Utility components
    window.Collapsible = Collapsible;
    window.CollapsibleTrigger = CollapsibleTrigger;
    window.CollapsibleContent = CollapsibleContent;
    window.Kbd = Kbd;
    window.ButtonGroup = ButtonGroup;
    window.HideOnCollapse = HideOnCollapse;
    window.AnimatedShinyText = AnimatedShinyText;
    window.Item = Item;
    window.ItemContent = ItemContent;
    window.ItemTitle = ItemTitle;
    window.ItemDescription = ItemDescription;
    window.ItemMedia = ItemMedia;
    window.ItemActions = ItemActions;
    window.Sonner = Sonner;
    
    // Chart components
    window.Chart = Chart;
    window.BarChart = BarChart;
    window.LineChart = LineChart;
    window.AreaChart = AreaChart;
    window.ChartCardStat = ChartCardStat;
    
    // Empty state components
    window.Empty = Empty;
    window.EmptyHeader = EmptyHeader;
    window.EmptyTitle = EmptyTitle;
    window.EmptyDescription = EmptyDescription;
    
    // Navbar component stub (matching components/navbar.tsx) - with working mobile menu
    const Navbar = ({ logo, logoImg, logoText = "Logo", navItems = [], rightContent, className = '', ...props }) => {
      const [isOpen, setIsOpen] = useState(false);
      
      return React.createElement('header', {
        'data-slot': 'navbar',
        className: ('sticky top-0 z-50 w-full border-b bg-background ' + className).trim(),
        ...props
      }, React.createElement('nav', {
        className: 'container mx-auto px-4 sm:px-6 lg:px-8'
      }, [
        // Desktop header
        React.createElement('div', {
          key: 'desktop-header',
          className: 'flex h-16 items-center justify-between'
        }, [
          // Logo
          React.createElement('div', { key: 'logo', className: 'flex items-center gap-2' },
            logo || (logoImg ? 
              React.createElement('img', {
                src: logoImg,
                alt: logoText || 'Logo',
                className: 'h-8 w-8 rounded-lg object-cover'
              }) :
              React.createElement('div', {
                className: 'h-8 w-8 rounded-lg bg-primary flex items-center justify-center'
              }, React.createElement('span', {
                className: 'text-primary-foreground font-bold text-lg'
              }, (logoText || 'Logo').charAt(0).toUpperCase()))
            ),
            logoText && !logo && React.createElement('span', {
              key: 'logoText',
              className: 'text-xl font-bold'
            }, logoText)
          ),
          // Desktop Navigation
          React.createElement('div', {
            key: 'desktop-nav',
            className: 'hidden md:flex items-center gap-6'
          }, navItems.map((item, idx) => 
            React.createElement('a', {
              key: idx,
              href: item.href,
              className: 'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors'
            }, item.label)
          )),
          // Right Content (Desktop)
          React.createElement('div', {
            key: 'right-content',
            className: 'hidden md:flex items-center gap-4'
          }, rightContent),
          // Mobile Menu Button
          React.createElement('div', {
            key: 'mobile-menu-button',
            className: 'flex md:hidden items-center gap-2'
          }, [
            rightContent && React.createElement('div', { key: 'mobile-right', className: 'flex items-center' }, rightContent),
            React.createElement('button', {
              key: 'toggle',
              onClick: () => setIsOpen(!isOpen),
              className: 'p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors',
              'aria-label': 'Toggle menu'
            }, isOpen ? React.createElement(X, { className: 'h-5 w-5' }) : React.createElement(Menu, { className: 'h-5 w-5' }))
          ])
        ]),
        // Mobile Menu (collapsible)
        isOpen && React.createElement('div', {
          key: 'mobile-menu',
          className: 'md:hidden border-t border-border py-4'
        }, React.createElement('div', {
          className: 'flex flex-col gap-2'
        }, navItems.map((item, idx) => 
          React.createElement('a', {
            key: idx,
            href: item.href,
            onClick: () => setIsOpen(false),
            className: 'text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 rounded-md px-3 py-2'
          }, item.label)
        )))
      ]));
    };
    window.Navbar = Navbar;
    
    // Create fallback components for common custom component names that AI might create
    // These are wrapper components that render as div or section
    const createCustomComponent = (name, defaultTag = 'div') => {
      return ({ children, className = '', ...props }) => {
        return React.createElement(defaultTag, {
          'data-component': name.toLowerCase(),
          className: className.trim(),
          ...props
        }, children);
      };
    };
    
    // Common custom components that AI might create
    const customComponents = {
      // Section-like components (render as <section>)
      'Testimonials': createCustomComponent('Testimonials', 'section'),
      'Features': createCustomComponent('Features', 'section'),
      'Hero': createCustomComponent('Hero', 'section'),
      'About': createCustomComponent('About', 'section'),
      'Contact': createCustomComponent('Contact', 'section'),
      'Pricing': createCustomComponent('Pricing', 'section'),
      'Gallery': createCustomComponent('Gallery', 'section'),
      'Portfolio': createCustomComponent('Portfolio', 'section'),
      'Services': createCustomComponent('Services', 'section'),
      'Team': createCustomComponent('Team', 'section'),
      'FAQ': createCustomComponent('FAQ', 'section'),
      'Blog': createCustomComponent('Blog', 'section'),
      'Newsletter': createCustomComponent('Newsletter', 'section'),
      'Footer': createCustomComponent('Footer', 'footer'),
      'Header': createCustomComponent('Header', 'header'),
      'Navigation': createCustomComponent('Navigation', 'nav'),
      'Nav': createCustomComponent('Nav', 'nav'),
      'CTA': createCustomComponent('CTA', 'section'),
      'Stats': createCustomComponent('Stats', 'section'),
      'Benefits': createCustomComponent('Benefits', 'section'),
      'Process': createCustomComponent('Process', 'section'),
      'Timeline': createCustomComponent('Timeline', 'section'),
      'Reviews': createCustomComponent('Reviews', 'section'),
      'Products': createCustomComponent('Products', 'section'),
      'Categories': createCustomComponent('Categories', 'section'),
      // Div-like components (render as <div>)
      'Container': createCustomComponent('Container', 'div'),
      'Wrapper': createCustomComponent('Wrapper', 'div'),
      'Grid': createCustomComponent('Grid', 'div'),
      'Flex': createCustomComponent('Flex', 'div'),
    };
    
    // Register all custom components to window
    Object.keys(customComponents).forEach(name => {
      window[name] = customComponents[name];
    });
    
    // Component code (will be transpiled by Babel)
    // Stub components (Button, Card, Badge, Image, etc.) are now available in local scope
    // Custom components (Testimonials, Features, Hero, etc.) are also available as fallbacks
    // Note: All import/export statements have been removed - use basic HTML elements styled with Tailwind
    // Babel will transpile JSX/TSX to plain JavaScript
    // Component must be accessible from global scope for rendering
    ${processedCode}
    
    // Wait for Babel to finish transpiling, then render
    // Babel processes scripts with type="text/babel" automatically
    // Use a longer delay to ensure Babel has finished processing
    setTimeout(() => {
      // Try to find and render the component
      try {
        // Check if Babel has finished transpiling
        if (typeof Babel === 'undefined') {
          throw new Error('Babel is not loaded. Please check if Babel standalone script is included.');
        }
        // Use React 18 API (createRoot) or React 17 API (render) as fallback
        const rootElement = document.getElementById('root');
        if (!rootElement) {
          throw new Error('Root element not found');
        }
        
        console.log('[react-to-html] Root element found:', rootElement);
        console.log('[react-to-html] React version:', React.version);
        console.log('[react-to-html] ReactDOM.createRoot available:', typeof ReactDOM.createRoot !== 'undefined');
        
        // Use React 17 render API for synchronous rendering (more reliable in iframe)
        // React 18 createRoot is asynchronous and may cause timing issues
        let root;
        if (ReactDOM.render) {
          // React 17 - synchronous render (more reliable)
          root = {
            render: (element) => {
              console.log('[react-to-html] Using React 17 render API (synchronous)');
              ReactDOM.render(element, rootElement);
            }
          };
          console.log('[react-to-html] Using React 17 render API');
        } else if (ReactDOM.createRoot) {
          // React 18 - fallback if React 17 not available
          root = ReactDOM.createRoot(rootElement);
          console.log('[react-to-html] Using React 18 createRoot API (async)');
        } else {
          throw new Error('Neither ReactDOM.render nor ReactDOM.createRoot is available');
        }
        
        // Look for exported component - try multiple patterns
        // Note: Babel will transpile the code and make exports available in global scope
        let Component = null;
        
        // Pattern 1: Common component names (GeneratedPage, App, Page, LandingPage, etc.)
        const commonNames = ['GeneratedPage', 'App', 'Page', 'LandingPage', 'HomePage', 'Website'];
        for (const name of commonNames) {
          if (typeof window[name] !== 'undefined') {
            Component = window[name];
            break;
          }
        }
        
        // Pattern 2: Use componentName that was extracted earlier
        if (!Component && ${JSON.stringify(componentName)}) {
          const name = ${JSON.stringify(componentName)};
          if (typeof window[name] !== 'undefined') {
            Component = window[name];
            console.log('[react-to-html] Found component via extracted name:', name);
          }
        }
        
        // Pattern 3: Extract function name from code (fallback)
        // Use RegExp constructor to avoid Babel transpilation issues with regex literals
        if (!Component) {
          const codeStr = ${JSON.stringify(componentBody)};
          try {
            const defaultExportPattern = new RegExp('export\\\\s+default\\\\s+function\\\\s+(\\\\w+)');
            const defaultExportMatch = codeStr.match(defaultExportPattern);
            if (defaultExportMatch && defaultExportMatch[1]) {
              const funcName = defaultExportMatch[1];
              if (typeof window[funcName] !== 'undefined') {
                Component = window[funcName];
                console.log('[react-to-html] Found component via export default function:', funcName);
              }
            }
          } catch (e) {
            console.warn('[react-to-html] Error in Pattern 3:', e);
          }
        }
        
        // Pattern 4: Look for arrow function export (const ComponentName = () => ...)
        if (!Component) {
          const codeStr = ${JSON.stringify(componentBody)};
          try {
            const arrowPattern = new RegExp('export\\\\s+default\\\\s+(?:const|let|var)\\\\s+(\\\\w+)\\\\s*=');
            const arrowFunctionMatch = codeStr.match(arrowPattern);
            if (arrowFunctionMatch && arrowFunctionMatch[1]) {
              const varName = arrowFunctionMatch[1];
              if (typeof window[varName] !== 'undefined') {
                Component = window[varName];
                console.log('[react-to-html] Found component via export default const:', varName);
              }
            }
          } catch (e) {
            console.warn('[react-to-html] Error in Pattern 4:', e);
          }
        }
        
        // Pattern 5: Try to find any function/const that might be the component
        // Use pure string manipulation to avoid Babel regex issues
        if (!Component) {
          const codeStr = ${JSON.stringify(componentBody)};
          try {
            // Simple string search for "function " followed by word characters
            const funcIndex = codeStr.indexOf('function ');
            if (funcIndex >= 0) {
              const afterFunc = codeStr.substring(funcIndex + 9);
              // Extract function name manually (word characters only: a-z, A-Z, 0-9, _)
              let funcName = '';
              for (let i = 0; i < afterFunc.length; i++) {
                const char = afterFunc[i];
                if ((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || (char >= '0' && char <= '9') || char === '_') {
                  funcName += char;
                } else {
                  break;
                }
              }
              if (funcName && typeof window[funcName] !== 'undefined' && typeof window[funcName] === 'function') {
                Component = window[funcName];
                console.log('[react-to-html] Found component via function declaration:', funcName);
              }
            }
          } catch (e) {
            console.warn('[react-to-html] Error in Pattern 5:', e);
          }
        }
        
        // Pattern 6: Debug - log all window properties that are functions
        if (!Component) {
          console.warn('[react-to-html] Component not found. Available window functions:', 
            Object.keys(window).filter(k => typeof window[k] === 'function' && k[0] === k[0].toUpperCase())
          );
        }
        
        if (Component) {
          console.log('[react-to-html] Rendering component:', Component.name || 'Anonymous', {
            componentType: typeof Component,
            isFunction: typeof Component === 'function',
            componentKeys: Object.keys(Component),
            componentPrototype: Component.prototype ? Object.keys(Component.prototype) : 'no prototype'
          });
          try {
            console.log('[react-to-html] Creating React element...');
            
            // Create element directly - React 17 render will catch errors
            // ErrorBoundary in function component doesn't catch errors, need class component
            // For now, just render directly and let React handle errors
            const element = React.createElement(Component);
            console.log('[react-to-html] Created React element:', {
              type: element.type,
              props: element.props,
              key: element.key
            });
            console.log('[react-to-html] Calling root.render...');
            
            // Use flushSync if available to ensure synchronous rendering
            root.render(element);
            console.log('[react-to-html] Component rendered successfully');
            
            // Force Tailwind CDN to reprocess styles by triggering MutationObserver
            // Since __tailwindRefresh is not available in CDN, we force a DOM mutation
            const forceTailwindRefresh = () => {
              try {
                // Method 1: Add and remove a dummy element to trigger Tailwind's MutationObserver
                const dummy = document.createElement('div');
                dummy.className = 'bg-primary text-foreground'; // Classes that need processing
                document.body.appendChild(dummy);
                setTimeout(() => {
                  document.body.removeChild(dummy);
                  console.log('[react-to-html] Triggered Tailwind CDN refresh via DOM mutation');
                }, 10);
                
                // Method 2: Force reflow by accessing offsetHeight
                const rootEl = document.getElementById('root');
                if (rootEl) {
                  void rootEl.offsetHeight; // Force reflow
                }
                
                console.log('[react-to-html] Forced browser reflow to apply Tailwind styles');
              } catch (e) {
                console.warn('[react-to-html] Could not force Tailwind refresh:', e);
              }
            };
            
            // Trigger multiple times to ensure styles are applied
            setTimeout(forceTailwindRefresh, 50);
            setTimeout(forceTailwindRefresh, 200);
            setTimeout(forceTailwindRefresh, 500);
            
            // Check if root element has content after render - check multiple times
            const checkRender = (attempt = 1) => {
              const rootEl = document.getElementById('root');
              if (rootEl) {
                const hasContent = rootEl.innerHTML.length > 0 || rootEl.children.length > 0;
                console.log('[react-to-html] Root element check (attempt ' + attempt + '):', {
                  innerHTML: rootEl.innerHTML.substring(0, 200),
                  childrenCount: rootEl.children.length,
                  hasContent: hasContent,
                  firstChild: rootEl.firstChild ? rootEl.firstChild.tagName : 'none'
                });
                
                if (!hasContent && attempt < 5) {
                  // Retry check after delay
                  setTimeout(() => checkRender(attempt + 1), 100);
                } else if (!hasContent) {
                  console.error('[react-to-html] Root element is still empty after multiple checks!');
                  console.error('[react-to-html] Component function:', Component.toString().substring(0, 500));
                  // Try direct DOM manipulation as fallback
                  try {
                    const testDiv = document.createElement('div');
                    testDiv.innerHTML = '<p>Test content</p>';
                    rootEl.appendChild(testDiv);
                    console.log('[react-to-html] Test DOM manipulation worked');
                  } catch (e) {
                    console.error('[react-to-html] DOM manipulation also failed:', e);
                  }
                }
              }
            };
            
            // Check immediately and after delays
            setTimeout(() => checkRender(1), 50);
            setTimeout(() => checkRender(2), 200);
            setTimeout(() => checkRender(3), 500);
          } catch (renderError) {
            console.error('[react-to-html] Error during render:', renderError);
            console.error('[react-to-html] Error stack:', renderError.stack);
            const rootEl = document.getElementById('root');
            if (rootEl) {
              rootEl.innerHTML = '<div class="p-4 text-center text-destructive">Error rendering component: ' + renderError.message + '<br><small>Check console for details</small></div>';
            }
          }
        } else {
          const errorMsg = 'Component not found. Available window functions: ' + 
            Object.keys(window).filter(k => typeof window[k] === 'function' && k[0] === k[0].toUpperCase()).join(', ');
          root.render(React.createElement('div', { 
            className: 'p-4 text-center text-muted-foreground' 
          }, errorMsg));
          console.error('[react-to-html] Component not found. Code preview:', ${JSON.stringify(processedCode.substring(0, 300))});
        }
      } catch (error) {
        const rootEl = document.getElementById('root');
        if (rootEl) {
          rootEl.innerHTML = '<div class="p-4 text-center text-destructive">Error rendering component: ' + error.message + '<br><small>Check console for details</small></div>';
        }
        console.error('Render error:', error);
        console.error('Processed code (first 500 chars):', ${JSON.stringify(processedCode.substring(0, 500))});
      }
    }, 500); // Longer delay to ensure Babel has finished transpiling
    
    // Also try to render immediately if Babel is already done
    // This helps with faster rendering
    if (typeof Babel !== 'undefined' && Babel.transform) {
      setTimeout(() => {
        const rootEl = document.getElementById('root');
        if (rootEl && rootEl.innerHTML === '') {
          // Root is still empty, try to find and render component again
          const componentName = ${JSON.stringify(componentName)};
          if (componentName && typeof window[componentName] !== 'undefined') {
            console.log('[react-to-html] Retry render after Babel completion');
            try {
              const root = ReactDOM.createRoot ? ReactDOM.createRoot(rootEl) : { render: (el) => ReactDOM.render(el, rootEl) };
              root.render(React.createElement(window[componentName]));
            } catch (e) {
              console.error('[react-to-html] Retry render error:', e);
            }
          }
        }
      }, 100);
    }
  </script>
</body>
</html>`.trim()

    return html
  } catch (error) {
    console.error('Error rendering React component:', error)
    throw new Error(
      error instanceof Error 
        ? `Failed to render component: ${error.message}` 
        : 'Failed to render component'
    )
  }
}

