// src/stores/user.js
import { defineStore } from 'pinia'
import { supabase } from '../supabase'

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null,
        isLoadingUser: true
    }),
    actions: {
        setUser(user) {
            this.user = user
        },
        setLoading(isLoading) {
            this.isLoadingUser = isLoading
        },

        async loadUser() {
            this.isLoadingUser = true
            const { data } = await supabase.auth.getSession()
            this.user = data.session?.user ?? null
            this.isLoadingUser = false
        },

        async signInWithGoogle() {
            await supabase.auth.signInWithOAuth({
                provider: 'google'
            })
        },

        async signOut(router) {
            await supabase.auth.signOut()
            this.user = null
            if(router) router.push('/')
        },

        setupAuthListener() {
            supabase.auth.onAuthStateChange((_event, session) => {
                this.user = session?.user ?? null


            })
        }
    }
})
