export const runtime = 'edge';

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllPartners } from '@/lib/partners'
import { TIER_CONFIG } from '@/types/partners'

export const metadata = { title: 'Partenaires | GSF Admin' }

export default async function AdminPartnersPage() {
  const partners = await getAllPartners().catch(() => [])
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold text-gray-900">Partenaires</h1>
          <p className="text-gray-500 text-sm mt-1">{partners.length} partenaire{partners.length > 1 ? 's' : ''}</p></div>
        <Link href="/admin/partners/new" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition">
          <Plus size={16}/>Nouveau partenaire
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {partners.length === 0 ? (
          <div className="text-center py-16 text-gray-400"><p>Aucun partenaire.</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Nom</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Niveau</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
              <th className="px-4 py-3"/>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {partners.map(p => {
                const cfg = TIER_CONFIG[p.tier]
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.logo_url ? <img src={p.logo_url} alt="" className="w-8 h-8 object-contain rounded"/> : <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{p.name[0]}</div>}
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: cfg.bg, color: cfg.color }}>{cfg.fr}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs font-medium ${p.active ? 'text-green-600' : 'text-gray-400'}`}>{p.active ? 'Actif' : 'Inactif'}</span></td>
                    <td className="px-4 py-3 text-right"><Link href={`/admin/partners/${p.id}`} className="text-green-600 hover:underline text-xs font-medium">Modifier →</Link></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
