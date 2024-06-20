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
        axios.post(`http://localhost:8080/member/to-seller?id=${seller_id}`)
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
    async getDetailWatch(watch_id) {
      
      try {
        axios.get(`http://localhost:8080/watch/get/${watch_id}`).then((response) => {
          const res = response.data;
          console.log(res);
          this.watch_data.name = res.watch_name ? res.watch_name : null;
        this.watch_data.watch_description = res.watch_description ? res.watch_description : null;
        this.watch_data.price = res.price ? res.price : null;
        this.watch_data.brand = res.brand ? res.brand : null;
        this.watch_data.series = res.series ? res.series : null;
        this.watch_data.model = res.model ? res.model : null;
        this.watch_data.gender = res.gender ? res.gender : null;
        this.watch_data.style = res.style_type ? res.style_type : null;
        this.watch_data.subclass = res.sub_class ? res.sub_class : null;
        this.watch_data.madelabel = res.made_label ? res.made_label : null;
        this.watch_data.calender = res.calender ? res.calender : null;
        this.watch_data.feature = res.feature ? res.feature : null;
        this.watch_data.movement = res.movement ? res.movement : null;
        this.watch_data.functions = res.functions ? res.functions : null;
        this.watch_data.engine = res.engine ? res.engine : null;
        this.watch_data.waterresistant = res.water_resistant ? res.water_resistant : null;
        this.watch_data.bandcolor = res.band_color ? res.band_color : null;
        this.watch_data.bandtype = res.band_type ? res.band_type : null;
        this.watch_data.clasp = res.clasp ? res.clasp : null;
        this.watch_data.bracelet = res.bracelet ? res.bracelet : null;
        this.watch_data.dialtype = res.dial_type ? res.dial_type : null;
        this.watch_data.dialcolor = res.dial_color ? res.dial_color : null;
        this.watch_data.crystal = res.crystal ? res.crystal : null;
        this.watch_data.secondmaker = res.second_makers ? res.second_makers : null;
        this.watch_data.bezel = res.bezel ? res.bezel : null;
        this.watch_data.bezel_material = res.bezel_material ? res.bezel_material : null;
        this.watch_data.caseback = res.case_back ? res.case_back : null;
        this.watch_data.casedimension = res.case_dimension ? res.case_dimension : null;
        this.watch_data.caseshape = res.case_shape ? res.case_shape : null;
        }).catch((error) =>{})
        // Update the state with user data
        
  
  
  
      } catch (err) {
        console.error("Error fetching member data:", err);
      }
    },
  },

  


});
