import { supabase } from '@/supabase'

export async function fetchUsedRooms(eventId) {
  try {
    const result = await supabase
      .from('examination_room')
      .select('room, supervisor')
      .eq('event', eventId)

    if (result.error) throw result.error

    return result.data
  } catch (error) {

    console.error("Erreur lors de la récupération des locaux utilisés:", error)
    throw error
  }
}

export async function assignRoomToEvent(eventId, roomLabel) {
  try {
    const result = await supabase
      .from('examination_room')
      .insert([{ event: eventId, room: roomLabel }])

    if (result.error) throw result.error
  } catch (error) {
    console.error("Erreur lors de l'assignation du local à l'événement:", error)
    throw error
  }
}
