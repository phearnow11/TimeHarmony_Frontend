import { defineStore } from "pinia";
import axios from "axios";

export const useStaffStore = defineStore("staff", {
  state: () => ({
    unapprovedWatches: [],
  }),
  actions: {
    async getAllUnApproved() {
      try {
        const res = await axios.get('http://localhost:8080/staff/get/watch/state=0');
        this.unapprovedWatches = res.data;
        console.log(res.data);
      } catch (err) {
        console.error(err);
      }
    },

    approveWatch(watch_id) {
        console.log('Watch Approved ID:',watch_id);
      axios.patch(`http://localhost:8080/staff/approve-watch?watch_id=${watch_id}`)
        .then((res) => {
          console.log('Watch Approved:', res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
});
