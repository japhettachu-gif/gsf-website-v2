import { createClient } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/client'
import type { EvaluationCriteria, PlayerEvaluation, EvaluationScore, EvaluationPosition } from '@/types/evaluations'

// ─── CRITERIA ────────────────────────────────────────────────────────────────

export async function getAllCriteria(): Promise<EvaluationCriteria[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('evaluation_criteria').select('*').eq('active', true)
    .order('pillar').order('sort_order')
  if (error) throw error
  return data ?? []
}

export async function getCriteriaForPosition(position: EvaluationPosition): Promise<EvaluationCriteria[]> {
  const all = await getAllCriteria()
  return all.filter(c =>
    c.position_specific === null ||
    c.position_specific.includes(position)
  )
}

export async function createCriteria(payload: Partial<EvaluationCriteria>): Promise<EvaluationCriteria> {
  const supabase = createClient()
  const { data, error } = await supabase.from('evaluation_criteria').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateCriteria(id: string, payload: Partial<EvaluationCriteria>): Promise<EvaluationCriteria> {
  const supabase = createClient()
  const { data, error } = await supabase.from('evaluation_criteria').update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function toggleCriteria(id: string, active: boolean): Promise<void> {
  const supabase = createClient()
  await supabase.from('evaluation_criteria').update({ active }).eq('id', id)
}

// ─── EVALUATIONS ADMIN ───────────────────────────────────────────────────────

export async function getAllEvaluations(): Promise<PlayerEvaluation[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('player_evaluations')
    .select(`*, player:players(first_name, last_name, photo_url, position), coach:staff(first_name, last_name, display_name)`)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getEvaluationById(id: string): Promise<PlayerEvaluation | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('player_evaluations')
    .select(`*, player:players(id, first_name, last_name, photo_url, position), coach:staff(first_name, last_name, display_name)`)
    .eq('id', id).single()
  return data
}

export async function getEvaluationScores(evaluationId: string): Promise<EvaluationScore[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('evaluation_scores')
    .select(`*, criteria:evaluation_criteria(*)`)
    .eq('evaluation_id', evaluationId)
    .order('criteria(sort_order)')
  if (error) throw error
  return data ?? []
}

export async function createEvaluation(payload: Partial<PlayerEvaluation>): Promise<PlayerEvaluation> {
  const supabase = createClient()
  const { data, error } = await supabase.from('player_evaluations').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateEvaluation(id: string, payload: Partial<PlayerEvaluation>): Promise<PlayerEvaluation> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('player_evaluations').update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function saveEvaluationScores(
  evaluationId: string,
  scores: { criteria_id: string; rating: string; comment: string }[]
): Promise<void> {
  const supabase = createClient()
  await supabase.from('evaluation_scores').delete().eq('evaluation_id', evaluationId)
  if (scores.length === 0) return
  const { error } = await supabase.from('evaluation_scores').insert(
    scores.map(s => ({ ...s, evaluation_id: evaluationId }))
  )
  if (error) throw error
}

export async function publishEvaluation(id: string): Promise<void> {
  const supabase = createClient()
  await supabase.from('player_evaluations').update({
    status: 'published',
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('id', id)
}

// ─── PARENT PORTAL ───────────────────────────────────────────────────────────

export async function getChildrenForParent(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('parent_profiles')
    .select(`*, player:players(id, first_name, last_name, photo_url, position, status)`)
    .eq('user_id', userId)
  if (error) throw error
  return data ?? []
}

export async function getPublishedEvaluationsForPlayer(playerId: string): Promise<PlayerEvaluation[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('player_evaluations')
    .select(`*, coach:staff(first_name, last_name, display_name)`)
    .eq('player_id', playerId)
    .eq('status', 'published')
    .order('period_start', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getPlayerProgressionData(playerId: string) {
  const evals = await getPublishedEvaluationsForPlayer(playerId)
  const progressData: { period: string; scores: Record<string, number> }[] = []
  const supabase = createClient()

  for (const ev of evals.slice(0, 12)) {
    const { data: scores } = await supabase
      .from('evaluation_scores')
      .select('rating, criteria:evaluation_criteria(pillar)')
      .eq('evaluation_id', ev.id)

    const pillarScores: Record<string, number[]> = {}
    for (const s of scores ?? []) {
      const pillar = (s.criteria as { pillar: string })?.pillar
      if (!pillar) continue
      const ratingNum = { developing: 1, satisfactory: 2, good: 3, excellent: 4 }[s.rating as string] ?? 0
      if (!pillarScores[pillar]) pillarScores[pillar] = []
      pillarScores[pillar].push(ratingNum)
    }

    const averages: Record<string, number> = {}
    for (const [pillar, nums] of Object.entries(pillarScores)) {
      averages[pillar] = Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10
    }

    progressData.push({ period: ev.period_start, scores: averages })
  }

  return progressData.reverse()
}
