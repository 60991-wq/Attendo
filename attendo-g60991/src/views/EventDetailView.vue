<template>
    <div class="p-6 space-y-6">
      <!-- Fil d'Ariane -->
      <Breadcrumb :items="[
        { label: 'Accueil', link: '/' },
        { label: 'Sessions', link: '/sessions' },
        { label: sessionLabel, link: `/sessions/${sessionId}` },
        { label: ueId, link: `/sessions/${sessionId}/ue/${ueId}` },
        { label: event?.label || 'Épreuve' }
      ]" />
  
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center my-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
  
      <!-- Détail de l'épreuve -->
      <template v-else-if="event">
        <h1 class="text-2xl font-bold">
          <span class="text-fuchsia-600">{{ event.label }}</span> – {{ ueId }} ({{ sessionLabel }})
        </h1>
  
        <!-- Locaux assignés -->
        <div class="bg-white shadow-sm rounded-lg overflow-hidden">
          <div class="bg-gray-900 text-white px-4 py-3 font-medium">
            Locaux assignés à cette épreuve
          </div>
          <div class="p-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div
                v-for="room in rooms"
                :key="room.id"
                class="border rounded-md p-4 hover:bg-gray-50 cursor-pointer"
                @click="navigateToRoom(room)"
              >
                <h3 class="font-medium">{{ room.room_info.label }}</h3>
                <p class="text-sm text-gray-500">Capacité : {{ room.room_info.capacity }}</p>
                <p class="text-sm mt-1"><span class="font-medium">Surveillant :</span> {{ room.supervisor || 'Non assigné' }}</p>
              </div>
              <div v-if="rooms.length === 0" class="col-span-full p-4 text-center text-gray-500">
                Aucun local assigné à cette épreuve.
              </div>
            </div>
          </div>
        </div>
  
        <!-- Ajouter un local -->
        <div class="mt-6 bg-white shadow-sm rounded-lg overflow-hidden">
          <div class="bg-gray-100 px-4 py-3 font-medium border-b">
            Ajouter un local
          </div>
          <div class="p-4">
            <div class="flex flex-col sm:flex-row gap-3">
              <BaseSelect
                v-model="selectedRoomId"
                :options="availableRoomsOptions"
                placeholder="Choisissez un local"
                :disabled="formLoading || availableRooms.length === 0"
                class="flex-grow"
              />
              <BaseButton
                @click="handleAssignRoom"
                :disabled="!selectedRoomId || formLoading"
                :loading="formLoading"
                variant="light"
              >
                Assigner ce local
              </BaseButton>
            </div>
            <p v-if="availableRooms.length === 0" class="text-sm text-gray-500 mt-2">
              Tous les locaux sont déjà assignés.
            </p>
          </div>
        </div>
      </template>
  
      <!-- Erreur -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script>
  import Breadcrumb from '@/components/layout/Breadcrumb.vue'
  import BaseButton from '@/components/ui/BaseButton.vue'
  import BaseSelect from '@/components/ui/BaseSelect.vue'
  import {
    fetchEventDetails,
    fetchRoomsForEvent,
    fetchAvailableRooms,
    assignRoomToEvent
  } from '@/services/events.js'
  import { supabase } from '@/supabase'
  
  export default {
    components: {
      Breadcrumb,
      BaseButton,
      BaseSelect
    },
  
    data() {
      return {
        sessionId: this.$route.params.sessionId,
        ueId: this.$route.params.ueId,
        eventId: this.$route.params.eventId,
  
        sessionLabel: '',
        event: null,
        rooms: [],
        availableRooms: [],
        selectedRoomId: '',
        loading: true,
        formLoading: false,
        error: null
      }
    },
  
    computed: {
      availableRoomsOptions() {
        return this.availableRooms.map(r => ({
          value: r.id,
          label: `${r.label} (${r.capacity} places)`
        }))
      }
    },
  
    async created() {
      await this.loadData()
    },
  
    methods: {
      async loadData() {
        this.loading = true
        this.error = null
  
        try {
          const sessionRes = await supabase.from('session').select('label').eq('id', this.sessionId).single()
          if (sessionRes.error) throw sessionRes.error
          this.sessionLabel = sessionRes.data.label
  
          this.event = await fetchEventDetails(this.eventId)
          this.rooms = await fetchRoomsForEvent(this.eventId)
          this.availableRooms = await fetchAvailableRooms(this.eventId)
  
        } catch (e) {
          console.error(e)
          this.error = 'Impossible de charger les données.'
        } finally {
          this.loading = false
        }
      },
  
      async handleAssignRoom() {
        if (!this.selectedRoomId) return
        this.formLoading = true
  
        try {
          await assignRoomToEvent(this.eventId, this.selectedRoomId)
          this.selectedRoomId = ''
          await this.loadData()
        } catch (e) {
          alert('Erreur lors de l’assignation du local.')
        } finally {
          this.formLoading = false
        }
      },
  
      navigateToRoom(room) {
        this.$router.push({
          name: 'room-detail',
          params: {
            sessionId: this.sessionId,
            ueId: this.ueId,
            eventId: this.eventId,
            roomId: room.id
          }
        })
      }
    }
  }
  </script>
  