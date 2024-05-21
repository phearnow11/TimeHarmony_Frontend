<template>
  <div class="flex justify-center items-center w-full">
        <div @click="login" class="th-s-btn w-96 flex items-center justify-between">
          <i class="fa-brands fa-google ml-2"></i>
          <span class="flex-1 text-center">Login via Google</span>
          <div class="w-6"></div>
        </div>
      </div>
</template>

<script>
import { googleSdkLoaded } from "vue3-google-login";
import axios from "axios";
import { useUserStore } from "../stores/user";
import router from "../router";

const user = useUserStore()

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
            client_id:
              "857514877920-q0270v9t6jg5m9k7gdmcdejfllo1e8c6.apps.googleusercontent.com",
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
      try {
        const response = await axios.post(
          "https://oauth2.googleapis.com/token",
          {
            code,
            client_id:
              "857514877920-q0270v9t6jg5m9k7gdmcdejfllo1e8c6.apps.googleusercontent.com",
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
          // Set the userDetails data property to the userResponse object
          this.userDetails = userResponse.data;
          user.username = this.userDetails.name
          console.log(user.username);
          router.push('/')

        } else {
          // Handle the case where userResponse or userResponse.data is undefined
          console.error("Failed to fetch user details.");
        }
      } catch (error) {
        console.error("Token exchange failed:", error.response.data);
      }
    }
  }
};
</script>