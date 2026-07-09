export const runtime = 'edge';

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getAllAlumni } from '@/lib/partners'

export const metadata = { title: 'Alumni | GSF Admin' }

export default async function AdminAlumniPage() {
  const alumni = await getAllAlumni().catch(() => [])
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold text-gray-900">Alumni</h1>
          <p className="text-gray-500 text-sm mt-1">{alumni.length} ancien{alumni.length > 1 ? 's' : ''} joueur{alumni.length > 1 ? 's' : ''}</p></div>
        <Link href="/admin/alumni/new" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition">
          <Plus size={16}/>Nouvel alumni
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {alumni.length === 0 ? (
          <div className="text-center py-16 text-gray-400"><p>Aucun alumni enregistré.</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead><tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Joueur</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Club actuel</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Période GSF</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
              <th className="px-4 py-3"/>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {alumni.map(a => (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {a.photo_url ? <img src={a.photo_url} alt="" className="w-8 h-8 rounded-full object-cover"/> : <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700">{a.name[0]}</div>}
                      <div>
                        <p className="font-medium text-gray-900">{a.name}</p>
                        {a.is_featured && <span className="text-xs text-yellow-600">⭐</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{a.current_club ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{a.years_at_gsf ?? '—'}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-medium ${a.show_on_website ? 'text-green-600' : 'text-gray-400'}`}>{a.show_on_website ? 'Visible' : 'Masqué'}</span></td>
                  <td className="px-4 py-3 text-right"><Link href={`/admin/alumni/${a.id}`} className="text-green-600 hover:underline text-xs font-medium">Modifier →</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
