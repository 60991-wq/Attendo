// services/roomService.js
import { supabase } from '@/supabase'


export async function fetchAllRooms() {
  try {
    const result = await supabase.from('room').select('*')
    
    if (result.error) throw result.error
    
    return result.data
  } catch (error) {
    console.error("Erreur lors de la récupération de tous les locaux:", error)
    throw error
  }
}

export async function fetchRoomsForEvent(eventId) {
  try {
    const result = await supabase
      .from('examination_room')
      .select('room:room(label, capacity)')
      .eq('event', eventId)

    if (result.error) throw result.error
    return result.data
  } catch (error) {
    console.error("Erreur lors de la récupération des locaux pour l'événement:", error)
    throw error
  }
}