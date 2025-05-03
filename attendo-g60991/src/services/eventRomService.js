import { supabase } from '@/supabase'

// 🔹 Récupère les locaux déjà utilisés pour un event
export async function fetchUsedRooms(eventId) {
  const { data, error } = await supabase
    .from('examination_room')
    .select('room')
    .eq('event', eventId)

  if (error) throw error
  return data.map(r => r.room)
}

// 🔹 Assigne un local à un event
export async function assignRoomToEvent(eventId, roomLabel) {
  const { error } = await supabase
    .from('examination_room')
    .insert([{ event: eventId, room: roomLabel }])

  if (error) throw error
}
