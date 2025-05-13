import { supabase } from '@/supabase'

export async function fetchStudentsForRoomPresence(eventId, roomLabel, ue) {
  try {
    const result1 = await supabase
      .from('pae')
      .select('student_id, group, student:student_id ( firstname, lastname )')
      .eq('ue', ue)

    if (result1.error) throw result1.error
    const allStudents = result1.data
    
    if (!allStudents || allStudents.length === 0) return []

    const result2 = await supabase
      .from('examination_room')
      .select('id')
      .eq('event', eventId)
      .eq('room', roomLabel)
      .single()

    if (result2.error) throw result2.error
    const examRoom = result2.data
    
    if (!examRoom) return []

    const result3 = await supabase
      .from('examination')
      .select('student')
      .eq('examination_room', examRoom.id)

    if (result3.error) throw result3.error
    const presentList = result3.data

    const presentIds = presentList.map(p => p.student)

    return allStudents.map(s => ({
      matricule: s.student_id,
      group: s.group,
      nom: s.student?.lastname || '',
      prénom: s.student?.firstname || '',
      present: presentIds.includes(s.student_id)
    }))
    
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants pour la présence:", error)
    throw error
  }
}