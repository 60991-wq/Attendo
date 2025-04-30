import { supabase } from '@/supabase'

// 🔹 Récupérer les UE associées à une session
export const fetchSessionUes = async (sessionId) => {
  const { data, error } = await supabase
    .from('session_compo')
    .select('ue:ue_id ( id, code )') // jointure
    .eq('session_id', sessionId)

  if (error) throw error
  return data.map(entry => entry.ue)
}

// 🔹 Récupérer toutes les UE NON liées à cette session
export const fetchAvailableUes = async (sessionId) => {
  const { data: linked, error: err1 } = await supabase
    .from('session_compo')
    .select('ue_id')
    .eq('session_id', sessionId)

  if (err1) throw err1

  const linkedIds = linked.map(u => u.ue_id)

  const { data, error } = await supabase
    .from('ue')
    .select('*')
    .not('id', 'in', `(${linkedIds.join(',') || 'null'})`)

  if (error) throw error
  return data
}

// 🔹 Associer une UE à une session
export const addUeToSession = async (sessionId, ueId) => {
  const { error } = await supabase
    .from('session_compo')
    .insert({ session_id: sessionId, ue_id: ueId })

  if (error) throw error
}
