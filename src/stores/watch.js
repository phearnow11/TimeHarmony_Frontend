import { defineStore } from "pinia";
import axios from "axios";

export const useWatchStore = defineStore("watch", {
  state: () => ({
    watches: []
  }),

  actions: {
    async getWatchesOfPage(page) {
      try {
        console.log(`Fetching watches for page ${page}...`);
        const response = await axios.get(`http://localhost:8080/watch/get/watch-page?pagenum=${page}`);
        console.log("Response:", response.data);
        this.watches = response.data; // Assuming response.data is an array of watches
      } catch (error) {
        console.error("Error fetching watches:", error.message);
        throw error; // Propagate the error to the caller if needed
      }
    },
  },
});
