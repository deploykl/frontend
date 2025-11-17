import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    title: 'SGI - DGOS',
    user: null as any
  }),
  actions: {
    setUser(user: any) {
      this.user = user
    }
  }
})