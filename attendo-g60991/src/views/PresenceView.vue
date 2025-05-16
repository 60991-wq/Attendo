<template>
  <div class="w-full px-6 mt-0">

  <Breadcrumb :items="breadcrumbItems" />

    <h2 class="text-xl font-bold mb-2">
      Prise de présence pour le local {{ room }}
      <span v-if="supervisor">par {{ supervisor.toUpperCase() }}</span>
    </h2>

    <AddForm
      v-model="inputSupervisor"
      icon="🧑‍🏫"
      placeholder="Nom ou acronyme"
      submitLabel="Définir le surveillant"
      @submit="updateSupervisor"
      class="mb-6"
    />

    <DataTable
      :headers="['MATRICULE', 'GROUPE', 'NOM', 'PRÉNOM']"
      :columns="['matricule', 'group', 'nom', 'prénom']"
      :rows="students"
      @row-click="togglePresence"
    />
  </div>
</template>

<script>
import DataTable from '@/components/DataTable.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { fetchStudentsForRoomPresence } from '@/services/studentService'
import { supabase } from '@/supabase'
import AddForm from '@/components/AddForm.vue'

export default {
  name: 'PresenceView',

  components: {
    DataTable,
    Breadcrumb,
    AddForm
  },

  data() {
  return {
    eventId: this.$route.params.eventId || this.$route.query.eventId,
    ue: this.$route.query.ue,
    room: this.$route.query.room,
    session: this.$route.query.session,
    sessionCompoId: this.$route.query.sessionCompoId || this.$route.params.sessionCompoId,
    students: [],
    supervisor: '',
    inputSupervisor: ''
  }
},

  computed: {
  sessionId() {
    return parseInt(this.session)
  },
  breadcrumbItems() {
    const ue = this.ue
    const sessionId = this.sessionId
    const sessionCompoId = this.sessionCompoId
    const eventId = this.eventId || ''

    return [
      { label: 'Accueil', link: '/' },
      { label: 'Sessions', link: '/sessions' },
      { label: 'Session', link: `/sessions/${sessionId}` },
      {
        label: 'UE',
        link: `/session-compo/${sessionCompoId}/events?ue=${ue}&session=${sessionId}`
      },
      {
        label: 'Épreuve',
        link: `/event/${eventId}/rooms?ue=${ue}&session=${sessionId}&sessionCompoId=${sessionCompoId}`
      },
      { label: 'Local' }
    ]
  }
},


  methods: {
    async fetchSupervisor() {
      try {
        const result = await supabase
          .from('examination_room')
          .select('supervisor')
          .eq('event', this.eventId)
          .eq('room', this.room)
          .single()

        if (!result.error && result.data) {
          this.supervisor = result.data.supervisor || ''
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du surveillant:', error)
      }
    },

   async updateSupervisor() {
  let value = this.inputSupervisor.trim()
  if (!value) return

  try {
    value = value.toUpperCase()

    const existingResult = await supabase
      .from('examination_room')
      .select('id')
      .eq('event', this.eventId)
      .eq('room', this.room)
      .single()

    if (existingResult.error) {
      console.error('Erreur récupération examination_room :', existingResult.error)
      return
    }

    if (existingResult.data) {
      await supabase
        .from('examination_room')
        .update({ supervisor: value })
        .eq('id', existingResult.data.id)
    } else {
      await supabase
        .from('examination_room')
        .insert({ event: this.eventId, room: this.room, supervisor: value })
    }

    this.inputSupervisor = ''
    await this.fetchSupervisor()

  } catch (error) {
    console.error('Erreur lors de la mise à jour du surveillant:', error)
  }
},



    async togglePresence(student) {
      try {
        student.present = !student.present

        const roomResult = await supabase
          .from('examination_room')
          .select('id')
          .eq('event', this.eventId)
          .eq('room', this.room)
          .single()

        if (roomResult.error || !roomResult.data) {
          console.error('Erreur récupération examination_room :', roomResult.error)
          return
        }

        const roomId = roomResult.data.id

        if (student.present) {
          const insertResult = await supabase.from('examination').insert({
            student: student.matricule,
            examination_room: roomId
          })

          if (insertResult.error) {
            console.error('Erreur ajout présence :', insertResult.error)
          }
        } else {
          const deleteResult = await supabase
            .from('examination')
            .delete()
            .eq('student', student.matricule)
            .eq('examination_room', roomId)

          if (deleteResult.error) {
            console.error('Erreur suppression présence :', deleteResult.error)
          }
        }
      } catch (error) {
        console.error('Erreur lors de la modification de présence:', error)
      }
    },

    async loadInitialData() {
      try {
        const studentsResult = await fetchStudentsForRoomPresence(this.eventId, this.room, this.ue)
        this.students = studentsResult
        await this.fetchSupervisor()
      } catch (error) {
        console.error('Erreur lors du chargement initial:', error)
      }
    }
  },

  mounted() {
  if (!this.eventId || !this.room || !this.ue || !this.sessionCompoId) {
    alert("Paramètres requis manquants. Redirection...");
    this.$router.push("/sessions");
    return;
  }

  this.loadInitialData();
}

}
</script>
