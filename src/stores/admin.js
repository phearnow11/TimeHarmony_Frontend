import { defineStore } from "pinia";
import axios from "axios";
import { useAuthStore } from "./auth";
import { createClient } from "@supabase/supabase-js";
import { useUserStore } from "./user";

const api = import.meta.env.VITE_API_PORT;
const supabaseUrl = import.meta.env.VITE_SUPABASEURL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASEANONKEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const useAdminStore = defineStore("admin", {
  state: () => ({
    members: [],
    products: [],
    orders: [],
    nullOrders: [],
    topThreeWatch: [],
    shipper: '',
    isLoading: false,
    error: null,
    banSubscription: null
  }),

  actions: {

    async getNumOrderSuccess(month) {
      const token = useAuthStore().token;
      if (!token) return;
      
      this.isLoading = true;
      this.error = null;
  
      try {
        const response = await axios.get(`${api}/admin/get/num-order-success/month=${month}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching number of successful orders:", error);
        this.error = error.message || "Failed to fetch number of successful orders";
      } finally {
        this.isLoading = false;
      }
    },
  
    async getTotalAmountOrderSuccess(month) {
      const token = useAuthStore().token;
      if (!token) return;
      
      this.isLoading = true;
      this.error = null;
  
      try {
        const response = await axios.get(`${api}/admin/get/total-amount-order-success/month=${month}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching total amount of successful orders:", error);
        this.error = error.message || "Failed to fetch total amount of successful orders";
      } finally {
        this.isLoading = false;
      }
    },
  
    async getTotalProfitOrderSuccess(month) {
      const token = useAuthStore().token;
      if (!token) return;
      
      this.isLoading = true;
      this.error = null;
  
      try {
        const response = await axios.get(`${api}/admin/get/total-amount-profit-order-success/month=${month}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching total profit of successful orders:", error);
        this.error = error.message || "Failed to fetch total profit of successful orders";
      } finally {
        this.isLoading = false;
      }
    },
    
    async assignOrderToShipper(shipperID, orderID) {
      const token = useAuthStore().token;
      if (!token) {
        console.error("No authentication token available");
        return;
      }
      
      this.isLoading = true;
      this.error = null;
    
      try {
        console.log(`Assigning order ${orderID} to shipper ${shipperID}`);
        console.log("Token being used:", token);
        console.log("Request URL:", `${api}/admin/assign/shipper?sid=${shipperID}&oid=${orderID}`);

        const response = await axios.post(
          `${api}/admin/assign/shipper?sid=${shipperID}&oid=${orderID}`,
          {}, // Empty object as the request body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Assignment response:", response.data);
        await this.getOrders(); // Refresh orders after assignment
        return response.data;
      } catch (error) {
        console.error("Error assigning order to shipper:", error);
        this.error = error.response?.data?.message || error.message || "Failed to assign order to shipper";
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
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

    async getOrdersByState(state) {
      const token = useAuthStore().token;
      if (!token) return;
      
      this.isLoading = true;
      this.error = null;

      try {
        const response = await axios.get(`${api}/admin/get/orders-by-state/${state}`, {
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
    async getTopThreeWatch() {
      const token = useAuthStore().token;
      if (!token) return;
      
      this.isLoading = true;
      this.error = null;
    
      try {
        const response = await axios.get(`${api}/admin/get/top-3-brand`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
    
        // Assign the fetched data to topThreeWatch
        this.topThreeWatch = response.data;
      } catch (error) {
        console.error("Error fetching top 3:", error);
        this.error = error.message || "Failed to fetch top 3 brands";
      } finally {
        this.isLoading = false;
      }
    },
    async getOrderByDay() {
      const token = useAuthStore().token;
      if (!token) return;
      
      this.isLoading = true;
      this.error = null;
    
      try {
        const response = await axios.get(`${api}/admin/get/top-3-brand`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
    
        // Assign the fetched data to topThreeWatch
        this.topThreeWatch = response.data;
      } catch (error) {
        console.error("Error fetching top 3:", error);
        this.error = error.message || "Failed to fetch top 3 brands";
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

    async ban(user, reason) {
      const token = useAuthStore().token;
      
      try {
        // Call the API to ban the user
        const response = await axios.post(`${api}/admin/ban/${user.username}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        console.log(response.data);
    
        // Insert ban record into Supabase
        const { data, error } = await supabase
          .from('ban')
          .insert([{ 
            id: crypto.randomUUID(), 
            user_id: user.user_id, 
            username: user.username, 
            reason: reason 
          }])
          .select();
    
        if (error) throw error;
    
        return data;
      } catch (error) {
        console.error('Error banning user:', error);
        throw error;
      }
    },

    async unBan(username) {
      const token = useAuthStore().token;
      try {
        // Call the API to unban the user
        const apiResponse = await axios.post(`${api}/admin/unban/${username}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(apiResponse.data);
    
        // Delete from the 'ban' table instead of 'messages'
        const { data, error } = await supabase
          .from('ban')
          .delete()
          .eq('username', username);
    
        if (error) throw error;
    
        console.log('Ban record deleted successfully');
        return data;
      } catch (error) {
        console.error('Error unbanning user:', error);
        throw error;
      }
    },

    async checkBan(username) {
      try {
        console.log('Checking ban status for:', username);
        const { data, error } = await supabase
          .from('ban')
          .select("*")
          .eq('username', username);
    
        if (error) {
          console.error('Error checking ban status:', error);
          throw error;
        }
    
        console.log('Ban check result:', data);
    
        if (data && data.length > 0) {
          console.log('User is banned:', data[0]);
          return data[0]; // Return the first ban record
        } else {
          console.log('User is not banned');
          return null;
        }
      } catch (error) {
        console.error('Error checking ban status:', error);
        // If the error is due to no rows found, treat it as not banned
        if (error.code === 'PGRST116') {
          console.log('No ban record found, user is not banned');
          return null;
        }
        throw error; // Re-throw other errors to be handled by the caller
      }
    },

    async subscribeToBan() {
      const userStore = useUserStore();
      const authStore = useAuthStore();
      const username = userStore.username;
      const userId = authStore.user_id;
    
      if (this.banSubscription) {
        await this.unsubscribeFromBan();
      }
    
      try {
        this.banSubscription = supabase
          .channel('ban')
          .on(
            'postgres_changes',
            {
              event: '*', // This will catch INSERT, UPDATE, and DELETE events
              schema: 'public',
              table: 'ban',
              filter: `username=eq.${username}`,
            },
            async (payload) => {
              if (payload.eventType === 'INSERT') {
                console.log('User has been banned', payload);
                if (payload.new.username === username || payload.new.user_id === userId) {
                  console.log('Current user has been banned. Logging out...');
                  try {
                    await authStore.logout();
                    // Optionally, you can redirect to a "banned" page or show a notification
                    // For example: router.push('/banned');
                  } catch (error) {
                    console.error('Error during logout after ban:', error);
                  }
                }
              } else if (payload.eventType === 'DELETE') {
                console.log('User has been unbanned');
                // You might want to perform some actions here, like allowing the user to log in again
                // For example: notify the user that they've been unbanned
              } else if (payload.eventType === 'UPDATE') {
                console.log('Ban record updated', payload);
                // Handle updates to the ban record if needed
              }
            }
          )
          .subscribe();
    
        console.log('Successfully subscribed to ban channel');
      } catch (error) {
        console.error('Error subscribing to ban channel:', error);
      }
    },
    
    unsubscribeFromBan() {
      if (this.banSubscription) {
        supabase.removeChannel(this.banSubscription);
        this.banSubscription = null;
      }
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

    getRequestWatches() {
      const token = useAuthStore().token;
      return axios.get(`${api}/admin/get/requests`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        console.log("Request Watches Response:", res.data);
        return res.data; // Return the data here
      })
      .catch((err) => {
        console.error("Error fetching Request Watches:", err.response ? err.response.data : err.message);
        // Handle the error here (e.g., show an error message to the user)
      });
    }  ,
    
    assignWatchRequest(req_id, apr_id, date){
      const token = useAuthStore().token;
      axios.patch(`${api}/admin/assign/request?request_id=${req_id}&appraiser_id=${apr_id}`,
        {
          appointment_date: date
        }
        ,{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(
        (res)=>{
          console.log(res);
        }
      )
      .catch(
        (err)=>{
          console.log(err);    
        }
      )
    }
  },
  getters: {
    getTopThree(state) {
      return state.topThreeWatch;
    },
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
