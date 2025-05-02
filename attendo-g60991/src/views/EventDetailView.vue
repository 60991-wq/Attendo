<template>
  <div class="p-6 space-y-6">
    <!-- Fil d'Ariane -->
    <Breadcrumb :items="[
      { label: 'Accueil', link: '/' },
      { label: 'Sessions', link: '/sessions' },
      { label: sessionLabel, link: `/sessions/${sessionId}` },
      { label: ueId, link: `/sessions/${sessionId}/ue/${ueId}` },
      { label: 'Épreuve' }
    ]" />

    <h1 class="text-xl font-bold mb-4">Détails de l'épreuve</h1>

    <!-- Loader -->
    <div v-if="loading" class="flex justify-center my-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { supabase } from '@/supabase'
import Breadcrumb from '@/components/layout/Breadcrumb.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

export default {
  components: { Breadcrumb, BaseButton },
  
  data() {
    return {
      sessionId: this.$route.params.sessionId,
      ueId: this.$route.params.ueId,
      eventId: this.$route.params.eventId,
      sessionLabel: '',
      event: { label: '', completed: false },
      loading: true,
      error: ''
    }
  },
  
  async created() {
    await this.loadData()
  },
  
  methods: {
    async loadData() {
      this.loading = true
      this.error = ''
      
      try {
        await this.loadSessionDetails()
        await this.loadEventDetails()
      } catch (err) {
        console.error('Erreur chargement:', err)
      } finally {
        this.loading = false
      }
    },
    
    async loadSessionDetails() {
      try {
        const { data, error } = await supabase
          .from('session')
          .select('label')
          .eq('id', this.sessionId)
          .single()
          
        if (error) throw error
        this.sessionLabel = data.label
      } catch (err) {
        console.error('Erreur chargement session:', err)
      }
    },
    
    async loadEventDetails() {
      try {
        const { data, error } = await supabase
          .from('event')
          .select('*')
          .eq('id', this.eventId)
          .single()

        if (error) {
          this.error = "Impossible de charger les détails de l'épreuve"
          throw error
        }
        
        this.event = data
      } catch (err) {
        console.error('Erreur chargement épreuve:', err)
      }
    },
    
    goBack() {
      this.$router.push(`/sessions/${this.sessionId}/ue/${this.ueId}`)
    }
  }
}
</script>