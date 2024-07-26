<template>
  <div class="chat-container">
    <div v-if="error" class="error">
      <h3>Lỗi:</h3>
      <pre>{{ error }}</pre>
    </div>
    <div v-if="user" class="chat-interface">
      <div class="sidebar">
        <div class="user-info">
          <img :src="userInfo.image" alt="Ảnh đại diện" class="avatar" />
          <h2>{{ userInfo.username }}</h2>
        </div>
        <div class="user-list">
          <div v-for="chatUser in chatUsers" :key="chatUser.user_id" 
               @click="selectUser(chatUser)"
               class="user-item"
               :class="{ 'active': selectedUser && selectedUser.user_id === chatUser.user_id }">
            <img :src="chatUser.image" alt="Ảnh đại diện" class="avatar" />
            <div class="user-details">
              <span class="username">{{ chatUser.username }}</span>
              <span class="last-message">Xem trước tin nhắn cuối cùng...</span>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-window flex flex-end" v-if="selectedUser">
        <div class="chat-header">
          <img :src="selectedUserInfo.image" alt="Ảnh đại diện" class="avatar" />
          <div class="chat-name">{{ selectedUserInfo.username }}</div>
        </div>
        <div class="messages-container" ref="messagesContainer">
          <div v-for="message in messages" :key="message.id" class="message-wrapper">
            <div v-if="message.sender_id !== user.id" class="message-avatar">
              <img :src="getUserAvatar(message.sender_id)" alt="Ảnh đại diện" />
            </div>
            <div class="message"
                 :class="{ 'own-message': message.sender_id === user.id }">
              <div class="message-content">
                <p>{{ message.text }}</p>
              </div>
              <div class="message-time">{{ formatTime(message.created_at) }}</div>
            </div>
          </div>
        </div>
        <div class="input-container flex w-full">
          <div class="ui-input-container flex-grow">
            <input
              required=""
              v-model="newMessage" @keyup.enter="sendMessage" placeholder="Nhập tin nhắn..."
              class="ui-input"
              type="text"
            />
            <div class="ui-input-underline"></div>
            <div class="ui-input-highlight"></div>
          </div>
          <button class="th-p-btn gap-1 rounded-lg" @click="sendMessage">Gửi 
            <span class="mdi mdi-send"></span></button>
        </div>
      </div>
      <div v-else class="no-chat-selected w-full">
        <p>Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
      </div>
    </div>
    <div v-else>
      <p v-if="!user">Đang tải dữ liệu người dùng...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useChatStore } from '../stores/chat';
import { useAuthStore } from '../stores/auth';
import { useUserStore } from '../stores/user'; // Import the user store
import { storeToRefs } from 'pinia';
import axios from 'axios';

const chatStore = useChatStore();
const { user, messages, error } = storeToRefs(chatStore);
const userStore = useUserStore();
const authStore = useAuthStore();
const { user_id } = storeToRefs(authStore);

const newMessage = ref('');
const selectedUser = ref(null);
const selectedUserInfo = ref(null);
const userInfo = ref(null);
const messagesContainer = ref(null);
const chatUsers = ref([]);
const userMap = ref(new Map());

var api = import.meta.env.VITE_API_PORT;

const fetchChatUsers = async () => {
  try {
    const response = await axios.get(`${api}/chat/getall?user_id=${user_id.value}`);
    const users = response.data.filter(u => u !== user.value?.id);
    chatUsers.value = await Promise.all(users.map(async u_id => {
      const userInfo = await userStore.getUserInfo(u_id);
      userMap.value.set(u_id, { username: userInfo.username, image: userInfo.image });
      return { user_id: u_id, username: userInfo.username, image: userInfo.image };
    }));
  } catch (error) {
    console.error('Error fetching chat users:', error);
    chatUsers.value = []; // Handle error
  }
};

const fetchMessages = async () => {
  if (selectedUser.value) {
    try {
      await chatStore.fetchMessages(selectedUser.value.user_id);
      const uniqueUserIds = [...new Set(messages.value.map(msg => msg.sender_id))];
      await Promise.all(uniqueUserIds.map(async u_id => {
        if (!userMap.value.has(u_id)) {
          const userInfo = await userStore.getUserInfo(u_id);
          userMap.value.set(u_id, { username: userInfo.username, image: userInfo.image });
        }
      }));
      scrollToBottom(); // Scroll to the newest chat
    } catch (fetchError) {
      console.error('Error fetching messages:', fetchError);
    }
  }
};

const sendMessage = async () => {
  if (newMessage.value.trim() === '' || !selectedUser.value) return;
  try {
    await chatStore.sendMessage(selectedUser.value.user_id, newMessage.value);
    newMessage.value = '';
    if (selectedUser.value) {
      await axios.post(`${api}/chat/addtochat?user_id=${selectedUser.value.user_id}&user_id2=${user.value.id}`);
    }
  } catch (sendError) {
    console.error('Error sending message:', sendError);
  }
};

