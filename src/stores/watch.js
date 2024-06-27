import { defineStore } from "pinia";
import axios from "axios";


export const useWatchStore = defineStore("watch", {
  state: () => ({
    watches: [], // This will be an array of arrays, each inner array representing a page
    currentPage: 0,
    isLoading: false,
    error: null,
    hasMore: true,
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
    async getWatchesOfPage(page) {
      this.isLoading = true;
      this.error = null;
      try {
        console.log(`Fetching watches for page ${page}...`);
        const response = await axios.get(`http://localhost:8080/watch/get/watch-page?pagenum=${page}`);
        console.log("Response:", response.data);
        if (response.data && response.data.length > 0) {
          // If the page doesn't exist in our array, add it
          if (!this.watches[page]) {
            this.watches[page] = [];
          }
          // Add new watches to the existing page array
          this.watches[page].push(...response.data);
          this.currentPage = page;
          this.hasMore = response.data.length === 60; // Assuming 60 is the page size now
        } else {
          this.hasMore = false;
        }
      } catch (error) {
        console.error("Error fetching watches:", error.message);
        this.error = error.message;
      } finally {
        this.isLoading = false;
      }
    },
    async uploadWatch(seller_id, username) {
      try {
        axios.post(`http://localhost:8080/member/to-seller?id=${seller_id}&username=${username}`)
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
        // Update the state with user data
        this.watch_data.name = watchData.name ? watchData.name : null;
        this.watch_data.description = watchData.description ? watchData.description : null;
        this.watch_data.images = watchData.images ? watchData.images : null;
        this.watch_data.price = watchData.price ? watchData.price : null;
        this.watch_data.brand = watchData.brand ? watchData.brand : null;
        this.watch_data.series = watchData.series ? watchData.series : null;
        this.watch_data.model = watchData.model ? watchData.model : null;
        this.watch_data.gender = watchData.gender ? watchData.gender : null;
        this.watch_data.style = watchData.style ? watchData.style : null;
        this.watch_data.subclass = watchData.subclass ? watchData.subclass : null;
        this.watch_data.madelabel = watchData.madelabel ? watchData.madelabel : null;
        this.watch_data.calender = watchData.calender ? watchData.calender : null;
        this.watch_data.feature = watchData.feature ? watchData.feature : null;
        this.watch_data.movement = watchData.movement ? watchData.movement : null;
        this.watch_data.function = watchData.function ? watchData.function : null;
        this.watch_data.engine = watchData.engine ? watchData.engine : null;
        this.watch_data.waterresistant = watchData.waterresistant ? watchData.waterresistant : null;
        this.watch_data.bandcolor = watchData.bandcolor ? watchData.bandcolor : null;
        this.watch_data.bandtype = watchData.bandtype ? watchData.bandtype : null;
        this.watch_data.clasp = watchData.clasp ? watchData.clasp : null;
        this.watch_data.bracelet = watchData.bracelet ? watchData.bracelet : null;
        this.watch_data.dialtype = watchData.dialtype ? watchData.dialtype : null;
        this.watch_data.dialcolor = watchData.dialcolor ? watchData.dialcolor : null;
        this.watch_data.crystal = watchData.crystal ? watchData.crystal : null;
        this.watch_data.secondmaker = watchData.secondmaker ? watchData.secondmaker : null;
        this.watch_data.bezel = watchData.bezel ? watchData.bezel : null;
        this.watch_data.bezelmaterial = watchData.bezelmaterial ? watchData.bezelmaterial : null;
        this.watch_data.caseback = watchData.caseback ? watchData.caseback : null;
        this.watch_data.casedimension = watchData.casedimension ? watchData.casedimension : null;
        this.watch_data.caseshape = watchData.caseshape ? watchData.caseshape : null;



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
          seller: res.seller || null, // Make sure this is included in the API response
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
        throw error; // Re-throw the error so it can be handled by the caller
      }
    },
    
  },

  


});
