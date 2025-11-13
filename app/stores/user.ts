import { defineStore } from 'pinia'

export interface UserData {
  name: string
  email: string
}

export const useUserStore = defineStore('retrospective', {
  state: () => ({
    userData: null as UserData | null
  }),

  getters: {
    getName: (state) => state.userData?.name || '',
    getEmail: (state) => state.userData?.email || '',
  },

  actions: {
    setUserData(data: UserData) {
      this.userData = { ...this.userData, ...data }
    },

    updateUserData(updates: Partial<UserData>) {
      if (this.userData) {
        this.userData = { ...this.userData, ...updates }
      } else {
        this.userData = updates as UserData
      }
    },

    clearUserData() {
      this.userData = null
    }
  }
})

