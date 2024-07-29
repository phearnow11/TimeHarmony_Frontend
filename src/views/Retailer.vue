<template>
  <section class="grid grid-cols-3">
    <div class="left p-20 flex flex-col items-center">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <img :src="retailer.image" alt="user Image" class="avatar" />
        </div>
      </div>
      <div class="bg-secondary h-0.5 w-full mt-6"></div>
    </div>
    <div class="col-span-2 right p-10">
      <div class="name-tag flex gap-3 justify-start items-center">
        <strong class="text-5xl capitalize name text-white">
          {{ retailer.first_name }} {{ retailer.last_name }}
        </strong>
        <div class="location hover-underline-animation">
          <p v-if="defaultAddress">
            <span class="mdi mdi-map-marker"></span> {{ defaultAddress }}
          </p>
          <p v-else>
            <span class="mdi mdi-map-marker"></span> N/A
          </p>
        </div>
      </div>
      <div class="text-white">
        {{ retailer.username }} <span class="mdi mdi-check-decagram-outline text-blue-500"></span>
      </div>
      <br>
      <strong class="text-primary">Đánh giá</strong>
      <div class="rating">
        <p class="text-2xl mr-2">{{ rating.toFixed(1) }}</p>
        <div v-for="star in 5" :key="star" class="star-container">
          <input :id="'star-' + star" type="radio" name="star-radio" :value="star" v-model="selectedRating">
          <label :for="'star-' + star" @click="updateRating(star)">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" :class="{ filled: star <= selectedRating }">
              <path pathLength="360" d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"></path>
            </svg>
          </label>
        </div>
      </div>
      <div class="flex items-center justify-center mt-6 mb-6">
        <p class="text-primary w-40">Thông tin liên hệ</p>
        <div class="bg-secondary h-0.5 w-full"></div>
      </div>
      <div class="flex justify-between">
        <div class="gap-10 flex items-center">
          <a :href="`tel:${retailer.phone}`" class="hover-underline-animation"><span class="mdi mdi-phone"></span> {{ retailer.phone?retailer.phone:"N/A" }}</a>
        <a :href="`mailto:${retailer.email}`" class="hover-underline-animation">
        <span class="mdi mdi-email"></span>
        {{ retailer.email ? retailer.email : "N/A" }}
        </a>   
            
        <button class="th-s-btn" @click="mess">Nhắn tin</button>
        </div>

        <div class="flex items-center">
          <button @click="openReportModal" class="hover-underline-animation-r">Báo cáo</button>
        </div> 
      </div>
      <div class="flex items-center justify-center mt-6 mb-6">
        <div class="w-44">
          <label>
            <span class="text-primary">Đồng hồ đăng bán</span>
          </label>
        </div>
        <div class="bg-secondary h-0.5 w-full"></div>
      </div>
      <div class="grid grid-cols-4 gap-2">
          <product-card
            v-for="i in approvedWatches" :key="i"
            :productName="i.watch_name"
            :productImage="i.image_url[0]"
            :retailerName="retailer.username"
            :retailerAvatar="retailer.image"
            :price="i.price"
            :watch_id="i.watch_id"
            :seller_id="`/retailer/${retailer.user_id}`"
          />
      </div>
      <!-- <div class="flex justify-center items-center mt-10">
        <a class="hover-underline-animation" :href="`/discover/seller searching result?page=0&store=${retailer.username}`">Show more watches</a>
    </div> -->
    </div>
     <!-- Report Modal -->
     <div v-if="showReportModal" class="modal-overlay">
      <div class="modal">
        <h2>Báo cáo tài khoản này</h2>
        <textarea v-model="message" placeholder="Lý do.." rows="4"></textarea>
        <div class="modal-actions">
          <button @click="submitReport" class="th-p-btn">Hoàn tất</button>
          <button @click="closeReportModal" class="th-s-btn">Hủy</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import ProductCard from '../components/ProductCard.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';
import { useChatStore } from '../stores/chat';
import axios from 'axios';
 
var api = import.meta.env.VITE_API_PORT
const route = useRoute();
const userStore = useUserStore();
const addresses = ref([]);
const retailer = ref({
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  phone: "",
  image: "",
  active: "",
  user_id: "",
  watches: [],
});

const selectedRating = ref(0);
const rating = ref(0);
const message = ref('')

const updateRating = (star) => {
  selectedRating.value = star;
  rating.value = star; // For demonstration, you can implement average rating logic
};

const defaultAddress = computed(() => {
  if (addresses.value && addresses.value.length > 0) {
    const defaultAddr = addresses.value.find(addr => addr.isDefault === true);
    console.log('Default address object:', defaultAddr);
    return defaultAddr ? defaultAddr.address : addresses.value[0].detail;
  }
  return null;
});

const approvedWatches = computed(() => {
  return retailer.value.watches.filter(watch => watch.state === 1);
});

onMounted(async () => {
  const userId = route.params.seller_id;
  try {
    const userInfo = await userStore.getUserInfo(userId);
    retailer.value = userInfo;
    console.log("Fetched retailer info:", userInfo);

    // Fetch address information separately
    const addressData = await userStore.getAddressDetails(userId);
    addresses.value = addressData;
    console.log("Fetched address info:", addresses.value);
  } catch (error) {
    console.error('Error fetching retailer info:', error);
  }
});

