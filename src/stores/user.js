// @ts-check
import { defineStore  } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user_id: null,
    username: null,
    password: null,
    email: null
  }),
})

