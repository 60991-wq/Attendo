import { supabase } from '@/supabase'

/**
 * Récupère tous les événements pour une session composée donnée
 */
export async function fetchEvents(sessionCompoId) {
  try {
    const result = await supabase
      .from('event')
      .select('*')
      .eq('session_compo', sessionCompoId)
      .order('id')

  
    if (result.error) throw result.error
    
    return result.data
  } catch (error) {
    console.error("Erreur lors de la récupération des événements:", error)
    throw error
  }
}

/**
 * Crée un nouvel événement dans une session composée
 */
export async function createEvent(sessionCompoId, label) {
  try {
    const result = await supabase
      .from('event')
      .insert([{ session_compo: parseInt(sessionCompoId), label }])
      .select()

    if (result.error) throw result.error
    return result.data[0]
  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error)
    throw error
  }
}

/**
 * Marque un événement comme complété (ex: après présence terminée)
 */
export async function completeEvent(eventId) {
  try {
    const result = await supabase
      .from('event')
      .update({ completed: true })
      .eq('id', eventId)

    if (result.error) throw result.error
  } catch (error) {
    console.error("Erreur lors du marquage de l'événement comme complété:", error)
    throw error
  }
}