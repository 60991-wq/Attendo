<template>
  <div class="p-6">
    <!-- Fil d’Ariane -->
    <Breadcrumb :items="breadcrumbItems" />

    <!-- Titre -->
    <h2 class="text-xl font-bold mb-2">
      Prise de présence pour le local {{ room }}
      <span v-if="supervisor">par {{ supervisor.toUpperCase() }}</span>
    </h2>

    <!-- Choix surveillant -->
    <div class="flex items-center gap-4 mb-6">
      <label class="text-gray-600">Surveillant</label>
      <input
        v-model="inputSupervisor"
        class="border px-3 py-1 rounded w-full max-w-xs"
        placeholder="Nom ou acronyme"
      />
      <button
        @click="updateSupervisor"
        class="bg-fuchsia-600 text-white px-4 py-1 rounded hover:bg-fuchsia-700"
      >
        Définir le surveillant
      </button>
    </div>

    <!-- Tableau étudiants -->
    <Table
      :headers="['MATRICULE', 'GROUPE', 'NOM', 'PRÉNOM']"
      :columns="['matricule', 'group', 'nom', 'prénom']"
      :rows="students"
      @row-click="togglePresence"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Table from '@/components/Table.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { fetchStudentsForRoomPresence } from '@/services/studentService'
import { supabase } from '@/supabase'

// 🔧 Récupération des paramètres de route
const route = useRoute()
const eventId = route.params.eventId
const ue = route.query.ue
const room = route.query.room
const session = route.query.session

// ✅ Données réactives
const students = ref([])
const supervisor = ref('')             // Pour afficher dans le titre
const inputSupervisor = ref('')        // Pour le champ input

// 📦 Chargement initial
onMounted(async () => {
  students.value = await fetchStudentsForRoomPresence(eventId, room, ue)
  await fetchSupervisor()
})

// 🧭 Fil d’ariane
const breadcrumbItems = computed(() => [
  { label: 'Accueil', link: '/' },
  { label: 'Sessions', link: '/sessions' },
  { label: 'Session', link: `/sessions/${session}` },
  { label: 'UE', link: `/sessions/${session}/ue/${ue}` },
  { label: 'Épreuve', link: `/sessions/${session}/ue/${ue}/exam` },
  { label: 'Local' }
])

// 🔄 Récupération du surveillant actuel
const fetchSupervisor = async () => {
  const { data, error } = await supabase
    .from('examination_room')
    .select('supervisor')
    .eq('event', eventId)
    .eq('room', room)
    .single()

  if (!error && data) {
    supervisor.value = data.supervisor || ''
  }
}

// ✅ Mise à jour ou insertion du surveillant
const updateSupervisor = async () => {
  const value = inputSupervisor.value.trim()
  if (!value) return

  const { data: existing, error: fetchErr } = await supabase
    .from('examination_room')
    .select('id')
    .eq('event', eventId)
    .eq('room', room)
    .single()

  if (fetchErr) {
    console.error('Erreur récupération examination_room :', fetchErr)
    return
  }

  if (existing) {
    const { error: updateErr } = await supabase
      .from('examination_room')
      .update({ supervisor: value })
      .eq('id', existing.id)

    if (updateErr) {
      console.error('Erreur mise à jour surveillant :', updateErr)
    } else {
      alert('Surveillant mis à jour avec succès.')
      inputSupervisor.value = ''     // ✅ vide l’input
      await fetchSupervisor()        // ✅ recharge le nom
    }
  } else {
    const { error: insertErr } = await supabase
      .from('examination_room')
      .insert({ event: eventId, room, supervisor: value })

    if (insertErr) {
      console.error('Erreur insertion surveillant :', insertErr)
    } else {
      alert('Surveillant défini avec succès.')
      inputSupervisor.value = ''     // ✅ vide l’input
      await fetchSupervisor()        // ✅ recharge le nom
    }
  }
}

// ✅ Prise de présence
const togglePresence = async (student) => {
  student.present = !student.present

  const { data: examRoomData, error: roomErr } = await supabase
    .from('examination_room')
    .select('id')
    .eq('event', eventId)
    .eq('room', room)
    .single()

  if (roomErr || !examRoomData) {
    console.error('Erreur récupération examination_room :', roomErr)
    return
  }

  const roomId = examRoomData.id

  if (student.present) {
    const { error } = await supabase.from('examination').insert({
      student: student.matricule,
      examination_room: roomId
    })
    if (error) console.error('Erreur ajout présence :', error)
  } else {
    const { error } = await supabase
      .from('examination')
      .delete()
      .eq('student', student.matricule)
      .eq('examination_room', roomId)

    if (error) console.error('Erreur suppression présence :', error)
  }
}
</script>
