
<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/supabase'

// Valeurs réactives internes
const currentCount = ref(props.presentCount || 0)
const supervisor = ref('')

// Charger les données de la salle (superviseur et présence)
const loadRoomData = async () => {
  const { data: roomData, error: errRoom } = await supabase
    .from('examination_room')
    .select('id, supervisor')
    .eq('room', props.label)
    .eq('event', props.eventId)
    .single()

  if (errRoom || !roomData) return

  supervisor.value = roomData.supervisor || ''
  const roomId = roomData.id

  const { count, error: errCount } = await supabase
    .from('examination')
    .select('*', { count: 'exact', head: true })
    .eq('examination_room', roomId)

  if (!errCount) {
    currentCount.value = count || 0
  }
}

// Mettre à jour les infos quand label ou eventId change
onMounted(loadRoomData)
watch(() => [props.eventId, props.label], loadRoomData)
</script>
