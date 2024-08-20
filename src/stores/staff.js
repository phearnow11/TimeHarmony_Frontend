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
    async getRequestFromAdmin(appraiser_id) {
      console.log('Appraiser ID:', appraiser_id);
      try {
        const res = await axios.get(`${api}/staff/get/my-request/${appraiser_id}`);
        console.log('Requests:', res.data);
    
        this.unapprovedWatches = res.data
          .filter(request => request.status === 'PROCESSING')
          .map(request => ({
            watch_id: request.appraise_watch,
            request_id: request.request_id,
            created_by: request.created_by,
            appointment_date: request.appointment_date,
            created_at: request.created_at,
            note: request.note,
            status: request.status
          }));
    
        this.approvedWatches = res.data
          .filter(request => request.status === 'COMPLETED')
          .map(request => ({
            watch_id: request.appraise_watch,
            request_id: request.request_id,
            created_by: request.created_by,
            appointment_date: request.appointment_date,
            created_at: request.created_at,
            note: request.note,
            status: request.status
          }));
    
        this.deleteWatches = res.data
          .filter(request => request.status === 'FAILED')
          .map(request => ({
            watch_id: request.appraise_watch,
            request_id: request.request_id,
            created_by: request.created_by,
            appointment_date: request.appointment_date,
            created_at: request.created_at,
            note: request.note,
            status: request.status
          }));

          this.deleteWatches = res.data
          .filter(request => request.status === 'EXPIRED')
          .map(request => ({
            watch_id: request.appraise_watch,
            request_id: request.request_id,
            created_by: request.created_by,
            appointment_date: request.appointment_date,
            created_at: request.created_at,
            note: request.note,
            status: request.status
          }));
    
      } catch (err) {
        console.error(err);
      }
    },    
    async approveWatch(id) {
      console.log('Watch Approved ID:', id);
      try {
        const res = await axios.patch(`${api}/staff/approve-watch?watch_id=${id}`);
        console.log('Watch Approved:', res.data);
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
    async unapproveWatch(appraiser_id) {
      console.log('Watch Unapproved ID:', appraiser_id);
      try {
        const res = await axios.get(`${api}/staff/get/my-request/${appraiser_id}`);
        console.log('Watch Unapproved:', res.data);
        const watchIndex = this.unapprovedWatches = res.data.map(request => ({
          watch_id: request.appraise_watch,
          request_id: request.request_id,
          created_by: request.created_by,
          appointment_date: request.appointment_date,
          created_at: request.created_at,
          note: request.note,
          status: request.status
        }));
        if (watchIndex !== -1) {
          const [watch] = this.approvedWatches.splice(watchIndex, 1);
          this.unapprovedWatches.push(watch);
        }
      } catch (err) {
        console.error(err);
      }
    },
    async getPendingOrder(shipper_id) {
      try {
        console.log('aaaa' + shipper_id);
        const res = await axios.get(`${api}/staff/get/my-assigned-order/${shipper_id}`);
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
    updateWatch(id, data) {
      axios.patch(`${api}/staff/update/fields/${id}`, data)
        .then((res) => {
          console.log('Update successful:', res.data);
        })
        .catch((err) => {
          console.error('Update failed:', err.response ? err.response.data : err.message);
          if (err.response) {
            console.log('Full error response:', err.response);
          }
        });
    }    
  },
});