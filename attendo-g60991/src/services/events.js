import { supabase } from '@/supabase'

/**
 * Récupère toutes les épreuves pour une UE dans une session donnée
 */
export const fetchEventsForUe = async (sessionId, ueId) => {
  const ueValue = typeof ueId === 'object' ? ueId.ue || ueId.id || '' : ueId

  const { data: compo, error: compoError } = await supabase
    .from('session_compo')
    .select('id')
    .eq('session', sessionId)
    .eq('ue', ueValue)
    .single()

  if (compoError) throw compoError
  if (!compo) throw new Error('Aucune session_compo trouvée pour cette session et cette UE.')

  const { data, error } = await supabase
    .from('event')
    .select('*')
    .eq('session_compo', compo.id)
    .order('label')

  if (error) throw error
  return data
}

/**
 * Crée une nouvelle épreuve
 */
export const createEvent = async ({ session, ue, label, completed = false }) => {
  const ueValue = typeof ue === 'object' ? ue.ue || ue.id || '' : ue

  const { data: compo, error: compoError } = await supabase
    .from('session_compo')
    .select('id')
    .eq('session', session)
    .eq('ue', ueValue)
    .single()

  if (compoError) throw compoError
  if (!compo) throw new Error('Aucune session_compo trouvée pour cette session et cette UE.')

  const { data, error } = await supabase
    .from('event')
    .insert([{ label, completed, session_compo: compo.id }])

  if (error) throw error
  return data[0]
}

/**
 * Récupère les détails d'une épreuve
 */
export const fetchEventDetails = async (eventId) => {
  const { data, error } = await supabase
    .from('event')
    .select('*')
    .eq('id', eventId)
    .single()

  if (error) throw error
  return data
}

/**
 * Récupère les locaux assignés à une épreuve
 */
export const fetchRoomsForEvent = async (eventId) => {
  const { data, error } = await supabase
    .from('examination_room')
    .select(`
      id,
      room,
      supervisor,
      room_info:room (id, label, capacity)
    `)
    .eq('event', eventId)

  if (error) throw error
  return data
}

/**
 * Récupère les locaux disponibles (non assignés)
 */
export const fetchAvailableRooms = async (eventId) => {
  const { data: assigned, error: err1 } = await supabase
    .from('examination_room')
    .select('room')
    .eq('event', eventId)

  if (err1) throw err1

  const assignedIds = assigned.map(r => `'${r.room}'`)
  const condition = assignedIds.length ? `(${assignedIds.join(',')})` : '(NULL)'

  const { data, error } = await supabase
    .from('room')
    .select('*')
    .not('id', 'in', condition)
    .order('label')

  if (error) throw error
  return data
}

/**
 * Assigne un local à une épreuve
 */
export const assignRoomToEvent = async (eventId, roomId, supervisor = null) => {
  const { data, error } = await supabase
    .from('examination_room')
    .insert([{ event: eventId, room: roomId, supervisor }])

  if (error) throw error
  return data[0]
}

/**
 * Met à jour un surveillant
 */
export const updateSupervisor = async (examinationRoomId, supervisor) => {
  const { data, error } = await supabase
    .from('examination_room')
    .update({ supervisor })
    .eq('id', examinationRoomId)

  if (error) throw error
  return data[0]
}
