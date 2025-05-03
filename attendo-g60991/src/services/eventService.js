import { supabase } from '@/supabase'

export async function fetchEvents(sessionCompoId) {
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .eq('session_compo', sessionCompoId)
    .order('id')

  if (error) throw error
  return data
}

export async function createEvent(sessionCompoId, label) {
  const { data, error } = await supabase
    .from('event')
    .insert([{ session_compo: parseInt(sessionCompoId), label }])
    .select()

  if (error) throw error
  return data[0]
}
