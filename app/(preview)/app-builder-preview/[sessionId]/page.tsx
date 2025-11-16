import { Suspense } from 'react'
import PreviewWithEditor from './preview-with-editor'

interface PreviewPageProps {
  params: Promise<{
    sessionId: string
  }>
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { sessionId } = await params

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto mb-3 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading preview...</p>
        </div>
      </div>
    }>
      <PreviewWithEditor sessionId={sessionId} />
    </Suspense>
  )
}
