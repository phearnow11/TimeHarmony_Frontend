import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";

const api = import.meta.env.VITE_API_PORT;

export const useAdminStore = defineStore("admin", {
  state: () => ({
    members: [],
    products: [],
    orders: [],
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
  },
});
