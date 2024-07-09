import { defineStore } from "pinia";
import axios from "axios";

export const useStaffStore = defineStore("staff", {
  state: () => ({
    unapprovedWatches: [],
    approvedWatches: [],
    deleteWatches: [],
  }),
  actions: {
    async getAllWatch(state) {
      try {
        const res = await axios.get(`http://localhost:8080/staff/get/watch-state/${state}`);
        if (state === 0) {
          this.unapprovedWatches = res.data;
        } else if (state === 1) {
          this.approvedWatches = res.data;
        } else if (state === 2) {
          this.deleteWatches = res.data;
        }
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    },
    async approveWatch(watch_id) {
      console.log('Watch Approved ID:', watch_id);
      try {
        const res = await axios.patch(`http://localhost:8080/staff/approve-watch?watch_id=${watch_id}`);
        console.log('Watch Approved:', res.data);
        // Move the watch from unapproved to approved
        const watchIndex = this.unapprovedWatches.findIndex(w => w.watch_id === watch_id);
        if (watchIndex !== -1) {
          const [watch] = this.unapprovedWatches.splice(watchIndex, 1);
          this.approvedWatches.push(watch);
        }
      } catch (err) {
        console.error(err);
      }
    },
    async deleteWatch(watch_id) {
      console.log('Watch Deleted ID:', watch_id);
      try {
        const res = await axios.delete(`http://localhost:8080/staff/delete-watch?watch_id=${watch_id}`);
        console.log('Watch Deleted:', res.data);
        // Remove the watch from all lists
        this.unapprovedWatches = this.unapprovedWatches.filter(w => w.watch_id !== watch_id);
        this.approvedWatches = this.approvedWatches.filter(w => w.watch_id !== watch_id);
        this.deleteWatches = this.deleteWatches.filter(w => w.watch_id !== watch_id);
      } catch (err) {
        console.error(err);
      }
    },
    async unapproveWatch(watch_id) {
      console.log('Watch Unapproved ID:', watch_id);
      try {
        const res = await axios.patch(`http://localhost:8080/staff/unapprove-watch?watch_id=${watch_id}`);
        console.log('Watch Unapproved:', res.data);
        // Move the watch back to unapproved
        const watchIndex = this.approvedWatches.findIndex(w => w.watch_id === watch_id);
        if (watchIndex !== -1) {
          const [watch] = this.approvedWatches.splice(watchIndex, 1);
          this.unapprovedWatches.push(watch);
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
});