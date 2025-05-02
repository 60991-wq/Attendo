// services/sessionService.js
import { supabase } from '@/supabase'

// Récupérer toutes les sessions
export const fetchSessions = async () => {
  const { data, error } = await supabase.from('session').select('*')
  if (error) throw error
  return data
}

// Récupérer les détails d'une session
export const fetchSessionDetails = async (sessionId) => {
  const { data, error } = await supabase
    .from('session')
    .select('*')
    .eq('id', sessionId)
    .single()
  
  if (error) throw error
  return data
}

// Récupérer les UEs d'une session
export const fetchSessionUes = async (sessionId) => {
  const { data, error } = await supabase
    .from('session_compo')
    .select('ue')
    .eq('session', sessionId)
  
  if (error) throw error
  return data.map(entry => ({ ue: entry.ue }))
}

// Récupérer les UEs disponibles pour une session
export const fetchAvailableUes = async (sessionId) => {
  // Obtenir les UEs déjà liées
  const { data: linked } = await supabase
    .from('session_compo')
    .select('ue')
    .eq('session', sessionId)
  
  // Liste des UEs déjà liées
  const linkedUes = linked.map(u => u.ue)
  
  // Récupérer toutes les UEs
  const { data } = await supabase.from('ue').select('ue')
  
  // Filtrer les UEs non liées
  return data
    .filter(item => !linkedUes.includes(item.ue))
    .map(row => ({ ue: row.ue }))
}

// Ajouter une UE à une session
export const addUeToSession = async (sessionId, ueCode) => {
  const { error } = await supabase
    .from('session_compo')
    .insert({ session: sessionId, ue: ueCode })
  
  if (error) throw error
}