import axios from "axios";
import { defineStore } from "pinia";
import router from "../router";
import Cookies from "js-cookie"; // Import Cookies library

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,
        token: Cookies.get('token') ? JSON.parse(Cookies.get('token')) : null,
        returnURL: '/',
    }),
    actions: {
        async login(username, password) {
            try {
                const res = await axios.post(
                    'http://localhost:8080/api/auth/token',
                    JSON.stringify({ username, password }),
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log(res.data);
                if (res.status === 200) {
                    this.user = res.data.user;
                    this.token = res.data.token; // Assign token from response data
                    // Save token in cookies
                    Cookies.set('token', this.token, { expires: 7 }); // Example: Expires in 7 days
                    Cookies.set('user', this.token, { expires: 7 }); // Example: Expires in 7 days
                    router.push(this.returnURL || '/');
                }
            } catch (error) {
                console.error('Error logging in:', error);
            }
        },
        logout() {
            this.user = null;
            this.token = null;
            Cookies.remove('token');
            Cookies.remove('user');
            router.push('/login');
        }
    }
});
