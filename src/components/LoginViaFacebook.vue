<template>
  <HFaceBookLogin 
    v-slot="fbLogin" 
    app-id="820616059509992" 
    @onSuccess="onSuccess" 
    @onFailure="onFailure"
    scope="email,public_profile"
    fields="id,name,email,first_name,last_name,birthday"
  >
    <div class="flex justify-center items-center w-full">
      <div 
        @click="fbLogin.initFBLogin" 
        class="th-s-btn w-96 flex items-center justify-between"
      >
        <i class="fa-brands fa-facebook-f ml-2"></i>
        <span class="flex-1 text-center">Đăng nhập với Facebook</span>
        <div class="w-6"></div>
      </div>
    </div>
  </HFaceBookLogin>
</template>

<script setup>
import { HFaceBookLogin } from '@healerlab/vue3-facebook-login';

const onSuccess = (response) => {
  console.log('Facebook login successful:', response);
  // Extract user info and token from response
  const { id, name, email, first_name, last_name, birthday, accessToken } = response.authResponse;
  // Your logic to handle the response, e.g., store the token, navigate, etc.
};

const onFailure = (error) => {
  console.error('Facebook login failed:', error);
  // Your logic if auth failed, e.g., show an error message
};
</script>
