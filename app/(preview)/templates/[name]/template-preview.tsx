'use client'

import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'

// Dynamic import semua template with client-side rendering
const LandingPage = dynamic(() => import('@/lib/templates/landing-page'), { ssr: false })
const Ecommerce = dynamic(() => import('@/lib/templates/ecommerce'), { ssr: false })
const Blog = dynamic(() => import('@/lib/templates/blog'), { ssr: false })
const Dashboard = dynamic(() => import('@/lib/templates/dashboard'), { ssr: false })
const Portfolio = dynamic(() => import('@/lib/templates/portfolio'), { ssr: false })
const Restaurant = dynamic(() => import('@/lib/templates/restaurant'), { ssr: false })

const templates = {
  'landing-page': LandingPage,
  'ecommerce': Ecommerce,
  'blog': Blog,
  'dashboard': Dashboard,
  'portfolio': Portfolio,
  'restaurant': Restaurant,
} as const

type TemplateName = keyof typeof templates

export default function TemplatePreview({ name }: { name: string }) {
  // Check if template exists
  if (!templates[name as TemplateName]) {
    notFound()
  }

  const TemplateComponent = templates[name as TemplateName]

  return (
    <div className="min-h-screen bg-background">
      <TemplateComponent />
    </div>
  )
}

