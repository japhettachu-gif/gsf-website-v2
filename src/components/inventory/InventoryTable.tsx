'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, AlertTriangle } from 'lucide-react'
import type { InventoryItem, ItemCategory } from '@/types/inventory'
import { CATEGORY_LABELS, CONDITION_LABELS, STATUS_LABELS } from '@/types/inventory'

interface InventoryTableProps {
  items: InventoryItem[]
}

export function InventoryTable({ items }: InventoryTableProps) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | 'all'>('all')

  const categories = Array.from(new Set(items.map(i => i.category)))

  const filtered = items.filter(item => {
    const matchSearch = item.name_fr.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === 'all' || item.category === categoryFilter
    return matchSearch && matchCategory
  })

  const isLowStock = (item: InventoryItem) =>
    item.reorder_threshold !== null && item.quantity_available <= item.reorder_threshold

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value as ItemCategory | 'all')}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">Toutes catégories</option>
          {categories.map(c => (
            <option key={c} value={c}>{CATEGORY_LABELS[c].emoji} {CATEGORY_LABELS[c].fr}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Article</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Catégorie</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Stock</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">État</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Statut</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Lieu</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">Aucun article trouvé.</td></tr>
              ) : filtered.map(item => {
                const condInfo = CONDITION_LABELS[item.condition]
                const statusInfo = STATUS_LABELS[item.status]
                const lowStock = isLowStock(item)
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{CATEGORY_LABELS[item.category].emoji}</span>
                        <div>
                          <p className="font-medium text-gray-900">{item.name_fr}</p>
                          {item.assigned_to && <p className="text-xs text-gray-400">{item.assigned_to}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{CATEGORY_LABELS[item.category].fr}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${lowStock ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.quantity_available}
                        </span>
                        <span className="text-gray-400 text-xs">/ {item.quantity_total}</span>
                        {lowStock && <AlertTriangle size={12} className="text-red-500" />}
                      </div>
                      {item.quantity_in_use > 0 && (
                        <p className="text-xs text-blue-500">{item.quantity_in_use} en utilisation</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: condInfo.color }}>
                        {condInfo.fr}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: statusInfo.color }}>
                        {statusInfo.fr}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{item.location ?? '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/admin/inventory/${item.id}`}
                        className="text-green-600 hover:text-green-800 font-medium text-xs hover:underline">
                        Modifier →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
