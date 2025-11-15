import { getCodeFromUpstash, getPublishStatus } from "@/lib/actions/ai"
import { notFound } from "next/navigation"
import { SharePreview } from "./share-preview"

export const dynamic = 'force-dynamic'

export default async function SharePage({
  params,
}: {
  params: { sessionId: string }
}) {
  const { sessionId } = await params
  
  console.log('[SharePage] Loading session:', sessionId)
  
  // Check if published
  const isPublished = await getPublishStatus(sessionId)
  console.log('[SharePage] Publish status:', isPublished)
  
  if (!isPublished) {
    console.log('[SharePage] Not published - returning 404')
    notFound()
  }

  // Get code from Upstash
  const code = await getCodeFromUpstash(sessionId)
  console.log('[SharePage] Code retrieved:', {
    found: !!code,
    length: code?.length || 0,
    preview: code?.substring(0, 100) || 'empty'
  })
  
  if (!code) {
    console.log('[SharePage] No code found - returning 404')
    notFound()
  }

  // Pass code directly to SharePreview component
  return <SharePreview code={code} />
}


