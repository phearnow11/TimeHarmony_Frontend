import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    username: "",
    password: "",
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    phone: "",
    image: "https://files.catbox.moe/n1w3b0.png",
    active: "",
    user_id: null,  // Add this to your state
    cur_fav:[],
    wait_fav:[],
  }),

  actions: {
    getFavorites() {
      this.wait_fav.add
      return [...this.state.cur_fav, ...this.state.wait_fav];
    },

    async getFavoritesFromServer(user_id) {
      try {
        console.log('Prepare');
        const response = await axios.get(`http://localhost:8080/member/get/favorites/${user_id}`);
        console.log('Get OK');
        return response.data; // Assuming this returns an array of favorite watch objects
      } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }
    },

    async saveFavoritesToServer(user_id) {
      if (!user_id) {
        console.error('No user ID provided');
        return;
      }
    
      try {
        if (this.wait_fav.length === 0) {
          console.log('No new favorites to save');
          return;
        }
    
        console.log('Preparing to save favorites:', this.wait_fav);
        const response = await axios.post(`http://localhost:8080/member/add/favorites/${user_id}`, {
          w_ids: this.wait_fav
        });
        console.log('aaaaaaaa: '+response.data);
    
        if (response.data && response.status === 200) {
          console.log('Favorites saved successfully:', response.data);
          
          // Update cur_fav with newly saved favorites
          this.cur_fav = [...new Set([...this.cur_fav, ...this.wait_fav])];
          
          // Clear wait_fav after successful save
          this.wait_fav = [];
        } else {
          console.error('Unexpected response from server:', response);
        }
      } catch (error) {
        console.error('Error saving favorites:', error.response ? error.response.data : error.message);
        throw error;
      }
    },

    addToWaitFav(watch_id) {
      if (!this.wait_fav.includes(watch_id) && !this.cur_fav.includes(watch_id)) {
        this.wait_fav.push(watch_id);
      }
    },

    removeFromWaitFav(watch_id) {
      const indexWait = this.wait_fav.indexOf(watch_id);
      if (indexWait > -1) {
        this.wait_fav.splice(indexWait, 1);
      }
      const indexCur = this.cur_fav.indexOf(watch_id);
      if (indexCur > -1) {
        this.cur_fav.splice(indexCur, 1);
      }
    },

    isWatchFavorite(watch_id) {
      return this.cur_fav.includes(watch_id) || this.wait_fav.includes(watch_id);
    },

    async signUp(userData) {
      try {
        const response = await axios.post(
          "http://localhost:8080/guest/register/member",
          userData
        );
        console.log("Signup successful", response);
        return response;
      } catch (error) {
        console.error("Signup error", error);
        throw error;
      }
    },

    async addToCart(member_id, watch_id) {
      try {
        const response = await axios.post(`http://localhost:8080/member/add/to-cart/${member_id}?watch_id=${watch_id}`);
        
        return response.data;
      } catch (error) {
        console.error("Cart addition error", error);
        throw error;
      }
    },

    async loadUser(user_id) {
      try {
        const res = await axios.get(`http://localhost:8080/member/get/${user_id}`);
        const fav = await axios.get(`http://localhost:8080/member/get/favorites/${user_id}`)
        console.log("Member data:", res.data);

        // Update the state with user data
        this.username = res.data.user_log_info.username;
        this.email = res.data.email;
        this.first_name = res.data.first_name;
        this.last_name = res.data.last_name;
        this.address = res.data.address;
        this.phone = res.data.phone;
        this.image = res.data.member_image;
        this.active = res.data.active;
        this.user_id = res.data.member_id;
        this.cur_fav = fav.data
      } catch (err) {
        console.error("Error fetching member data:", err);
      }
    },

    async getUserInfo(user_id) {
      try {
        const res = await axios.get(`http://localhost:8080/member/get/${user_id}`);
        console.log("Member data:", res.data);

        // Construct and return the user JSON
        const userInfo = {
          username: res.data.user_log_info.username,
          email: res.data.email,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          address: res.data.address,
          phone: res.data.phone,
          image: res.data.member_image,
          active: res.data.active,
          user_id: res.data.member_id,
          watches: res.data.watches
        };

        return userInfo;
      } catch (err) {
        console.error("Error fetching member data:", err);
        throw err;
      }
    },
    
  },
});
