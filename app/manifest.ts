import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI Pedia | The AI Society at ASU',
    short_name: 'ML Viz',
    description: 'Master artificial intelligence through interactive visualizations and hands-on projects. Join ASU\'s premier AI learning platform powered by The AI Society.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#8b5cf6',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/logo.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['education', 'productivity', 'utilities'],
    screenshots: [],
  }
}
