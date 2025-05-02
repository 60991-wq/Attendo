<template>
    <div class="p-6 space-y-6">
      <!-- Fil d'Ariane -->
      <div class="text-sm text-gray-500 flex items-center flex-wrap space-x-2">
        <router-link to="/" class="hover:underline">Accueil</router-link>
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <router-link to="/sessions" class="hover:underline">Sessions</router-link>
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <router-link :to="`/sessions/${sessionId}`" class="hover:underline">{{ sessionLabel }}</router-link>
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <router-link :to="`/sessions/${sessionId}/ue/${ueId}`" class="hover:underline">{{ ueId }}</router-link>
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        <span>{{ event?.label || 'Épreuve' }}</span>
      </div>
  
      <!-- Loader -->
      <div v-if="loading" class="flex justify-center my-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
  
      <template v-else-if="event">
        <h1 class="text-2xl font-bold">
          <span class="text-fuchsia-600">{{ event.label }}</span> - {{ ueId }} ({{ sessionLabel }})
        </h1>
  
        <!-- Liste des locaux assignés -->
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
                <p class="text-sm text-gray-500 mt-1">Capacité: {{ room.room_info.capacity }}</p>
                <p class="text-sm mt-2">
                  <span class="font-medium">Superviseur:</span> 
                  {{ room.supervisor || 'Non assigné' }}
                </p>
              </div>
              
              <div v-if="rooms.length === 0" class="col-span-full p-4 text-center text-gray-500">
                Aucun local assigné à cette épreuve
              </div>
            </div>
          </div>
        </div>
  
        <!-- Formulaire d'ajout de local -->
        <div class="mt-6 bg-white shadow-sm rounded-lg overflow-hidden">
          <div class="bg-gray-100 px-4 py-3 font-medium border-b">
            Ajouter un local
          </div>
          <div class="p-4">
            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
              <select 
                v-model="selectedRoomId" 
                class="border rounded px-3 py-2 flex-grow"
                :disabled="availableRooms.length === 0 || formLoading"
              >
                <option disabled value="">Choisissez un local</option>
                <option v-for="room in availableRooms" :key="room.id" :value="room.id">
                  {{ room.label }} (capacité: {{ room.capacity }})
                </option>
              </select>
              <button
                @click="handleAssignRoom"
                class="bg-white border px-4 py-2 rounded hover:bg-gray-100 text-sm"
                :disabled="!selectedRoomId || formLoading"
              >
                <span v-if="formLoading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ajout...
                </span>
                <span v-else>Assigner ce local</span>
              </button>
            </div>
            <p v-if="availableRooms.length === 0" class="mt-2 text-sm text-gray-500">
              Tous les locaux ont déjà été assignés à cette épreuve
            </p>
          </div>
        </div>
      </template>
      
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
        <p>{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase' // Utilisez votre propre import
  
  export default {
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
    
    async created() {
      await this.loadDetails()
    },
    
    methods: {
      // Charger tous les détails nécessaires
      async loadDetails() {
        this.loading = true
        this.error = null
        
        try {
          // Charger les détails de la session
          const { data: sessionData, error: sessionError } = await supabase
            .from('session')
            .select('label')
            .eq('id', this.sessionId)
            .single()
          
          if (sessionError) throw sessionError
          this.sessionLabel = sessionData.label
          
          // Charger les détails de l'épreuve
          const { data: eventData, error: eventError } = await supabase
            .from('event')
            .select('*')
            .eq('id', this.eventId)
            .single()
          
          if (eventError) throw eventError
          this.event = eventData
          
          // Charger les locaux assignés
          await this.loadAssignedRooms()
          
          // Charger les locaux disponibles
          await this.loadAvailableRooms()
          
        } catch (error) {
          console.error('Erreur lors du chargement des détails:', error)
          this.error = 'Impossible de charger les détails'
        } finally {
          this.loading = false
        }
      },
      
      // Charger les locaux assignés à cette épreuve
      async loadAssignedRooms() {
        try {
          const { data, error } = await supabase
            .from('examination_room')
            .select(`
              id,
              room,
              supervisor,
              room_info:room (id, label, capacity)
            `)
            .eq('event', this.eventId)
          
          if (error) throw error
          this.rooms = data
        } catch (error) {
          console.error('Erreur lors du chargement des locaux assignés:', error)
        }
      },
      
      // Charger les locaux disponibles (non assignés à cette épreuve)
      async loadAvailableRooms() {
        try {
          // D'abord, récupérer les locaux déjà assignés
          const { data: assignedRoomsData, error: assignedError } = await supabase
            .from('examination_room')
            .select('room')
            .eq('event', this.eventId)
          
          if (assignedError) throw assignedError
          
          // Extraire les IDs des locaux déjà assignés
          const assignedRoomIds = assignedRoomsData.map(item => item.room)
          
          // Récupérer tous les locaux si aucun n'est assigné
          if (assignedRoomIds.length === 0) {
            const { data, error } = await supabase
              .from('room')
              .select('*')
              .order('label', { ascending: true })
            
            if (error) throw error
            this.availableRooms = data
            return
          }
          
          // Sinon, récupérer les locaux non assignés
          const { data, error } = await supabase
            .from('room')
            .select('*')
            .not('id', 'in', `(${assignedRoomIds.join(',')})`)
            .order('label', { ascending: true })
          
          if (error) throw error
          this.availableRooms = data
        } catch (error) {
          console.error('Erreur lors du chargement des locaux disponibles:', error)
        }
      },
      
      // Assigner un local à cette épreuve
      async handleAssignRoom() {
        if (!this.selectedRoomId) return
        
        this.formLoading = true
        
        try {
          const { error } = await supabase
            .from('examination_room')
            .insert([{
              event: this.eventId,
              room: this.selectedRoomId,
              supervisor: null // Le superviseur sera ajouté plus tard
            }])
          
          if (error) {
            console.error('Erreur détaillée:', error)
            alert(`Impossible d'assigner le local: ${error.message}`)
            return
          }
          
          this.selectedRoomId = ''
          await this.loadAssignedRooms()
          await this.loadAvailableRooms()
          
        } catch (error) {
          console.error('Erreur lors de l\'assignation du local:', error)
          alert('Impossible d\'assigner le local')
        } finally {
          this.formLoading = false
        }
      },
      
      // Navigation vers la page de détail d'un local
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