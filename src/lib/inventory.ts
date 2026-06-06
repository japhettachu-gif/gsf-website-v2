import { createClient } from '@/lib/supabase/client'
import { createServerClient } from '@/lib/supabase/server'
import type { InventoryItem, EquipmentRequest } from '@/types/inventory'

// ─── INVENTORY ───────────────────────────────────────────────────────────────

export async function getAllItems(): Promise<InventoryItem[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('category')
    .order('name_fr')
  if (error) throw error
  return data ?? []
}

export async function getItemById(id: string): Promise<InventoryItem | null> {
  const supabase = createServerClient()
  const { data } = await supabase.from('inventory_items').select('*').eq('id', id).single()
  return data
}

export async function getLowStockItems(): Promise<InventoryItem[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .not('reorder_threshold', 'is', null)
    .filter('quantity_available', 'lte', 'reorder_threshold')
  if (error) throw error
  return data ?? []
}

export async function createItem(payload: Partial<InventoryItem>): Promise<InventoryItem> {
  const supabase = createClient()
  const { data, error } = await supabase.from('inventory_items').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateItem(id: string, payload: Partial<InventoryItem>): Promise<InventoryItem> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('inventory_items')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteItem(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('inventory_items').delete().eq('id', id)
  if (error) throw error
}

// ─── EQUIPMENT REQUESTS ──────────────────────────────────────────────────────

export async function getAllRequests(): Promise<EquipmentRequest[]> {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('equipment_requests')
    .select('*, item:inventory_items(id, name_fr, quantity_available)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createRequest(payload: Partial<EquipmentRequest>): Promise<EquipmentRequest> {
  const supabase = createClient()
  const { data, error } = await supabase.from('equipment_requests').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateRequestStatus(
  id: string,
  status: EquipmentRequest['status'],
  reviewedBy: string,
  notes?: string
): Promise<EquipmentRequest> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('equipment_requests')
    .update({
      status,
      reviewed_by: reviewedBy,
      review_notes: notes ?? null,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id).select().single()
  if (error) throw error
  return data
}

// ─── STATS ───────────────────────────────────────────────────────────────────

export async function getInventoryStats() {
  const supabase = createServerClient()
  const { data } = await supabase.from('inventory_items').select('category, quantity_total, quantity_available, unit_price_xaf, status')
  const items = data ?? []
  return {
    totalItems: items.length,
    totalStock: items.reduce((s, i) => s + i.quantity_total, 0),
    availableStock: items.reduce((s, i) => s + i.quantity_available, 0),
    totalValue: items.reduce((s, i) => s + ((i.unit_price_xaf ?? 0) * i.quantity_total), 0),
    lowStock: items.filter(i => i.quantity_available === 0).length,
  }
}
