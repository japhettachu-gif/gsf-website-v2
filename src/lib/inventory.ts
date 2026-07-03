import { createClient } from '@/lib/supabase/client'
import type { InventoryItem, EquipmentRequest } from '@/types/inventory'

export async function getAllItems(): Promise<InventoryItem[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('inventory_items')
    .select('*')
    .order('category')
    .order('name_fr')
  if (error) throw error
  return data ?? []
}

export async function getItemById(id: string): Promise<InventoryItem | null> {
  const supabase = createClient()
  const { data } = await supabase.from('inventory_items').select('*').eq('id', id).single() as unknown as { data: any | null }
  return data
}

export async function getLowStockItems(): Promise<InventoryItem[]> {
  const supabase = createClient()
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
  const { data, error } = await supabase.from('inventory_items').insert(payload as any).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function updateItem(id: string, payload: Partial<InventoryItem>): Promise<InventoryItem> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('inventory_items')
    .update({ ...payload, updated_at: new Date().toISOString() } as any)
    .eq('id', id).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function deleteItem(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('inventory_items').delete().eq('id', id)
  if (error) throw error
}

export async function getAllRequests(): Promise<EquipmentRequest[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('equipment_requests')
    .select('*, item:inventory_items(id, name_fr, quantity_available)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createRequest(payload: Partial<EquipmentRequest>): Promise<EquipmentRequest> {
  const supabase = createClient()
  const { data, error } = await supabase.from('equipment_requests').insert(payload as any).select().single() as unknown as { data: any | null, error: any | null }
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
    } as any)
    .eq('id', id).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function getInventoryStats() {
  const supabase = createClient()
  const { data } = await supabase.from('inventory_items').select('category, quantity_total, quantity_available, unit_price_xaf, status') as unknown as { data: any[] | null }
  const items = data ?? []
  return {
    totalItems: items.length,
    totalStock: items.reduce((s, i) => s + i.quantity_total, 0),
    availableStock: items.reduce((s, i) => s + i.quantity_available, 0),
    totalValue: items.reduce((s, i) => s + ((i.unit_price_xaf ?? 0) * i.quantity_total), 0),
    lowStock: items.filter(i => i.quantity_available === 0).length,
  }
}
