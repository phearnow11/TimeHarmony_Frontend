<template>
  <div class="chat-container">
    <div v-if="error" class="error">
      <h3>Error:</h3>
      <pre>{{ error }}</pre>
    </div>
    <div v-if="user" class="chat-interface">
      <h2>Welcome, {{ user.id }}</h2>
      <div class="user-list">
        <h3>Users:</h3>
        <ul>
          <li v-for="chatUser in chatUsers" :key="chatUser" @click="selectUser(chatUser)">
            {{ chatUser }}
          </li>
        </ul>
      </div>
      <div v-if="selectedUser" class="chat-window">
        <h3>Chatting with {{ selectedUser }}</h3>
        <div class="messages-container" ref="messagesContainer">
          <div v-for="message in messages" :key="message.id" class="message" :class="{ 'own-message': message.sender_id === user.id }">
            <div class="message-content">
              <strong>{{ message.sender_id }}:</strong> {{ message.text }}
            </div>
            <div class="message-time">{{ formatTime(message.created_at) }}</div>
          </div>
        </div>
        <div class="input-container">
          <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
          <button @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p v-if="!user">Loading user data...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useChatStore } from '../stores/chat';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';
import axios from 'axios';

const chatStore = useChatStore();
const { user, messages, error } = storeToRefs(chatStore);

const newMessage = ref('');
const selectedUser = ref(null);
const messagesContainer = ref(null);
const chatUsers = ref([]);

var api = import.meta.env.VITE_API_PORT

const fetchChatUsers = async () => {
  try {
    const response = await axios.get(`${api}/chat/getall?user_id=${useAuthStore().user_id}`);
    chatUsers.value = response.data.filter(u => u !== user.value?.id);
  } catch (error) {
    console.error('Error fetching chat users:', error);
    chatUsers.value = []; // Handle error
  }
};

const fetchMessages = async () => {
  if (selectedUser.value) {
    try {
      await chatStore.fetchMessages(selectedUser.value);
    } catch (fetchError) {
      console.error('Error fetching messages:', fetchError);
    }
  }
};

const sendMessage = async () => {
  if (newMessage.value.trim() === '' || !selectedUser.value) return;
  try {
    await chatStore.sendMessage(selectedUser.value, newMessage.value);
    newMessage.value = '';
    if (selectedUser.value) {
      console.log(selectedUser.value);
      await axios.post(`${api}/chat/addtochat?user_id=${selectedUser.value}&user_id2=${user.value.id}`);
    }
  } catch (sendError) {
    console.error('Error sending message:', sendError);
  }
};

const selectUser = async (chatUser) => {
  selectedUser.value = chatUser;
  chatStore.registerUser2(chatUser)
  console.log(chatUser);
  await fetchMessages();
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(async () => {
  try {
    await chatStore.autoLogin();
    await fetchChatUsers();
  } catch (loginError) {
    console.error('Error during auto-login:', loginError);
  }
});

watch(messages, () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
}, { deep: true });

</script>
