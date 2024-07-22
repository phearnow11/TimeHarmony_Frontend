import axios from "axios";
import { defineStore } from "pinia";
import router from "../router";
import Cookies from "js-cookie";
import { useUserStore } from "./user";
import { useCartStore } from './cart';

var api = import.meta.env.VITE_API_PORT

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user_id: Cookies.get('user_id') ? Cookies.get('user_id') : null,
        token: Cookies.get('token') ? Cookies.get('token') : null,
        returnURL: '/',
    }),
    actions: {
        login(username, password, remember) {
            axios.post(
                `${api}/api/auth/login`,
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
                    const cartStore = useCartStore();
                    const userStore = useUserStore();
                    cartStore.getCart(this.user_id);
                    userStore.setCartNum(cartStore.cart_count);
                    router.push(this.returnURL || '/');
                }
            })
            .catch((error) => {
                console.error('Error logging in:', error);
            });
        },
        logout() {
            axios.post(`${api}/api/auth/logout?member_id=${this.user_id}`)
            this.user_id = null;
            this.token = null;
            Cookies.remove('token');
            Cookies.remove('user_id');
            useUserStore().updateCartCount(0);
            router.push('/');
        },
        
        resetPass(oldpass,username,newpass){
            const checkPass = axios.get(`${api}/member/check/password/${username}?pwd=${oldpass}`)
            if(checkPass.data === 'correct password'){
                const res = axios.patch(`${api}/member/update/user/password/${username}?npwd=${newpass}`)
                console.log(res.data);
            } else{
                console.log('Error at old password');
                return;
            }
        },
        async resetPassword(username,newpass){
            try {
                const res = await axios.patch(`${api}/member/update/user/password/${username}?npwd=${newpass}`)
                console.log(res.data);
            } catch (error) {
                console.log('Error');
            }
        },
        emailVerify(email, input){
            const verify = axios.get(`${api}/api/auth/verify/google/getcode?email=${email}`)
            if(input === verify.data){
                return true;
            } else{
                return false;
            }
        }, 
        async forgotPassword(email) {
            try {
              const response = await axios.get(`${api}/api/auth/verify/password/getcode?email=${email}`);
              return response.data;
            } catch (error) {
              console.error('Error in forgotPassword:', error);
              throw error;
            }
          },
        
        

    }
});
