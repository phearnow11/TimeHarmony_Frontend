import axios from "axios";
import { defineStore } from "pinia";
import router from "../router";
import Cookies from "js-cookie";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user_id: Cookies.get('user_id') ? Cookies.get('user_id') : null,
        token: Cookies.get('token') ? Cookies.get('token') : null,
        returnURL: '/',
    }),
    actions: {
        login(username, password, remember) {
            axios.post(
                'http://localhost:8080/api/auth/login',
                {}, // Empty body
                {
                    auth: {
                        username,
                        password
                    },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            )
            .then((res) => {
                if (res.status === 200) {
                    console.log(res.data.user);
                    this.user_id = res.data.user;
                    this.token = res.data.token;
                    // Save token and user_id in cookies
                    Cookies.set('token', this.token, { expires: 7 }); // Expires in 7 days
                    if (remember) {
                        Cookies.set('user_id', this.user_id, { expires: 7 });
                    } else {
                        Cookies.remove('user_id');
                    }
                    router.push(this.returnURL || '/');
                }
            })
            .catch((error) => {
                console.error('Error logging in:', error);
            });
        },
        logout() {
            axios.post(`http://localhost:8080/api/auth/logout?member_id=${this.user_id}`)
            this.user_id = null;
            this.token = null;
            Cookies.remove('token');
            Cookies.remove('user_id');
            router.push('/');
        }
    }
});
