import "./preview-globals.css"

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Minimal layout without sidebar/topbar/breadcrumb for fullscreen preview
  // Route group layouts cannot have <html> and <body> - only root layout can
  // This layout just wraps children in a fullscreen container
  return (
    <div className="preview-container fixed inset-0 w-screen h-screen overflow-hidden">
      {children}
    </div>
  )
}

