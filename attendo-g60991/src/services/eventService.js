import { supabase } from '@/supabase'

/**
 * Récupère tous les événements pour une session composée donnée
 */
export async function fetchEvents(sessionCompoId) {
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .eq('session_compo', sessionCompoId)
    .order('id')

  if (error) throw error
  return data
}

/**
 * Crée un nouvel événement dans une session composée
 */
export async function createEvent(sessionCompoId, label) {
  const { data, error } = await supabase
    .from('event')
    .insert([{ session_compo: parseInt(sessionCompoId), label }])
    .select()

  if (error) throw error
  return data[0]
}

/**
 * Marque un événement comme complété (ex: après présence terminée)
 */
export async function completeEvent(eventId) {
  const { error } = await supabase
    .from('event')
    .update({ completed: true })
    .eq('id', eventId)

  if (error) throw error
}
