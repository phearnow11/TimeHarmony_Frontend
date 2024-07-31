<template>
  <section class="grid grid-cols-3">
    <div class="left p-20 flex flex-col items-center">
      <div class="avatar-container">
        <div class="avatar-wrapper">
          <img :src="user.image" alt="user Image" class="avatar" />
        </div>
      </div>
      <div class="bg-secondary h-0.5 w-full mt-6"></div>
    </div>

    <div class="col-span-2 right p-10">
      <div class="name-tag flex gap-3 justify-start items-center">
        <strong class="text-5xl capitalize name text-white">
          {{ user.first_name }} {{ user.last_name }}
        </strong>
        <div class="location hover-underline-animation">
          <p v-if="defaultAddress">
            <span class="mdi mdi-map-marker"></span> {{ defaultAddress }}
          </p>
          <p v-else><span class="mdi mdi-map-marker"></span> N/A</p>
        </div>
      </div>
      <div class="text-white">
        {{ user.username }}
        <span class="mdi mdi-check-decagram-outline text-blue-500"></span>
      </div>
      <br />

      <div class="flex items-center justify-center mt-6 mb-6">
        <p class="text-primary w-40">Thông tin liên hệ</p>
        <div class="bg-secondary h-0.5 w-full"></div>
      </div>
      <div class="flex gap-5 items-center">
        <div class="hover-underline-animation"
          ><span class="mdi mdi-phone"></span> {{ useUserStore()?.phone ?? "Không có thông tin" }}</div
        >
        <div class="hover-underline-animation"
          ><span class="mdi mdi-email"></span>
          {{ useUserStore()?.email ? useUserStore()?.email : "Không có thông tin" }}</div
        >
      </div>
      <div class="flex items-center justify-between mt-6 mb-6">
        <select v-model="selectedState" class="bg-[#212121] text-primary p-2">
          <option value="all">Tất cả đồng hồ</option>
          <option value="approved">Đã được duyệt</option>
          <option value="pending">Đang chờ duyệt</option>
          <option value="deleted">Đã xoá</option>
        </select>
        <div class="bg-secondary h-0.5 w-full ml-4"></div>
      </div>

      <div class="grid grid-cols-4 gap-2">
        <MyselfCard
          v-for="i in filteredWatches"
          :key="i.watch_id"
          :productName="i.watch_name"
          :productImage="i.image_url[0]"
          :price="i.price"
          :state="i.state"
          :watch_id="i.watch_id"
          :seller_id="useUserStore().user_id"
        />
      </div>
      <div
        v-if="filteredWatches.length === 0"
        class="text-center text-gray-500 mt-4"
      >
        Không có đồng hồ nào trong trạng thái này.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "../stores/user";
import { useAuthStore } from "../stores/auth";
import MyselfCard from "../components/MyselfCard.vue";
import router from "../router";



const userStore = useUserStore();
const addresses = ref([]);
const user = ref({
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

const defaultAddress = computed(() => {
  if (addresses.value && addresses.value.length > 0) {
    const defaultAddr = addresses.value.find((addr) => addr.isDefault === true);
    return defaultAddr ? defaultAddr.address : addresses.value[0].detail;
  }
  return null;
});

const selectedState = ref("all");

const filteredWatches = computed(() => {
  switch (selectedState.value) {
    case "approved":
      return user.value.watches.filter((watch) => watch.state === 1);
    case "pending":
      return user.value.watches.filter((watch) => watch.state === 0);
    case "deleted":
      return user.value.watches.filter(
        (watch) => watch.state !== 0 && watch.state !== 1
      );
    default:
      return user.value.watches;
  }
});

onMounted(async () => {
  if(useUserStore().role !='ROLE_SELLER' && useUserStore().role != 'ROLE_USER'){
  console.log(useUserStore().role );
  
    console.log('no permission');
    router.push('/')
}
  const userId = useAuthStore().user_id;
  try {
    const userInfo = await userStore.getUserInfo(userId);
    user.value = userInfo;

    // Fetch address information separately
    const addressData = await userStore.getAddressDetails(userId);
    addresses.value = addressData;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
});
</script>

<style>
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
</style>