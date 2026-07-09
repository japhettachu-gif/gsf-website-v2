export const runtime = 'edge';

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { getMatchById, getAllCompetitions } from '@/lib/competitions'
import { MatchForm } from '@/components/competitions/MatchForm'
export const metadata = { title: 'Modifier Match | GSF Admin' }
export default async function EditMatchPage({ params }: { params: { id: string } }) {
  const [match, competitions] = await Promise.all([getMatchById(params.id), getAllCompetitions().catch(() => [])])
  if (!match) notFound()
  const title = `${match.home_team} vs ${match.away_team}`
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/matches" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14} />Matchs</Link>
        <span>/</span><span className="text-gray-900 font-medium">{title}</span>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 text-sm mt-1">Modifier le score met à jour automatiquement le résultat.</p>
      </div>
      <MatchForm match={match} competitions={competitions.map(c => ({ id: c.id, name_fr: c.name_fr }))} />
    </div>
  )
}
