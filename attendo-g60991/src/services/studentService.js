import { supabase } from '@/supabase'

export async function fetchStudentsForRoomPresence(eventId, roomLabel, ue) {
  // Récupérer tous les étudiants inscrits à cette UE
  const { data: allStudents, error: err1 } = await supabase
    .from('pae')
    .select('student_id, group, student:student_id ( firstname, lastname )')
    .eq('ue', ue)

  if (err1) throw err1
  if (!allStudents || allStudents.length === 0) return []

  // Récupérer l'ID de la salle d'examen liée à l'event et la room
  const { data: examRoom, error: err2 } = await supabase
    .from('examination_room')
    .select('id')
    .eq('event', eventId)
    .eq('room', roomLabel)
    .single()

  if (err2) throw err2
  if (!examRoom) return []

  // Récupérer la liste des étudiants marqués comme présents
  const { data: presentList, error: err3 } = await supabase
    .from('examination')
    .select('student')
    .eq('examination_room', examRoom.id)

  if (err3) throw err3

  const presentIds = presentList.map(p => p.student)

  // Construire l'objet final pour la table
  return allStudents.map(s => ({
    matricule: s.student_id,
    group: s.group,
    nom: s.student?.lastname || '',
    prénom: s.student?.firstname || '',
    present: presentIds.includes(s.student_id)
  }))
}
