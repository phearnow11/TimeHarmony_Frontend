<template>
    <div v-if="auth.user_id" class="flex max-w-7xl mx-auto my-8 p-4">
      <!-- Sidebar -->
      <div class="w-1/4 mr-8">
        <h2 class="text-2xl mb-4">Profile Settings</h2>
        <ul>
          <li class="mb-2 text-secondary">Account</li>
          <li class="mb-2"><router-link to="/setting/password" class="hover-underline-animation">Password</router-link></li>
          <li class="mb-2"><router-link to="#" class="hover-underline-animation">My Purchase</router-link></li>
          <li class="mb-2"><router-link to="#" class="hover-underline-animation">Delete account</router-link></li>
        </ul>
      </div>
      <!-- Content -->
      <div class="flex-1">
        <!-- Public Info -->
        <div class="mb-8 p-4">
          <div class="mt-6 mb-6 text-left">
            <img :src="user.image" alt="Avatar" class="w-28 h-32 mb-4">
            <p class="mb-4">For best results, use an image at least 128px by 128px in jpg format</p>
            <input type="file" class="th-p-btn hidden" @change="triggerFileInput">Upload</input>
          </div>
          <h3 class="text-xl mb-4">Public info</h3>
          <form>
            <div class="form__group field w-96">
            <input
              type="text"
              class="form__field mb-4 w-full"
              v-model="user.username"
              :placeholder="user.username"
              required
            />
            <label for="username" class="form__label">Username</label>
          </div>
            <button type="submit" class="th-p-btn">Save changes</button>
          </form>
        </div>
        <!-- Private Info -->
        <div class="p-4">
          <h3 class="text-xl mb-4">Private info</h3>
          <form>
            <div class="flex">
              <div class="form__group field mr-2 w-96">
                <input
            type="text"
            class="form__field w-full"
            v-model="user.first_name"
            :placeholder="user.first_name"
            required
          />
          <label for="first_name" class="form__label">First Name</label>
          </div>
          <div class="form__group ml-2 field w-96">
            <input
              type="text"
              class="form__field w-full"
              v-model="user.last_name"
              :placeholder="user.last_name"
              required
            />
            <label for="last_name" class="form__label">Last Name</label>
          </div>
            </div>
            <div class="form__group field w-96">
            <input
              type="text"
              class="form__field w-full"
              v-model="user.phone"
              :placeholder="user.phone"
              required
            />
            <label for="phone" class="form__label">Phone Number</label>
          </div>
            <div class="form__group field w-96">
            <input
              type="text"
              class="form__field w-full"
              v-model="user.email"
              :placeholder="user.email"
              required
            />
            <label for="email" class="form__label">Email</label>
          </div>
          <div class="form__group field w-96">
            <input
              type="text"
              class="form__field mb-4 w-full"
              v-model="user.address"
              :placeholder="user.address"
              required
            />
            <label for="address" class="form__label">Address</label>
          </div>
            <button type="submit" class="th-p-btn">Save changes</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '../../stores/auth';
  import { onMounted, ref } from 'vue';
import { useUserStore } from '../../stores/user';
  
  const user = useUserStore();
  const auth = useAuthStore();

  onMounted(() => {
    if (!auth.user_id) {
      // Handle user not logged in, e.g., redirect to login page
      // For example, using Vue Router's push method:
      // router.push('/login');
      console.log('User is not logged in. Redirecting to login...');
    }
  });

  function triggerFileInput(event) {
    console.log(event);
  }

  </script>
  
<style scoped>

</style>
  