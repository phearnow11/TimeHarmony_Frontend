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

  getters: {
    mapUrl: (state) => (latitude, longitude) => {
      if (latitude && longitude) {
        return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      }
      return null;
    },
  },

  actions: {
    async getMyLocation() {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const result = await this.getLocation(position.coords.latitude, position.coords.longitude);

        this.latitude = result.latitude;
        this.longitude = result.longitude;
        this.locationName = result.locationName;
        this.translatedName = result.translatedName;

        return result;
      } catch (error) {
        this.error = "Failed to get location: " + error.message;
        return { error: this.error };
      }
    },

    async getLocation(latitude, longitude) {
      try {
        const locationName = await this.fetchLocationName(latitude, longitude);
        const translatedName = await this.translateLocationName(locationName);
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

        return {
          latitude,
          longitude,
          locationName,
          translatedName,
          mapUrl,
        };
      } catch (error) {
        this.error = "Error: " + error.message;
        return { error: this.error };
      }
    },

    async fetchLocationName(latitude, longitude) {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
        const response = await axios.get(url);

        if (response.data && response.data.display_name) {
          return response.data.display_name;
        } else {
          throw new Error("Location name not found");
        }
      } catch (error) {
        throw new Error("Error fetching location name: " + error.message);
      }
    },

    async translateLocationName(locationName) {
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(locationName)}&langpair=en|vi`;
        const response = await axios.get(url);

        if (response.data && response.data.responseData && response.data.responseData.translatedText) {
          return response.data.responseData.translatedText;
        } else {
          return locationName;
        }
      } catch (error) {
        return locationName;
      }
    },
  },
});
