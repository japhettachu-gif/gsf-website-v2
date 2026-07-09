export const runtime = 'edge';

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getChildrenForParent } from '@/lib/evaluations'
import Link from 'next/link'
import { User, FileText } from 'lucide-react'

export const metadata = { title: 'Portail Parent | GSF Academy' }

export default async function ParentPortalPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const children = await getChildrenForParent(user.id).catch(() => [])

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Portail Parent</h1>
        <p className="text-gray-500 text-sm mb-8">Suivez la progression de vos enfants à la GSF Academy.</p>

        {children.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
            <User size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucun enfant associé à votre compte.</p>
            <p className="text-xs mt-1">Contactez l'administration pour lier votre compte.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {children.map((cp: any) => {
              const player = cp.player
              if (!player) return null
              return (
                <div key={cp.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {player.photo_url ? (
                      <img src={player.photo_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                        {player.first_name[0]}{player.last_name[0]}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-gray-900">{player.first_name} {player.last_name}</p>
                      <p className="text-xs text-gray-500">{player.position} · {cp.relationship ?? 'Parent'}</p>
                    </div>
                  </div>
                  <Link href={`/portal/parent/${player.id}`}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                    <FileText size={14} />Voir les rapports
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
