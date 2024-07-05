import { defineStore } from "pinia";
import axios from "axios";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart_info: [],
    cart_id: null,
    cart_items: [],
    selectedItems: [],
    totalPrice: 0,
    shippingAddress: null,
    note: '',
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
    },

    setSelectedItems(items) {
      this.selectedItems = items;
    },
    setTotalPrice(price) {
      this.totalPrice = price;
    },
    setShippingAddress(address) {
      this.shippingAddress = address;
    },
    setNote(note) {
      this.note = note;
    },
    clearOrderDetails() {
      this.selectedItems = [];
      this.totalPrice = 0;
      this.shippingAddress = null;
      this.note = '';
    },
  },
  getters: {
    watchIds: (state) => state.cart_info.map(item => item.watch_id),
    getSelectedItems: (state) => state.selectedItems,
    getTotalPrice: (state) => state.totalPrice,
    getShippingAddress: (state) => state.shippingAddress,
    getNote: (state) => state.note,
  }
});