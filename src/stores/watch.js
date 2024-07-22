import { defineStore } from "pinia";
import axios from "axios";

var api = import.meta.env.VITE_API_PORT
export const useWatchStore = defineStore("watch", {
  state: () => ({
    watches: new Map(),
    totalPage: 0,
    currentPage: 0,
    isLoading: false,
    error: null,
    hasMore: true,
    filters: [],
    searchResults: [],
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
    async getWatchesOfPage(page, filters = []) {
      if (this.watches.has(page)) {
        return; // Return if watches for the page are already fetched
      }

      this.isLoading = true;
      this.error = null;

      // Check if filters have changed
      const filtersChanged = JSON.stringify(filters) !== JSON.stringify(this.filters);

      if (filtersChanged) {
        // Reset watches map if filters have changed
        this.watches.clear();
        this.filters = filters;
      }

      // Construct the URL with filters
      let url = `${api}/watch/get/watch-page?page=${page}`;
      if (filters.length > 0) {
        url += `&${filters.join("&")}`;
      }

      try {
        const response = await axios.get(url);
        if (response.data && response.data.watches.length > 0) {
          if (!this.watches.has(page)) {
            this.watches.set(page, []);
          }
          this.watches.get(page).push(...response.data.watches);
          this.currentPage = page;

          // Calculate total pages
          const totalPages = Math.ceil(response.data.watch_num / 60); // Assuming 60 is the page size
          this.totalPage = totalPages;
          this.hasMore = response.data.watches.length === totalPages * 60; // Check if there are more pages

          console.log("Total Pages:", this.totalPage);
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
        axios.post(`${api}/member/to-seller?id=${seller_id}&username=${username}`);
        const response = await axios.post(
          `${api}/seller/create/watch?seller_id=${seller_id}`,
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
        const response = await axios.get(`${api}/watch/get/${watch_id}`);
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
    async searchWatches(keyword) {
      try {
        const response = await axios.get(`${api}/watch/search/keyword?keyword=${keyword}`);
        this.searchResults = response.data;
        console.log(response.data);
        return this.searchResults;
      } catch (error) {
        console.error("Error searching watches:", error);
        throw error;
      }
    },
    async getWatchesByGender(gender) {
      try {
        const response = await axios.get(`http://localhost:8080/watch/get/gender?gender=${gender}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching watches by gender:", error);
        throw error;
      }
    },
  
    async getWatchesBySeries(series) {
      try {
        const response = await axios.get(`${api}/watch/get/series?series=${series}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching watches by series:", error);
        throw error;
      }
    },
  
    async getWatchesByBrand(brand) {
      try {
        const response = await axios.get(`${api}/watch/get/brand?brand=${brand}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching watches by brand:", error);
        throw error;
      }
    },
  
    async getWatchesByStyle(style) {
      try {
        const response = await axios.get(`${api}/watch/get/style?style=${style}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching watches by style:", error);
        throw error;
      }
    },
  
    async getWatchesByPriceRange(leftLimit, rightLimit) {
      try {
        const response = await axios.get(`${api}/watch/get/watch-in-range-price?leftlimit=${leftLimit}&rightlimit=${rightLimit}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching watches by price range:", error);
        throw error;
      }
    },
  
    // Add a new action to apply multiple filters
    async applyFilters(filters) {
      try {
        let results = [];
        if (filters.gender) {
          results = await this.getWatchesByGender(filters.gender);
        }
        if (filters.brand) {
          const brandResults = await this.getWatchesByBrand(filters.brand);
          results = results.length ? results.filter(watch => brandResults.some(br => br.watch_id === watch.watch_id)) : brandResults;
        }
        if (filters.style) {
          const styleResults = await this.getWatchesByStyle(filters.style);
          results = results.length ? results.filter(watch => styleResults.some(sr => sr.watch_id === watch.watch_id)) : styleResults;
        }
        if (filters.priceRange) {
          const priceResults = await this.getWatchesByPriceRange(filters.priceRange.min, filters.priceRange.max);
          results = results.length ? results.filter(watch => priceResults.some(pr => pr.watch_id === watch.watch_id)) : priceResults;
        }
        this.searchResults = results;
        return results;
      } catch (error) {
        console.error("Error applying filters:", error);
        throw error;
      }
    },
  }
});
