export const runtime = 'edge';

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getAllCompetitions } from '@/lib/competitions'
import { MatchForm } from '@/components/competitions/MatchForm'
export const metadata = { title: 'Nouveau Match | GSF Admin' }
export default async function NewMatchPage() {
  const competitions = await getAllCompetitions().catch(() => [])
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/admin/matches" className="hover:text-gray-900 flex items-center gap-1"><ChevronLeft size={14} />Matchs</Link>
        <span>/</span><span className="text-gray-900 font-medium">Nouveau match</span>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ajouter un match</h1>
        <p className="text-gray-500 text-sm mt-1">Le résultat sera automatiquement calculé depuis le score.</p>
      </div>
      <MatchForm competitions={competitions.map(c => ({ id: c.id, name_fr: c.name_fr }))} />
    </div>
  )
}
