import { supabase } from '@/services/SupabaseClient'

export const fetchSessionCompoId = async (sessionId, ueCode) => {
  const { data, error } = await supabase
    .from('session_compo')
    .select('id')
    .eq('session', sessionId)
    .eq('ue', ueCode)
    .single()

  if (error) throw error
  return data.id
}

export const fetchEvents = async (sessionCompoId) => {
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .eq('session_compo', sessionCompoId)

  if (error) throw error
  return data
}

export const createEvent = async (sessionCompoId, label) => {
  const { error } = await supabase
    .from('event')
    .insert({ label, session_compo: sessionCompoId, completed: false })

  if (error) throw error
}
