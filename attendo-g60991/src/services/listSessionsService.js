import { supabase } from '@/supabase'

export const fetchSessions = async () => {
  const { data, error } = await supabase
    .from('session')
    .select('*')
    .order('id', { ascending: true })

  if (error) throw error
  return data
}

export const createSession = async (session) => {
    const { data, error } = await supabase
      .from('session')
      .insert([session])
  
    if (error) throw error
    return data
  }