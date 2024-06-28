import { defineStore } from "pinia";
import axios from "axios";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart_info: [],
    cart_id: null
  }),
  actions: {
    async getCart(member_id) {
      try {
        const response = await axios.get(`http://localhost:8080/member/get/carts/${member_id}`);
        this.cart_info = response.data.cart_info || [];
        this.cart_id = response.data.cart_id;
        return response.data;
      } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
      }
    }
  },
  getters: {
    watchIds: (state) => state.cart_info.map(item => item.watch_id)
  }
});