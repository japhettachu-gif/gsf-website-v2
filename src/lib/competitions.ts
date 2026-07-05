import { createClient } from '@/lib/supabase/client'
import type { Competition, Match } from '@/types/competitions'

export async function getPublicCompetitions(): Promise<Competition[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('competitions')
    .select('*')
    .eq('show_on_website', true)
    .in('status', ['upcoming', 'ongoing', 'completed'])
    .order('is_featured', { ascending: false })
    .order('start_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getCompetitionBySlug(slug: string): Promise<Competition | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('competitions').select('*').eq('slug', slug).eq('show_on_website', true).single() as unknown as { data: any | null }
  return data
}

export async function getPublicMatchesByCompetition(competitionId: string): Promise<Match[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('competition_id', competitionId)
    .order('match_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getRecentResults(limit = 5): Promise<Match[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('matches')
    .select('*, competition:competitions(id, name_fr, name, color)')
    .eq('status', 'completed')
    .order('match_date', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getUpcomingMatches(limit = 5): Promise<Match[]> {
  const supabase = createClient()
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('matches')
    .select('*, competition:competitions(id, name_fr, name, color)')
    .eq('status', 'scheduled')
    .gte('match_date', today)
    .order('match_date', { ascending: true })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function getAllCompetitions(): Promise<Competition[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('competitions').select('*')
    .order('start_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getCompetitionById(id: string): Promise<Competition | null> {
  const supabase = createClient()
  const { data } = await supabase.from('competitions').select('*').eq('id', id).single() as unknown as { data: any | null }
  return data
}

export async function createCompetition(payload: Partial<Competition>): Promise<Competition> {
  const supabase = createClient()
  const { data, error } = await supabase.from('competitions').insert(payload as any).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function updateCompetition(id: string, payload: Partial<Competition>): Promise<Competition> {
  const supabase = createClient()
  const { data, error } = await (supabase
    .from('competitions') as any)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function deleteCompetition(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('competitions').delete().eq('id', id)
  if (error) throw error
}

export async function getAllMatches(): Promise<Match[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('matches')
    .select('*, competition:competitions(id, name_fr, name, color)')
    .order('match_date', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getMatchById(id: string): Promise<Match | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('matches').select('*, competition:competitions(*)').eq('id', id).single() as unknown as { data: any | null }
  return data
}

export async function createMatch(payload: Partial<Match>): Promise<Match> {
  const supabase = createClient()
  const { data, error } = await supabase.from('matches').insert(payload as any).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function updateMatch(id: string, payload: Partial<Match>): Promise<Match> {
  const supabase = createClient()
  const { data, error } = await (supabase
    .from('matches') as any)
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id).select().single() as unknown as { data: any | null, error: any | null }
  if (error) throw error
  return data
}

export async function deleteMatch(id: string): Promise<void> {
  const supabase = createClient()
  const { error } = await supabase.from('matches').delete().eq('id', id)
  if (error) throw error
}

function computeResult(match: Partial<Match>): 'win' | 'loss' | 'draw' | null {
  if (match.home_score === null || match.away_score === null) return null
  const gsf = match.is_home_game ? match.home_score : match.away_score
  const opp = match.is_home_game ? match.away_score : match.home_score
  if (gsf === undefined || opp === undefined) return null
  if (gsf > opp) return 'win'
  if (gsf < opp) return 'loss'
  return 'draw'
}

export async function updateMatchScore(
  id: string,
  homeScore: number,
  awayScore: number,
  isHomeGame: boolean
): Promise<Match> {
  const result = computeResult({ home_score: homeScore, away_score: awayScore, is_home_game: isHomeGame })
  return updateMatch(id, {
    home_score: homeScore,
    away_score: awayScore,
    result,
    status: 'completed',
  })
}