const selectUser = async (chatUser) => {
  selectedUser.value = chatUser;
  await fetchSelectedUserInfo(chatUser.user_id); // Fetch selected user info
  await fetchMessages();
};

const fetchSelectedUserInfo = async (user_id) => {
  try {
    const response = await userStore.getUserInfo(user_id);
    selectedUserInfo.value = response;
  } catch (error) {
    console.error('Error fetching selected user info:', error);
    selectedUserInfo.value = null;
  }
};

const getUserName = (user_id) => {
  return userMap.value.get(user_id)?.username || user_id;
};

const getUserAvatar = (user_id) => {
  return userMap.value.get(user_id)?.image || '';
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(async () => {
  try {
    await chatStore.autoLogin();
    const userInfoResponse = await userStore.getUserInfo(user_id.value); // Fetch current user info
    userInfo.value = userInfoResponse;
    userMap.value.set(user_id.value, { username: userInfoResponse.username, image: userInfoResponse.image });
    await fetchChatUsers();
  } catch (loginError) {
    console.error('Error during auto-login:', loginError);
  }
});

watch(messages, () => {
  if (messagesContainer.value) {
    scrollToBottom()
  }
}, { deep: true });


const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  font-family: Arial, sans-serif;
}

.chat-interface {
  display: flex;
  width: 100%;
  height: 100%;
}

.sidebar {
  width: 300px; /* Fixed width */
  flex-shrink: 0; /* Prevent shrinking */
}

.sidebar {
  width: 300px; /* Fixed width for sidebar */
  background-color: #0a0a0a;
  border-right: 1px solid #3b3b3b;
  display: flex;
  flex-direction: column;
  transition: none; /* Disable any transition affecting width */
}

.user-info {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #0f0f0f;
}

.user-list {
  overflow-y: auto;
  flex-grow: 1;
}

.user-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid var(--primary);
  transition: background-color 0.3s;
}

.user-item:hover, .user-item.active {
  background-color: #131313;
}

.user-details {
  margin-left: 10px;
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
  color: #fff;
}

.last-message {
  font-size: 0.8em;
  color: #666;
}

.chat-window {
  flex: 1; /* Allow chat window to take up remaining space */
  display: flex;
  flex-direction: column;
  background-color: #0e0e0e;
}

.chat-header {
  padding: 15px;
  background-color: #0e0e0e;
  border-bottom: 1px solid #202020;
  display: flex;
  align-items: center;
}

.chat-name {
  margin-left: 10px;
  font-size: 1.2em;
  font-weight: bold;
  color: #fff;
}

.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.message-avatar img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.message-wrapper {
  display: flex;
  align-items: center; /* Đặt avatar và tin nhắn vào đầu cùng hàng */
  margin-bottom: 15px;
}

.message-avatar {
  margin-right: 10px;
  display: flex;
  align-items: center;
}

.message {
  max-width: calc(100% - 50px); /* Điều chỉnh kích thước tin nhắn để phù hợp với không gian */
  padding: 10px;
  border-radius: 10px;
  position: relative;
  word-break: break-word;
  overflow-wrap: break-word;
  display: flex;
  align-items: center; /* Đảm bảo nội dung tin nhắn được căn chỉnh đúng */
}

.own-message {
  align-self: flex-end; /* Căn chỉnh tin nhắn của bạn sang bên phải */
  margin-left: auto; /* Đẩy tin nhắn của bạn sang bên phải */
}

.message-content {
  background-color: #2c2c2c;
  color: white;
  padding: 10px;
  border-radius: 10px;
  position: relative;
}

.own-message .message-content {
  background-color: #ffc876;
  color: black;
}

.message:before {
  content: '';
  position: absolute;
  bottom: 4px;
  width: 0;
  height: 0;
  border-style: solid;
}

.message:not(.own-message):before {
  border-width: 10px 10px 0;
  border-color: #2c2c2c transparent transparent transparent;
  left: 15px;
}

.message.own-message:before {
  border-width: 10px 0 0 10px;
  border-color: #ffc876 transparent transparent transparent;
  right: 15px;
}

.message-time {
  font-size: 0.7em;
  color: #999;
  margin-top: 5px;
  text-align: right;
  position: absolute;
  bottom: -20px;
  right: 10px;
  min-width: 60px;
  white-space: nowrap;
}

.message-content {
  white-space: pre-wrap;
  word-wrap: break-word;
  padding-bottom: 20px;
}

.input-container {
  background: #0e0e0e;
  padding: 20px 10px;
  display: flex;
  align-items: center;
  border-top: 1px solid #202020;
}

.ui-input-container {
  position: relative;
  flex-grow: 1;
  margin-right: 10px;
}

.ui-input {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  border: none;
  border-bottom: 2px solid #ccc;
  outline: none;
  background-color: transparent;
  transition: border-color 0.3s;
}

.ui-input:focus {
  border-color: var(--primary);
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
  color: #ccc;
  transition: color 0.3s;
}

.ui-input:focus ~ .ui-input-icon {
  color: #6c63ff;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.no-chat-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.2em;
  color: #999;
}
</style>