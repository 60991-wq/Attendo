<template>
  <div class="border rounded p-3 text-center shadow w-[100px]">
    <div class="text-lg font-bold">{{ label }}</div>

    <!-- Présence / Capacité -->
    <div class="text-xs text-gray-600">{{ presentCount }} / {{ capacity }} places</div>

    <!-- Surveillant -->
    <div class="text-sm mt-1">
      <strong>Surveillant</strong>
      <div class="text-xs">{{ supervisor || '—' }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '@/supabase'

defineProps({
  label: String,
  eventId: Number,
  capacity: Number,
  supervisor: String,
  presentCount: Number   // ✅ Ajouté ici
})

const presentCount = ref(0)

const loadPresence = async () => {
  const { data: roomData, error: errRoom } = await supabase
    .from('examination_room')
    .select('id')
    .eq('room', props.label)
    .eq('event', props.eventId)
    .single()

  if (errRoom || !roomData) return

  const roomId = roomData.id

  const { count, error: errCount } = await supabase
    .from('examination')
    .select('*', { count: 'exact', head: true })
    .eq('examination_room', roomId)

  if (!errCount) {
    presentCount.value = count || 0
  }
}

onMounted(loadPresence)

// Auto-reload si eventId ou label changent
watch(() => [props.eventId, props.label], loadPresence)
</script>
