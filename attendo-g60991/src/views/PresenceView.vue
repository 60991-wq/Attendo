<template>
  <div class="p-6">
    <!-- Fil d'Ariane -->
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
        class="bg-white text-black border border-black rounded px-4 py-1 hover:bg-gray-100"
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

<script>
import Table from '@/components/Table.vue'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { fetchStudentsForRoomPresence } from '@/services/studentService'
import { supabase } from '@/supabase'

export default {
  name: 'PresenceView',
  
  components: {
    Table,
    Breadcrumb
  },
  
  data() {
    return {
      eventId: this.$route.params.eventId,
      ue: this.$route.query.ue,
      room: this.$route.query.room,
      session: this.$route.query.session,
      
      // ✅ Données réactives
      students: [],
      supervisor: '',             
      inputSupervisor: ''         
    }
  },
  
  computed: {
    breadcrumbItems() {
      return [
        { label: 'Accueil', link: '/' },
        { label: 'Sessions', link: '/sessions' },
        { label: 'Session', link: `/sessions/${this.session}` },
        { label: 'UE', link: `/sessions/${this.session}/ue/${this.ue}` },
        { label: 'Épreuve', link: `/sessions/${this.session}/ue/${this.ue}/exam` },
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
      const value = this.inputSupervisor.trim()
      if (!value) return

      try {
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
          const updateResult = await supabase
            .from('examination_room')
            .update({ supervisor: value })
            .eq('id', existingResult.data.id)

          if (updateResult.error) {
            console.error('Erreur mise à jour surveillant :', updateResult.error)
          } else {
            alert('Surveillant mis à jour avec succès.')
            this.inputSupervisor = ''     
            await this.fetchSupervisor() 
          }
        } else {
          const insertResult = await supabase
            .from('examination_room')
            .insert({ event: this.eventId, room: this.room, supervisor: value })

          if (insertResult.error) {
            console.error('Erreur insertion surveillant :', insertResult.error)
          } else {
            alert('Surveillant défini avec succès.')
            this.inputSupervisor = ''     
            await this.fetchSupervisor()  
          }
        }
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
  
  // 📦 Chargement initial
  mounted() {
    this.loadInitialData()
  }
}
</script>