import { supabase } from '@/supabase'

// 🔹 Charger le label d'une session
export async function fetchSessionLabel(sessionId) {
  try {
    const { data, error } = await supabase
      .from('session')
      .select('label')
      .eq('id', sessionId)
      .single()

    if (error) throw error
    return data.label
  } catch (error) {
    console.error("Erreur lors du chargement du label de session:", error)
    throw error
  }
}


export async function fetchSessionCompos(sessionId) {
  try {
    const { data, error } = await supabase
      .from('session_compo')
      .select('id, ue')
      .eq('session', sessionId)

    if (error) throw error
    return data
  } catch (error) {
    console.error("Erreur lors du chargement des UEs de la session:", error)
    throw error
  }
}


export async function fetchAllUEs() {
  try {
    const { data, error } = await supabase
      .from('ue')
      .select('*')

    if (error) throw error
    return data
  } catch (error) {
    console.error("Erreur lors du chargement de toutes les UEs:", error)
    throw error
  }
}


export async function addUEToSession(sessionId, ueLabel) {
  try {
    const { data, error } = await supabase
      .from('session_compo')
      .insert([{ session: sessionId, ue: ueLabel }])
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'UE à la session:", error)
    throw error
  }
}
