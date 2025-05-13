import { supabase } from '@/supabase'

export async function fetchSessions() {
  try {
    const result = await supabase
      .from('session')
      .select('*')
      .order('id', { ascending: true })
    
    if (result.error) throw result.error
    
    return result.data
  } catch (error) {

    console.error("Erreur lors de la récupération des sessions:", error)
    throw error
  }
}

export async function createSession(session) {
  try {
    const result = await supabase
      .from('session')
      .insert([session])
    
    if (result.error) throw result.error
    
    return result.data
  } catch (error) {
    console.error("Erreur lors de la création de la session:", error)
    throw error
  }
}