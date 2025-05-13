// src/stores/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {

    state: () =>({
        user: null,
        isLoadingUser:true
    }),
    actions:{
        setUser(user){
            this.user =user
        },
        setLoading(isLoading){
            this.isLoadingUser= isLoading
        }
    }
})