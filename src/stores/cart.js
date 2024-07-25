import { defineStore } from "pinia";
import axios from "axios";
import { useUserStore } from "./user";

var api = import.meta.env.VITE_API_PORT
export const useCartStore = defineStore("cart", {
  state: () => ({
    cart_info: [],
    cart_id: null,
    cart_items: [],
    selectedItems: [],
    selected_wids: [],
    totalPrice: 0,
    shippingAddress: null,
    note: '',
    cart_count: 0,

  }),
  actions: {
    async getCart(member_id) {
      try {
        const response = await axios.get(`${api}/member/get/carts/${member_id}`);
        this.cart_info = response.data.cart_info || [];
        this.cart_id = response.data.cart_id;
        this.cart_count = this.cart_info.length;
        useUserStore().updateCartCount(this.cart_count);
        return response.data;
      } catch (error) {
        console.error('Error fetching cart:', error);
        throw error;
      }
    },

    setItemSelected(watchId, selected) {
      const index = this.cart_info.findIndex(item => item.watch_id === watchId);
      if (index !== -1) {
        this.cart_info[index].isSelected = selected;
      }
    },
    setSelectedItems(items) {
      this.selectedItems = items;
    },
    setTotalPrice(price) {
      this.totalPrice = price;
    },
    setShipFee(fee) {
      this.shipFee = fee;
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
    getTotalWithShipping: (state) => state.totalPrice + state.shipFee,
    getShipFee: (state) => state.totalPrice * 0.02,
    getCartCount: (state) => state.cart_count,

  }
});