<script>
import { supabase } from '@/supabase'

export default {
  props: {
    presentCount: {
      type: Number,
      default: 0
    },
    label: {
      type: String,
      required: true
    },
    eventId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      currentCount: this.presentCount || 0,
      supervisor: ''
    }
  },
  methods: {
    async loadRoomData() {
      const { data: roomData, error: errRoom } = await supabase
        .from('examination_room')
        .select('id, supervisor')
        .eq('room', this.label)
        .eq('event', this.eventId)
        .single()
      
      if (errRoom || !roomData) return
      
      this.supervisor = roomData.supervisor || ''
      const roomId = roomData.id
      
      const { count, error: errCount } = await supabase
        .from('examination')
        .select('*', { count: 'exact', head: true })
        .eq('examination_room', roomId)
      
      if (!errCount) {
        this.currentCount = count || 0
      }
    }
  },
  mounted() {
    this.loadRoomData()
  },
  watch: {
    label() {
      this.loadRoomData()
    },
    eventId() {
      this.loadRoomData()
    }
  }
}
</script>