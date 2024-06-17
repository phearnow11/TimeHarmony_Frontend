<template>
  <div v-if="auth.user_id" class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-1/4 p-4 border-r border-gray-99">
      <div class="mb-4">
        <router-link to="/">
          <img class="w-auto h-14" src="../assets/time-harmony.png" alt="">
        </router-link>
        <div class="ui-input-container">
          <input
          type="text"
          placeholder="Search..."
          required
          class="ui-input"
          />
          <div class="ui-input-underline"></div>
          <div class="ui-input-highlight"></div>
        </div>
      </div>
      <ul>
        <li v-for="user in users" :key="user.name" class="mb-2 flex items-center">
          <img :src="user.avatar" alt="Avatar" class="w-10 h-10-full mr-2" />
          <div>
            <div class="font-bold">{{ user.name }}</div>
            <div :class="{'text-green-500': user.online, 'text-gray-500': !user.online}">
              {{ user.online ? 'Online' : 'Offline' }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- Chat Area -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <div class="flex items-center p-4 border-b border-gray-300">
        <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Avatar" class="w-10 h-10-full mr-2" />
        <div class="flex-1">
          <div class="font-bold">Sharon Lessman</div>
          <div class="text-gray-500 text-sm">Typing...</div>
        </div>
        <div class="flex space-x-2">
          <button class="p-2 text-secondary"><i class="fas fa-phone"></i></button>
          <button class="p-2 text-secondary"><i class="fas fa-video"></i></button>
        </div>
      </div>
      <!-- Messages -->
      <div ref="messageContainer" class="flex-1 p-4 overflow-y-scroll">
        <div v-for="message in messages" :key="message.time" class="mb-4">
          <div class="flex items-start" :class="{'justify-end': message.sender === 'You'}">
            <img :src="message.avatar" alt="Avatar" class="w-10 h-10-full mr-2" />
            <div class="max-w-xs">
              <div class="font-bold">{{ message.sender }}</div>
              <div class="bg-gray-700 p-2">{{ message.text }}</div>
            </div>
            <div class="text-gray-500 text-xs ml-2">{{ message.time }}</div>
          </div>
        </div>
      </div>
      <!-- Message Input -->
      <div class="p-4 border-t border-gray-300 flex items-center">
        <input
          type="text"
          v-model="newMessage"
          placeholder="Type your message"
          class="flex-1 bg-black p-2"
          @keyup.enter="sendMessage"
        />
        <button @click="sendMessage" class="p-2 text-secondary ml-2">Send</button>
      </div>
    </div>
  </div>
  <div v-else class="h-screen flex flex-col items-center justify-center">
    <div>
      <p class="text-xl font-medium text-center">You need to login to use this function, <router-link class="hover-underline-animation" to="/login">Log in now</router-link></p>
    </div>
    <div class="mt-4">
      <router-link to="/" class="hover-underline-animation">Go back to Home</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();

const users = ref([
  { name: 'Vanessa Tucker', online: true, avatar: 'https://randomuser.me/api/portraits/women/1.jpg' },
  { name: 'William Harris', online: true, avatar: 'https://randomuser.me/api/portraits/men/2.jpg' },
  { name: 'Sharon Lessman', online: true, avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
  { name: 'Christina Mason', online: false, avatar: 'https://randomuser.me/api/portraits/women/4.jpg' },
  { name: 'Fiona Green', online: false, avatar: 'https://randomuser.me/api/portraits/women/5.jpg' },
  { name: 'Doris Wilder', online: false, avatar: 'https://randomuser.me/api/portraits/women/6.jpg' },
  { name: 'Haley Kennedy', online: false, avatar: 'https://randomuser.me/api/portraits/women/7.jpg' },
  { name: 'Jennifer Chang', online: false, avatar: 'https://randomuser.me/api/portraits/women/8.jpg' },
]);

const messages = ref([
  { sender: 'Sharon Lessman', text: 'Cras pulvinar, sapien id vehicula aliquet, diam velit elementum orci.', time: '2:37 am', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { sender: 'You', text: 'Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.', time: '2:38 am', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' },
  { sender: 'Sharon Lessman', text: 'Sit meis deleniti eu, pri vidit meliore docendi ut, an eum erat animal commodo.', time: '2:39 am', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { sender: 'You', text: 'Cum ea graeci tractatos.', time: '2:40 am', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' },
  { sender: 'You', text: 'Morbi finibus, lorem id placerat ullamcorper, nunc enim ultrices massa, id dignissim metus urna eget purus.', time: '2:41 am', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' },
  { sender: 'Sharon Lessman', text: 'Sed pulvinar, massa vitae interdum pulvinar, risus lectus porttitor magna, vitae commodo lectus mauris et velit. Proin ultrices placerat imperdiet. Morbi varius quam ac venenatis tempus.', time: '2:42 am', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { sender: 'You', text: 'Lorem ipsum dolor sit amet, vis erat denique in, dicunt prodesset te vix.', time: '2:43 am', avatar: 'https://randomuser.me/api/portraits/men/10.jpg' },
  { sender: 'Sharon Lessman', text: 'Sit meis deleniti eu, pri vidit meliore docendi ut, an eum erat animal commodo.', time: '2:44 am', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
]);

const newMessage = ref('');
const messageContainer = ref(null);

function sendMessage() {
  if (newMessage.value.trim() !== '') {
    messages.value.push({
      sender: 'You',
      text: newMessage.value,
      time: new Date().toLocaleTimeString(),
      avatar: 'https://randomuser.me/api/portraits/men/10.jpg'
    });
    newMessage.value = '';
    nextTick(() => {
      scrollToBottom();
    });
  }
}

function scrollToBottom() {
  const container = messageContainer.value;
  container.scrollTop = container.scrollHeight;
}

onMounted(() => {
  scrollToBottom();
});
</script>

<style scoped>
.ui-input-container {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.ui-input {
  width: 100%;
  padding: 10px 10px 10px 40px;
  font-size: 1em;
  border: none;
  border-bottom: 2px solid #ccc;
  background-color: transparent;
  transition: border-color 0.3s, background-color 0.3s, padding 0.3s;
}

.ui-input:focus {
  border-color: var(--secondary);

  padding: 10px 10px 10px 40px; /* Ensuring the padding remains the same on focus */
}

.ui-input-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background-color: var(--primary);
  transform: scaleX(0);
  transition: transform 0.3s;
}

.ui-input:focus + .ui-input-underline {
  transform: scaleX(1);
}

.ui-input-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 0;
  background-color: var(--back);
  transition: width 0.3s;
}

.ui-input:focus ~ .ui-input-highlight {
  width: 100%;
}

.ui-input-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  transition: color 0.3s;
}

.ui-input:focus ~ .ui-input-icon {
  color: #e6c591;
}

.ui-input-icon svg {
  width: 20px;
  height: 20px;
}
</style>
