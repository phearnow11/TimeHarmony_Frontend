import { defineStore } from "pinia";
import axios from "axios";

export const useWatchStore = defineStore("watch", {
  state: () => ({
    watches: new Map(),
    currentPage: 0,
    isLoading: false,
    error: null,
    hasMore: true,
    filters: {},
    watch_data: {
      name: "",
      price: "",
      images: [],
      description: "",
      brand: "",
      series: "",
      model: "",
      gender: "",
      style: "",
      subclass: "",
      madelabel: "",
      calender: "",
      feature: "",
      movement: "",
      function: "",
      engine: "",
      waterresistant: "",
      bandcolor: "",
      bandtype: "",
      clasp: "",
      bracelet: "",
      dialtype: "",
      dialcolor: "",
      crystal: "",
      secondmaker: "",
      bezel: "",
      bezelmaterial: "",
      caseback: "",
      casedimension: "",
      caseshape: ""
    }
  }),

  actions: {
    async getWatchesOfPage(page, filters = {}) {
      this.isLoading = true;
      this.error = null;

      // Check if filters have changed
      const filtersChanged = JSON.stringify(filters) !== JSON.stringify(this.filters);

      if (filtersChanged) {
        // Reset watches map if filters have changed
        this.watches.clear();
        this.filters = filters;
      }

      try {
        // Construct the URL with filters
        let url = `http://localhost:8080/watch/get/watch-page?page=${page}`;
        const queryParams = Object.entries(filters)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join("&");
        if (queryParams) {
          url += `&${queryParams}`;
        }

        const response = await axios.get(url);
        if (response.data && response.data.watches.length > 0) {
          if (!this.watches.has(page)) {
            this.watches.set(page, []);
          }
          this.watches.get(page).push(...response.data.watches);
          this.currentPage = page;
          this.hasMore = response.data.watches.length === 60; // Assuming 60 is the page size
        } else {
          this.hasMore = false;
        }
      } catch (error) {
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },

    async uploadWatch(seller_id, username) {
      try {
        axios.post(`http://localhost:8080/member/to-seller?id=${seller_id}&username=${username}`);
        const response = await axios.post(
          `http://localhost:8080/seller/create/watch?seller_id=${seller_id}`,
          this.watch_data
        );
        console.log("Upload successful", response);
        return response;
      } catch (error) {
        console.error("Upload error", error);
        throw error;
      }
    },

    async loadWatch(watchData) {
      try {
        this.watch_data = {
          ...this.watch_data,
          ...watchData
        };
      } catch (err) {
        console.error("Error fetching member data:", err);
      }
    },

    async getDetailWatch(watch_id) {
      try {
        const response = await axios.get(`http://localhost:8080/watch/get/${watch_id}`);
        const res = response.data;
        console.log(res);

        this.watch_data = {
          seller: res.seller || null,
          name: res.watch_name || null,
          description: res.watch_description || null,
          images: res.image_url ? (Array.isArray(res.image_url) ? res.image_url : [res.image_url]) : [],
          price: res.price || null,
          brand: res.brand || null,
          series: res.series || null,
          model: res.model || null,
          gender: res.gender || null,
          style: res.style_type || null,
          subclass: res.sub_class || null,
          madelabel: res.made_label || null,
          calender: res.calender || null,
          feature: res.feature || null,
          movement: res.movement || null,
          function: res.functions || null,
          engine: res.engine || null,
          waterresistant: res.water_resistant || null,
          bandcolor: res.band_color || null,
          bandtype: res.band_type || null,
          clasp: res.clasp || null,
          bracelet: res.bracelet || null,
          dialtype: res.dial_type || null,
          dialcolor: res.dial_color || null,
          crystal: res.crystal || null,
          secondmaker: res.second_makers || null,
          bezel: res.bezel || null,
          bezelmaterial: res.bezel_material || null,
          caseback: res.case_back || null,
          casedimension: res.case_dimension || null,
          caseshape: res.case_shape || null,
        };

        return this.watch_data;
      } catch (error) {
        console.error("Error fetching watch data:", error);
        throw error;
      }
    },
  }
});
