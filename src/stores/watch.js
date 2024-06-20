import { defineStore } from "pinia";
import axios from "axios";

export const useWatchStore = defineStore("watch", {
  state: () => ({
    watches: [],
    watch_data: {
      name: "",
      price: "",
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
      functions: "",
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
      try {
        console.log(`Fetching watches for page ${page}...`);
        const response = await axios.get(`http://localhost:8080/watch/get/watch-page?pagenum=${page}`);
        console.log("Response:", response.data);
        this.watches = response.data;
      } catch (error) {
        console.error("Error fetching watches:", error.message);
        throw error; // Propagate the error to the caller if needed
      }
    },
    async uploadWatch(seller_id) {
      try {
        const response = await axios.post(
          `http://localhost:8080/seller/create/watch?seller_id=a75ea724-173e-4b1b-a8d6-aaa221782818`,
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
        this.watch_data.watch_description = watchData.description ? watchData.description : null;
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
        this.watch_data.functions = watchData.functions ? watchData.functions : null;
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
        this.watch_data.bezel_material = watchData.bezelmaterial ? watchData.bezelmaterial : null;
        this.watch_data.caseback = watchData.caseback ? watchData.caseback : null;
        this.watch_data.casedimension = watchData.casedimension ? watchData.casedimension : null;
        this.watch_data.caseshape = watchData.caseshape ? watchData.caseshape : null;



      } catch (err) {
        console.error("Error fetching member data:", err);
      }
    },
  },


});
