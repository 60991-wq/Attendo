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
        <span>{{ ueId }}</span>
      </div>
  
      <h1 class="text-2xl">
        Liste des épreuves de <span class="italic text-blue-700">{{ ueId }}</span>
        (session {{ sessionLabel }})
      </h1>
  
      <div v-if="loading" class="flex justify-center my-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
  
      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="event in events"
            :key="event.id"
            class="border rounded-md p-4 hover:bg-gray-50 cursor-pointer bg-white"
            @click="navigateToEvent(event)"
          >
            <h3 class="font-medium">{{ event.label }}</h3>
            <p v-if="event.completed" class="text-green-600 text-sm mt-2">Complété</p>
            <p v-else class="text-yellow-600 text-sm mt-2">En cours</p>
          </div>
  
          <div v-if="events.length === 0" class="col-span-full p-4 text-center text-gray-500 bg-white rounded-md">
            Aucune épreuve n'est disponible pour cette UE
          </div>
        </div>
  
        <!-- Formulaire ajout épreuve -->
        <div class="mt-6 pt-4 border-t">
          <h2 class="text-lg font-semibold mb-3">Ajouter une épreuve</h2>
          <div class="flex items-center space-x-2">
            <input
              v-model="newEventLabel"
              type="text"
              placeholder="Intitulé (ex: bilan, projet, examen...)"
              class="border p-2 rounded flex-grow"
              :disabled="formLoading"
            />
            <button
              @click="handleAddEvent"
              class="border px-4 py-2 rounded hover:bg-gray-100"
              :disabled="!newEventLabel || formLoading"
            >
              <span v-if="formLoading">Traitement...</span>
              <span v-else>Créer</span>
            </button>
          </div>
          <div v-if="errorMessage" class="mt-2 text-red-600 text-sm">
            {{ errorMessage }}
          </div>
        </div>
      </template>
    </div>
  </template>
  
  <script>
  import { supabase } from '@/supabase'
  
  export default {
    data() {
      return {
        sessionId: this.$route.params.sessionId,
        ueId: this.$route.params.ueId,
        sessionLabel: '',
        sessionCompoId: null,
        events: [],
        newEventLabel: '',
        loading: true,
        formLoading: false,
        errorMessage: ''
      }
    },
  
    async created() {
      try {
        await this.loadSessionDetails()
        await this.fetchSessionCompoId()
        await this.loadEvents()
      } catch (err) {
        console.error('Erreur au chargement initial:', err)
        this.errorMessage = 'Erreur de chargement des données.'
      } finally {
        this.loading = false
      }
    },
  
    methods: {
      async loadSessionDetails() {
        const { data, error } = await supabase
          .from('session')
          .select('label')
          .eq('id', this.sessionId)
          .single()
  
        if (error) throw error
        this.sessionLabel = data.label
      },
  
      async fetchSessionCompoId() {
        const { data, error } = await supabase
          .from('session_compo')
          .select('id')
          .eq('session', this.sessionId)
          .eq('ue', this.ueId)
          .single()
  
        if (error) throw error
        this.sessionCompoId = data.id
      },
  
      async loadEvents() {
        const { data, error } = await supabase
          .from('event')
          .select('*')
          .eq('session_compo', this.sessionCompoId)
  
        if (error) throw error
        this.events = data
      },
  
      async handleAddEvent() {
        if (!this.newEventLabel.trim()) return
  
        this.formLoading = true
        this.errorMessage = ''
  
        try {
          const { error } = await supabase
            .from('event')
            .insert([{
              label: this.newEventLabel,
              session_compo: this.sessionCompoId,
              completed: false
            }])
  
          if (error) {
            this.errorMessage = `Erreur: ${error.message}`
            return
          }
  
          this.newEventLabel = ''
          await this.loadEvents()
        } catch (error) {
          this.errorMessage = 'Erreur lors de la création de l’épreuve'
          console.error(error)
        } finally {
          this.formLoading = false
        }
      },
  
      navigateToEvent(event) {
        this.$router.push({
          name: 'event-detail',
          params: {
            sessionId: this.sessionId,
            ueId: this.ueId,
            eventId: event.id
          }
        })
      }
    }
  }
  </script>
  