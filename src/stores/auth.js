import axios from "axios";
import { defineStore } from "pinia";
import router from "../router";
import Cookies from "js-cookie";
import { useUserStore } from "./user";
import { useCartStore } from './cart';
import { useChatStore } from "./chat";

var api = import.meta.env.VITE_API_PORT

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user_id: Cookies.get('user_id') ? Cookies.get('user_id') : null,
        token: Cookies.get('token') ? Cookies.get('token') : null,
        returnURL: '/',
    }),
    actions: {
        async loginGoogle(token) {
            try {
                const res = await axios.post(`${api}/api/auth/login/google`, {}, {
                    params: { token }
                });

                if (res.status === 200) {
                    this.user_id = res.data.user;
                    this.token = res.data.token;
                    Cookies.set('token', this.token, { expires: 7 }); // Expires in 7 days
                    Cookies.set('user_id', this.user_id, { expires: 7 });
                    useChatStore().registerUser2(this?.user_id)
                    const cartStore = useCartStore();
                    const userStore = useUserStore();
                    await cartStore.getCart(this.user_id);
                    userStore.setCartNum(cartStore.cart_count);
                    router.push(this.returnURL || '/');
                }
            } catch (error) {
                console.error('Error logging in with Google:', error);
                throw error;
            }
        },

        async login(username, password) {
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
                    Cookies.set('user_id', this.user_id, { expires: 7 });
                    useChatStore().registerUser2(this?.user_id)


                    useUserStore().loadUser(this.user_id).
                    then((userData) =>{
                        console.log(userData.role);
                        if(userData.role === 'ROLE_ADMIN')
                            router.push('/admin')
                        if(userData.staff_role === 'APPRAISER')
                            router.push('/appraiser')
                    });
                    
                    const cartStore = useCartStore();
                    const userStore = useUserStore();
                    cartStore.getCart(this.user_id);
                    userStore.setCartNum(cartStore.cart_count);
                    router.push(this.returnURL || '/');
                } 
                else{
                    throw new Error('Login failed');
                }
            })
            .catch((error) => {
                console.error('Error logging in:', error);
                
            });
        },
        async logout() {
            axios.post(`${api}/api/auth/logout?member_id=${this.user_id}`,{})
            this.user_id = null;
            this.token = null;
            Cookies.remove('token');
            Cookies.remove('user_id');
            useUserStore().updateCartCount(0);
            router.push('/');
        },
        
        async resetPass(oldpass, username, newpass) {
            try {
                // Check the old password
                const checkPassResponse = await axios.get(`${api}/member/check/password/${username}?pwd=${oldpass}`);
                console.log('Check password response:', checkPassResponse.data);
        
                if (checkPassResponse.data === 'correct password') {
                    // If the old password is correct, update the password
                    const updateResponse = await axios.patch(`${api}/member/update/user/password/${username}?npwd=${newpass}`);
                    console.log('Update password response:', updateResponse.data);
        
                    // Return a success message or true
                    return 'Đổi mật khẩu thành công!';
                } else {
                    // Return an error message for incorrect old password
                    return 'Sai mật khẩu cũ!';
                }
            } catch (error) {
                // Handle any errors from the requests
                console.error('An error occurred:', error);
                return 'Có lỗi xảy ra khi đặt lại mật khẩu.';
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
        async emailVerify(email, input){
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
