export const runtime = 'edge';

import Link from 'next/link'
import { Plus, Package, AlertTriangle, TrendingDown } from 'lucide-react'
import { getAllItems, getInventoryStats } from '@/lib/inventory'
import { InventoryTable } from '@/components/inventory/InventoryTable'

export const metadata = { title: 'Logistique & Matériel | GSF Admin' }

export default async function AdminInventoryPage() {
  const [items, stats] = await Promise.all([
    getAllItems().catch(() => []),
    getInventoryStats().catch(() => ({ totalItems: 0, totalStock: 0, availableStock: 0, totalValue: 0, lowStock: 0 })),
  ])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logistique & Matériel</h1>
          <p className="text-gray-500 text-sm mt-1">{stats.totalItems} articles — {stats.availableStock} unités disponibles</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/equipment-requests" className="text-sm text-green-600 hover:underline">
            Demandes de matériel →
          </Link>
          <Link href="/admin/inventory/new" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow transition">
            <Plus size={16} />Ajouter un article
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Articles référencés', value: stats.totalItems, icon: Package, color: 'text-green-700' },
          { label: 'Unités disponibles', value: stats.availableStock, icon: Package, color: 'text-blue-700' },
          { label: 'Valeur totale (XAF)', value: stats.totalValue.toLocaleString(), icon: TrendingDown, color: 'text-yellow-700' },
          { label: 'Stock épuisé', value: stats.lowStock, icon: AlertTriangle, color: stats.lowStock > 0 ? 'text-red-600' : 'text-gray-400' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Low stock alert */}
      {stats.lowStock > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
          <AlertTriangle size={16} className="text-red-500 shrink-0" />
          <p className="text-sm text-red-700">
            <strong>{stats.lowStock} article{stats.lowStock > 1 ? 's' : ''}</strong> en rupture de stock ou sous le seuil de réapprovisionnement.
          </p>
        </div>
      )}

      <InventoryTable items={items} />
    </div>
  )
}
