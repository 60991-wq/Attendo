import { supabase } from '@/services/SupabaseClient'

// 🔹 UE déjà associées à la session
export const fetchSessionUes = async (sessionId) => {
  const { data, error } = await supabase
    .from('session_compo')
    .select('ue')
    .eq('session', sessionId)

  if (error) throw error

  // Retourne un tableau comme [{ ue: '2INT2A' }, ...]
  return data.map(entry => ({ ue: entry.ue }))
}

// 🔹 UE disponibles (non encore liées à la session)
export const fetchAvailableUes = async (sessionId) => {
  // 1. Récupérer les UEs déjà associées à la session
  const { data: linked, error: err1 } = await supabase
    .from('session_compo')
    .select('ue')
    .eq('session', sessionId)

  if (err1) throw err1

  const linkedUes = linked.map(u => u.ue) // ex: ['2INT2A', '1DEV1']

  // 2. Récupérer toutes les UEs
  const { data: allUes, error: err2 } = await supabase
    .from('ue')
    .select('ue')

  if (err2) throw err2

  // 3. Retourner celles non encore associées
  return allUes
    .filter(row => !linkedUes.includes(row.ue))
    .map(row => ({ ue: row.ue }))
}

// 🔹 Associer une UE à une session
export const addUeToSession = async (sessionId, ueCode) => {
  const { error } = await supabase
    .from('session_compo')
    .insert({ session: sessionId, ue: ueCode })

  if (error) throw error
}

// 🔹 Récupérer les détails d'une session
export const fetchSessionDetails = async (sessionId) => {
  const { data, error } = await supabase
    .from('session')
    .select('*')
    .eq('id', sessionId)
    .single()

  if (error) throw error
  return data
}
