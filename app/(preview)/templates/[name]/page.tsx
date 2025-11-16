import { notFound } from 'next/navigation'
import TemplatePreview from './template-preview'

const templates = {
  'landing-page': true,
  'ecommerce': true,
  'blog': true,
  'dashboard': true,
  'portfolio': true,
  'restaurant': true,
} as const

type TemplateName = keyof typeof templates

export async function generateStaticParams() {
  return Object.keys(templates).map((name) => ({
    name,
  }))
}

export async function generateMetadata() {
  return {
    title: 'Template Preview - Luminite AI',
    description: 'Preview template for Luminite AI',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  
  // Check if template exists
  if (!templates[name as TemplateName]) {
    notFound()
  }

  return <TemplatePreview name={name} />
}

