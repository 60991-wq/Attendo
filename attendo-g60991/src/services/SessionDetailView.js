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

// 🔹 Charger les UEs associées à une session (avec id pour redirection)
export async function fetchSessionCompos(sessionId) {
  const { data, error } = await supabase
    .from('session_compo')
    .select('id, ue')  // ✅ on récupère bien l'id ici !
    .eq('session', sessionId)

  if (error) throw error
  return data
}

// 🔹 Charger toutes les UEs disponibles
export async function fetchAllUEs() {
  const { data, error } = await supabase
    .from('ue')
    .select('*')

  if (error) throw error
  return data
}

// 🔹 Ajouter une UE à une session
export async function addUEToSession(sessionId, ueLabel) {
  const { data, error } = await supabase
    .from('session_compo')
    .insert([{ session: sessionId, ue: ueLabel }])
    .select()

  if (error) throw error
  return data[0]  // ✅ retourne bien l'objet { id, session, ue }
}
