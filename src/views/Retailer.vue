<template>
  <section class="grid grid-cols-3">
    <div class="left p-20">
      <img :src="retailer.image" alt="Retailer Image" class="w-full h-auto avatar">
      <div class="bg-secondary h-0.5 w-full mt-6"></div>
    </div>
    <div class="col-span-2 right p-10">
      <div class="name-tag flex gap-3 justify-start items-center">
        <strong class="text-5xl capitalize name text-white">
          {{ retailer.first_name }} {{ retailer.last_name }}
        </strong>
        <div class="location hover-underline-animation">
          <p><span class="mdi mdi-map-marker"></span> Ho Chi Minh City</p>
        </div>
      </div>
      <div class="text-white">
        {{ retailer.username }} <span class="mdi mdi-check-decagram-outline text-blue-500"></span>
      </div>
      <br>
      <strong class="text-primary">RATINGS</strong>
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
        <p class="text-primary w-40">KEEP IN TOUCH</p>
        <div class="bg-secondary h-0.5 w-full"></div>
      </div>
      <div class="flex gap-10 items-center">
        <button class="th-s-btn gap-2">Send message <span class="mdi mdi-message-text-outline"></span></button>
        <router-link class="hover-underline-animation"><span class="mdi mdi-phone"></span> {{ retailer.phone }}</router-link>
        <router-link class="hover-underline-animation-r">Report user</router-link>
      </div>
      <div class="flex items-center justify-center mt-6 mb-6">
        <div class="select gender-select mydict w-96 flex items-center">
          <label>
            <input type="radio" name="radio" checked id="defaut-gender" value="contact">
            <span class="select-op">Contact</span>
          </label>
          <label>
            <input type="radio" name="radio" value="sell-watches">
            <span class="select-op">My selling watches</span>
          </label>
        </div>
        <div class="bg-secondary h-0.5 w-full"></div>
      </div>
      <div class="grid grid-cols-5 gap-2">
          <product-card
            v-for="i in 15" :key="i"
            :productName="test"
            :productImage="dsaada"
            :retailerName="sadahjhhkjhkjd"
            :retailerAvatar="adsaddada"
            :price="123313"
            :link="`/detail/asdad`"
            :seller_id="`/retailer/asdadaadsd`"
          />
      </div>
      <div class="flex justify-center items-center mt-10">
        <router-link class="hover-underline-animation" to="/discover/watches for you?page=0">Show more watches</router-link>
    </div>
    </div>
  </section>
</template>

<script setup>
import ProductCard from '../components/ProductCard.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user';

const route = useRoute();
const userStore = useUserStore();
const retailer = ref({
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  address: "",
  phone: "",
  image: "",
  active: "",
  user_id: "",
});

const selectedRating = ref(0);
const rating = ref(0);

const updateRating = (star) => {
  selectedRating.value = star;
  rating.value = star; // For demonstration, you can implement average rating logic
};

onMounted(async () => {
  const userId = route.params.seller_id;
  try {
    const userInfo = await userStore.getUserInfo(userId);
    retailer.value = userInfo;
    console.log("Fetched retailer info:", userInfo);
  } catch (error) {
    console.error('Error fetching retailer info:', error);
  }
});
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

.avatar {
  border: 1px solid var(--primary);
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
</style>
