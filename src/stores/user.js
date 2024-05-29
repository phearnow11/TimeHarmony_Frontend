import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore('user', {
    state: () => ({
        username: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        address: '',
        phone: '',
        image: '',
        active: '',
    }),

    actions: {
        async signUp() {
            const userData = [
                {
                    email: this.email,
                    Fname: this.first_name,
                    Lname: this.last_name,
                    phone: this.phone,
                    address: this.address,
                    image: this.image,
                    active: this.active
                },
                {
                    username: this.username,
                    password: this.password
                }
            ];

            try {
                const response = await axios.post("http://localhost:8080/member/save-user", userData);
                console.log("Signup successful", response);
                return response;
            } catch (error) {
                console.error("Signup error", error);
                throw error;
            }
        },

        newUser(userInfo) {
            this.username = userInfo.username || '';
            this.password = userInfo.password || '';
            this.email = userInfo.email || '';
            this.first_name = userInfo.first_name || '';
            this.last_name = userInfo.last_name || '';
            this.phone = userInfo.phone || '';
            this.address = userInfo.address || '';
            this.image = userInfo.image || '';
            this.active = userInfo.active || '';
        }
    }
});
