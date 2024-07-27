// locationStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useLocationStore = defineStore('location', {
  state: () => ({
    latitude: null,
    longitude: null,
    locationName: null,
    translatedName: null,
    error: null,
  }),

  actions: {
    async getLocation() {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;

        await this.getLocationName();
      } catch (error) {
        this.error = "Failed to get location: " + error.message;
      }
    },

    async getLocationName() {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.latitude}&lon=${this.longitude}`;
        const response = await axios.get(url);

        if (response.data && response.data.display_name) {
          this.locationName = response.data.display_name;
          await this.translateLocationName();
        } else {
          this.locationName = "Location name not found";
        }
      } catch (error) {
        this.error = "Error fetching location name: " + error.message;
      }
    },

    async translateLocationName() {
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(this.locationName)}&langpair=en|vi`;
        const response = await axios.get(url);

        if (response.data && response.data.responseData && response.data.responseData.translatedText) {
          this.translatedName = response.data.responseData.translatedText;
        } else {
          this.translatedName = 'Translation not found';
        }
      } catch (error) {
        this.error = "Error fetching translation: " + error.message;
      }
    },
  },
});