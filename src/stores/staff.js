import { defineStore } from "pinia";
import axios from "axios";
import { useUserStore } from "./user";
const api = import.meta.env.VITE_API_PORT;

export const useStaffStore = defineStore("staff", {
  state: () => ({
    unapprovedWatches: [],
    approvedWatches: [],
    deleteWatches: [],
    pendingWatches: [],
  }),
  actions: {
    async getAllWatch(state) {
      try {
        const res = await axios.get(`${api}/staff/get/watch-state/${state}`);
        const watches = res.data;
    
        if (state === 0) {
          this.unapprovedWatches = watches;
        } else if (state === 1) {
          this.approvedWatches = watches;
        } else if (state === 2) {
          this.deleteWatches = watches;
        } else if (state === 3) {
          this.pendingWatches = watches;
        }
        return watches;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    async approveWatch(watch_id) {
      console.log('Watch Approved ID:', watch_id);
      try {
        const res = await axios.patch(`${api}/staff/approve-watch?watch_id=${watch_id}`);
        console.log('Watch Approved:', res.data);
        const watchIndex = this.unapprovedWatches.findIndex(w => w.watch_id === watch_id);
        if (watchIndex !== -1) {
          const [watch] = this.unapprovedWatches.splice(watchIndex, 1);
          this.approvedWatches.push(watch);
        }
      } catch (err) {
        console.error(err);
      }
    },
    async notapproveWatch(data) {
      console.log('Watch Unapproved ID:', data.watch_id);
      try {
        const res = await axios.post(`${api}/staff/send/unapprove-report`, data);
        console.log('Watch Unapproved:', res.data);
        axios.patch(`${api}/staff/unapprove-watch?watch_id=${data.watch_id}`)
        const watch = this.approvedWatches.find(w => w.watch_id === data.watch_id) || 
                      this.unapprovedWatches.find(w => w.watch_id === data.watch_id);
        if (watch) {
          this.deleteWatches.push(watch);
          this.unapprovedWatches = this.unapprovedWatches.filter(w => w.watch_id !== data.watch_id);
          this.approvedWatches = this.approvedWatches.filter(w => w.watch_id !== data.watch_id);
        }
      } catch (err) {
        console.error(err);
      }
    },
    async unapproveWatch(watch_id) {
      console.log('Watch Unapproved ID:', watch_id);
      try {
        const res = await axios.patch(`${api}/staff/unapprove-watch?watch_id=${watch_id}`);
        console.log('Watch Unapproved:', res.data);
        const watchIndex = this.approvedWatches.findIndex(w => w.watch_id === watch_id);
        if (watchIndex !== -1) {
          const [watch] = this.approvedWatches.splice(watchIndex, 1);
          this.unapprovedWatches.push(watch);
        }
      } catch (err) {
        console.error(err);
      }
    },
    async getPendingOrder() {
      try {
        const res = await axios.get(`${api}/staff/get/pending-order`);
        console.log(res.data);
        return res.data;  
      } catch (err) {
        console.error(err);
        return [];
      }
    }, 
    async shipOrderByShipper(order_id, user_id) {
      try {
        const res = await axios.post(`${api}/staff/ship/order?oid=${order_id}&id=${user_id}`);
        console.log(res.data);
        return res.data;  
      } catch (err) {
        console.error(err);
        return [];
      }
    },
    async getMyShippingOrder(user_id) {
      try {
        const res = await axios.get(`${api}/staff/get/my-shipping-order/${user_id}`);
        console.log("Order IDs:", res.data);
        
        return res.data;
      } catch (err) {
        console.error("Error fetching shipping orders:", err);
        return [];
      }
    },
    async shippedToMember(order_id, user_id) {
      try {
        const res = await axios.post(`${api}/staff/shipped/order?oid=${order_id}&id=${user_id}`);
        console.log("Order IDs:", res.data);
        
        return res.data;
      } catch (err) {
        console.error("Error fetching shipping orders:", err);
        return [];
      }
    },
  },
});