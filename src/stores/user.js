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
  }),

  actions: {
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

    async loadUser(user_id) {
      try {
        const res = await axios.get(`http://localhost:8080/member/get/${user_id}`);
        console.log("Member data:", res.data);

        // Update the state with user data
        this.username = res.data.username;
        this.email = res.data.email;
        this.first_name = res.data.first_name;
        this.last_name = res.data.last_name;
        this.address = res.data.address;
        this.phone = res.data.phone;
        this.image = res.data.member_image;
        this.active = res.data.active;
        this.user_id = res.data.member_id;
      } catch (err) {
        console.error("Error fetching member data:", err);
      }
    },
  },
});
