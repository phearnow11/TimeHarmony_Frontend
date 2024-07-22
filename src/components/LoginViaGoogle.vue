<template>
  <div class="flex justify-center items-center w-full">
    <div @click="login" class="th-s-btn w-96 flex items-center justify-between">
      <i class="fa-brands fa-google ml-2"></i>
      <span class="flex-1 text-center">Đăng nhập với Google</span>
      <div class="w-6"></div>
    </div>
  </div>
</template>

<script>
import { googleSdkLoaded } from "vue3-google-login";
import axios from "axios";
import router from "../router";
import { useAuthStore } from "../stores/auth"; // Import auth store

export default {
  data() {
    return {
      userDetails: null
    };
  },
  name: "LoginViaGoogle",
  methods: {
    login() {
      googleSdkLoaded(google => {
        google.accounts.oauth2
          .initCodeClient({
            client_id: "857514877920-q0270v9t6jg5m9k7gdmcdejfllo1e8c6.apps.googleusercontent.com",
            scope: "email profile openid",
            redirect_uri: "http://localhost:4000/auth/callback",
            callback: response => {
              if (response.code) {
                this.sendCodeToBackend(response.code);
              }
            }
          })
          .requestCode();
      });
    },
    async sendCodeToBackend(code) {
      const authStore = useAuthStore(); // Use auth store
      try {
        const response = await axios.post(
          "https://oauth2.googleapis.com/token",
          {
            code,
            client_id: "857514877920-q0270v9t6jg5m9k7gdmcdejfllo1e8c6.apps.googleusercontent.com",
            client_secret: "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",
            redirect_uri: "postmessage",
            grant_type: "authorization_code"
          }
        );

        const accessToken = response.data.access_token;
        console.log(accessToken);

        // Fetch user details using the access token
        const userResponse = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
        );

        if (userResponse && userResponse.data) {
          // Set user details and token in auth store
          const user = userResponse.data;
          // authStore.user = user;
          // authStore.token = accessToken;

          // // Save token and user in cookies
          // Cookies.set('token', accessToken, { expires: 7 });
          // Cookies.set('user', JSON.stringify(user), { expires: 7 });

          console.log(user.email);
          useAuthStore().loginGoogle(accessToken)
        } else {
          console.error("Failed to fetch user details.");
        }
      } catch (error) {
        // Check if 'response' property exists before accessing 'data'
        if (error.response && error.response.data) {
          console.error("Token exchange failed:", error.response.data);
        } else {
          console.error("Token exchange failed:", error.message);
        }
      }
    }
  }
};
</script>
