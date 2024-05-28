import axios from "axios";
import { defineStore } from "pinia";
import router from "../router";
import Cookies from "js-cookie";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null,
        token: Cookies.get('token') ? Cookies.get('token') : null,
        returnURL: '/',
    }),
    actions: {
        login(username, password, remember) {
            axios.post(
                'http://localhost:8080/api/auth/token',
                {}, // Empty body
                {
                    auth: {
                        username: username,
                        password: password
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then((res) => {
                console.log(res.data);
                if (res.status === 200) {
                    this.user = res.data.user;
                    this.token = res.data.token; // Assign token from response data
                    // Save token and user in cookies
                    Cookies.set('token', this.token, { expires: 7 }); // Example: Expires in 7 days
                    if (remember) {
                        Cookies.set('user', JSON.stringify({ username }), { expires: 7 }); // Save username only if "Remember Me" is checked
                    } else {
                        Cookies.remove('user'); // Remove username from cookies if "Remember Me" is unchecked
                    }
                    router.push(this.returnURL || '/');
                }
            })
            .catch((error) => {
                console.error('Error logging in:', error);
            });
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