const mess = () => {
  useChatStore().addToChat(retailer.value.user_id)
  .then(() => {
    window.location.replace('/chat');
  });
};

// Modal related state and methods
const showReportModal = ref(false);

const openReportModal = () => {
  showReportModal.value = true;
  document.body.classList.add('no-scroll');
};

const closeReportModal = () => {
  showReportModal.value = false;
  document.body.classList.remove('no-scroll');
  message.value = '';
};

const submitReport = () => {
  if (message.value.trim() === '') {
    alert('Please enter a reason for reporting.');
    return;
  }
  // Handle the report submission logic here
  axios.post(`${api}/chat/addtochat?user_id=${import.meta.env.VITE_ADMIN_USERID}&user_id2=${userStore.user_id}`);
  useChatStore().sendMessage(import.meta.env.VITE_ADMIN_USERID, `Báo cáo người dùng "${retailer.value.username} : ${retailer.value.user_id}", lý do: ${message.value}.`)
  closeReportModal();
};
</script>

<style scoped>
.rating {
  display: flex;
  gap: 0.3rem;
  --stroke: #666;
  --fill: #ffc73a;
}

.rating input {
  display: none;
}

.rating label {
  cursor: pointer;
}

.rating svg {
  width: 2rem;
  height: 2rem;
  overflow: visible;
  fill: transparent;
  stroke: var(--stroke);
  stroke-linejoin: bevel;
  stroke-dasharray: 12;
  animation: idle 4s linear infinite;
  transition: stroke 0.2s, fill 0.5s;
}

.rating label:hover svg,
.rating svg.filled {
  stroke: var(--fill);
  fill: var(--fill);
}

@keyframes idle {
  from {
    stroke-dashoffset: 24;
  }
}

.rating input:checked ~ label svg {
  transition: 0s;
  animation: idle 4s linear infinite, yippee 0.75s backwards;
  fill: var(--fill);
  stroke: var(--fill);
  stroke-opacity: 0;
  stroke-dasharray: 0;
  stroke-linejoin: miter;
  stroke-width: 8px;
}

@keyframes yippee {
  0% {
    transform: scale(1);
    fill: var(--fill);
    fill-opacity: 0;
    stroke-opacity: 1;
    stroke: var(--stroke);
    stroke-dasharray: 10;
    stroke-width: 1px;
    stroke-linejoin: bevel;
  }
  30% {
    transform: scale(0);
    fill: var(--fill);
    fill-opacity: 0;
    stroke-opacity: 1;
    stroke: var(--stroke);
    stroke-dasharray: 10;
    stroke-width: 1px;
    stroke-linejoin: bevel;
  }
  30.1% {
    stroke: var(--fill);
    stroke-dasharray: 0;
    stroke-linejoin: miter;
    stroke-width: 8px;
  }
  60% {
    transform: scale(1.2);
    fill: var(--fill);
  }
}

.avatar-container {
  width: 20vw; /* Adjust this value as needed */
  height: 20vw; /* Set the height equal to the width to make it square */
  overflow: hidden; /* Hide any overflow to ensure the image fits within the container */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.avatar-wrapper {
  width: 100%;
  height: 100%;
  border: 3px solid var(--primary); /* Ensure the border is applied to the wrapper */
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Ensure the image covers the container */
}

.select {
  display: flex;
  flex-direction: row;
}

.mydict:hover label {
  color: var(--secondary);
}

.mydict .form {
  color: #fff;
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  justify-content: center;
  flex-direction: column;
}

.mydict input[type="radio"] {
  clip: rect(0 0 0 0);
  clip-path: inset(100%);
  height: 1px;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.mydict input[type="radio"]:checked + span {
  box-shadow: 0 0 0 0.0625em #FFBD59;
  background-color: #5232003a;
  z-index: 1;
  color: #FFBD59;
}

label .select-op {
  display: block;
  cursor: pointer;
  padding: 0.375em .75em;
  position: relative;
  margin-left: .0625em;
  box-shadow: 0 0 0 0.0625em #b5bfd9;
  letter-spacing: .05em;
  color: #fff;
  text-align: center;
  transition: background-color .5s ease;
}

.radio-inputs .radio {
  flex: 1 1 auto;
}

.radio-inputs .radio input {
  display: none;
}

.radio-inputs .radio .name {
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  color: var(--secondary);
  transition: all 0.15s ease-in-out;
}

.radio-inputs .radio input:checked + .name {
  background-color: var(--primary);
  color: black;
}

.radio-inputs:focus {
  display: flex;
  border: 1px solid var(--secondary);
  box-sizing: border-box;
  box-shadow: 0 0 0px 1px rgba(0, 0, 0, 0.06);
  padding: 0.25rem;
  width: 300px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .radio-inputs {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .radio-inputs {
    width: 100%;
    font-size: 12px;
  }

  .radio-inputs .radio .name {
    padding: 0.15rem;
  }
}

@media (max-width: 360px) {
  .radio-inputs {
    width: 100%;
    font-size: 10px;
  }

  .radio-inputs .radio .name {
    padding: 0.1rem;
  }
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background: #222222;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  z-index: 1000; /* Ensure the modal is above all other content */
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  gap: 3px;
}

textarea {
  color:rgb(0, 0, 0);
  width: 100%;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  resize: none;
}
</style>
