import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://cyrruanaatqyqbmxtexk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5cnJ1YW5hYXRxeXFibXh0ZXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0OTk2OTMsImV4cCI6MjA2MTA3NTY5M30.pu8uiNRqZ0E8cs72JQQsC4KVbRQa0ygUxyFHuznCO84'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
