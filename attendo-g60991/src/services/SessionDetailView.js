import { supabase } from '@/supabase'

// 🔹 Charger le label d'une session
export async function fetchSessionLabel(sessionId) {
  const { data, error } = await supabase
    .from('session')
    .select('label')
    .eq('id', sessionId)
    .single()

  if (error) throw error
  return data.label
}

// 🔹 Charger les UEs associées à une session (table session_compo)
export async function fetchSessionCompos(sessionId) {
  const { data, error } = await supabase
    .from('session_compo')
    .select('ue')
    .eq('session', sessionId)

  if (error) throw error
  return data
}

// 🔹 Charger toutes les UEs existantes
export async function fetchAllUEs() {
  const { data, error } = await supabase
    .from('ue')
    .select('*')

  if (error) throw error
  return data
}

// 🔹 Ajouter une UE à une session
export async function addUEToSession(sessionId, ueCode) {
  const { error } = await supabase
    .from('session_compo')
    .insert([{ session: sessionId, ue: ueCode }])

  if (error) throw error
}
