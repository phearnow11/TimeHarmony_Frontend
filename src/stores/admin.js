import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";

const api = import.meta.env.VITE_API_PORT;

export const useAdminStore = defineStore("admin", {
  state: () => ({
    members: [],
    products: [],
    orders: [],
    nullOrders: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async getMembers() {
      const token = useAuthStore().token;
      if (!token) return;
      
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(`${api}/admin/get/members`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.members = response.data;
      } catch (error) {
        console.error("Error fetching members:", error);
        this.error = error.message || "Failed to fetch members";
      } finally {
        this.isLoading = false;
      }
    },

    async getWatches() {
      const token = useAuthStore().token;
      if (!token) return;
      
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(`${api}/admin/get/watches`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.products = response.data;
      } catch (error) {
        console.error("Error fetching products:", error);
        this.error = error.message || "Failed to fetch products";
      } finally {
        this.isLoading = false;
      }
    },

    async getOrders() {
      const token = useAuthStore().token;
      if (!token) return;
      
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(`${api}/admin/get/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.orders = response.data;
      } catch (error) {
        console.error("Error fetching orders:", error);
        this.error = error.message || "Failed to fetch orders";
      } finally {
        this.isLoading = false;
      }
    },

    async getOrdersNull() {
      const token = useAuthStore().token;
      if (!token) return;
      
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(`${api}/admin/get/refund-payment`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.nullOrders = response.data;
      } catch (error) {
        console.error("Error fetching null orders:", error);
        this.error = error.message || "Failed to fetch null orders";
      } finally {
        this.isLoading = false;
      }
    },
    async deleteOrdersNull(id) {
      
      this.isLoading = true;
      this.error = null;
      try {
        await axios.delete(`${api}/payment/delete/${id}`);
      } catch (error) {
        console.error("Error fetching null orders:", error);
        this.error = error.message || "Failed to fetch null orders";
      } finally {
        this.isLoading = false;
      }
    },

    async promoteToStaff(userId) {
      const token = useAuthStore().token;
      if (!token) return;

      this.isLoading = true;
      this.error = null;

      try {
        // Fetch member details before promotion
        const memberResponse = await axios.get(`${api}/member/get/${userId}`);
        const member = memberResponse.data;

        // Promote the member to staff
        await axios.post(`${api}/admin/role/upgrade/staff/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Log the member's name
        console.log(`Successfully promoted ${member.first_name} ${member.last_name} to staff.`);

        // Optionally refresh members data after promotion
        await this.getMembers();
      } catch (error) {
        console.error("Error promoting user to staff:", error);
        this.error = error.message || "Failed to promote user";
      } finally {
        this.isLoading = false;
      }
    },

    ban(id) {
      const token = useAuthStore().token;
      console.log(id);
      axios.post(`${api}/admin/ban/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error banning user:', error);
      });
    },

    unBan(id) {
      const token = useAuthStore().token;
      axios.post(`${api}/admin/unban/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error banning user:', error);
      });
    },

    updateStaffRole(id, role){
      const token = useAuthStore().token;
      axios.put(`${api}/admin/update/staff-role?id=${id}&role=${role}`,{}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error updating staff role:', error);
      })
    },
  },
  getters: {
    filteredMembers: (state) => (query) => {
      const lowerQuery = query.toLowerCase();
      return state.members.filter(
        (member) =>
          member.member_id.toLowerCase().includes(lowerQuery) ||
          member.first_name.toLowerCase().includes(lowerQuery) ||
          member.last_name.toLowerCase().includes(lowerQuery) ||
          member.email.toLowerCase().includes(lowerQuery) ||
          member.user_log_info.username.toLowerCase().includes(lowerQuery)
      );
    },

    filteredWatches: (state) => (query) => {
      const lowerQuery = query.toLowerCase();
      return state.products.filter(
        (product) =>
          product.watch_id.toLowerCase().includes(lowerQuery) ||
          product.watch_name.toLowerCase().includes(lowerQuery) ||
          product.seller.user_log_info.username.toLowerCase().includes(lowerQuery)
      );
    },

    filteredOrders: (state) => (query) => {
      const lowerQuery = query.toLowerCase();
      return state.orders.filter(
        (order) =>
          order.order_id.toLowerCase().includes(lowerQuery) ||
          order.receive_name.toLowerCase().includes(lowerQuery) ||
          new Date(order.create_time).toLocaleDateString().toLowerCase().includes(lowerQuery)
      );
    },
    filteredNullOrders: (state) => (query) => {
      const lowerQuery = query.toLowerCase();
      return state.nullOrders.filter(
        (transaction) =>
          transaction.transaction_no.toLowerCase().includes(lowerQuery) ||
          transaction.member_id.toLowerCase().includes(lowerQuery) ||
          transaction.bank_code.toLowerCase().includes(lowerQuery) ||
          transaction.payment_method.toLowerCase().includes(lowerQuery) ||
          new Date(transaction.create_at).toLocaleDateString().toLowerCase().includes(lowerQuery)
      );
    },
  }
});
