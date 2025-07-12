'use client'

import dynamic from 'next/dynamic'

const ArtistDashboard = dynamic(() => import('@/components/web3/artist-dashboard').then(mod => ({ default: mod.ArtistDashboard })), {
  ssr: false,
  loading: () => <div className="container mx-auto p-6"><div className="text-center">Loading Artist Platform...</div></div>
})

export default function ArtistPage() {
  return <ArtistDashboard />
}