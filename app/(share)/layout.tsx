import "./share-globals.css"

export default async function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Minimal layout without sidebar/topbar/breadcrumb for fullscreen experience
  // Removed ThemeProvider to avoid hydration mismatch
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Shared Preview</title>
      </head>
      <body className="h-full m-0 p-0 overflow-hidden" suppressHydrationWarning>
        {/* Fullscreen container - no sidebar, topbar, or breadcrumb */}
        <div className="fixed inset-0 w-screen h-screen overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}

