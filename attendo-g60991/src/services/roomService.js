// services/roomService.js
import { supabase } from '@/supabase'

// Tous les locaux
export async function fetchAllRooms() {
  const { data, error } = await supabase.from('room').select('*')
  if (error) throw error
  return data
}

// Locaux déjà affectés à un event
export async function fetchRoomsForEvent(eventId) {
  const { data, error } = await supabase
    .from('examination_room')
    .select('room:room(label, capacity)')
    .eq('event', eventId)

  if (error) throw error
  return data
}
