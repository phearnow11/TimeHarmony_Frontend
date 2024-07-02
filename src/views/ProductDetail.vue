<template>
  <div class="max-w-4xl mx-auto my-5 p-4">
    <!-- Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center" @click.self="closeModal">
      <div class="absolute inset-0 modal" @click="closeModal"></div>
      <div class="relative z-10 max-w-3xl max-h-[90vh] overflow-hidden" @click.stop>
        <img :src="currentModalImage" :alt="watchStore.watch_data.name" class="max-w-full max-h-full object-contain">
        
        <!-- Navigation arrows -->
        <button @click.stop="prevImage" class="bg-drop absolute left-2 top-1/2 transform -translate-y-1/2 text-secondary p-2">
          &lt;
        </button>
        <button @click.stop="nextImage" class="bg-drop absolute right-2 top-1/2 transform -translate-y-1/2  text-secondary p-2">
          &gt;
        </button>
        
        <!-- Image counter -->
        <div class="bg-drop absolute bottom-4 left-1/2 transform -translate-x-1/2 text-primary px-2 py-1">
          {{ currentImageIndex + 1 }} / {{ watchStore.watch_data.images.length }}
        </div>
      </div>
    </div>
    <!-- Product Display -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- Image Gallery -->
      <div class="w-full md:w-1/2 flex flex-col gap-4">
        <!-- Main Image Display Container -->
        <div class="relative flex-grow w-full h-60 cursor-pointer" @click="openModal">
          <img 
            :src="currentImage" 
            :alt="watchStore.watch_data.name"
            class="w-full h-full object-contain main-image"
          >
        </div>
        <!-- Thumbnails -->
        <div class="flex gap-2 overflow-x-auto mt-2">
          <img 
            v-for="(imageUrl, index) in watchStore.watch_data.images" 
            :key="index" 
            :src="imageUrl" 
            :alt="`Product Image ${index + 1}`"
            class="w-20 h-20 object-cover cursor-pointer thumbnail"
            @mouseenter="currentImage = imageUrl"
            :class="{ 'border-2 border-primary': currentImage === imageUrl }"
          >
        </div>
      </div>
      
      <!-- Product Info -->
      <div class="w-full md:w-1/2">
        <h1 class="text-xl font-semibold mb-2">{{ watchStore.watch_data.name }}</h1>
        <div class="flex items-center mb-2">
          <span class="text-2xl font-bold">{{ watchStore.watch_data.description }}</span>
        </div>
        <div class="mb-4">
          <span class="text-xl font-thin text-secondary"> {{ formatPriceVND(watchStore.watch_data.price) }}</span>
        </div>
        
        <!-- Shipping, Quantity, etc. -->
        <div class="mb-4">
          <!-- Add shipping and quantity selectors here -->
        </div>
        <div class="flex gap-4">
          <button @click="addToCart" class="flex-1 th-p-btn py-2 px-4 relative">
            <span :class="{ 'opacity-0': isLoading }">Add To Cart</span>
            <div v-if="isLoading" class="loader-container">
              <div class="loader">
                <div class="loaderBar"></div>
              </div>
            </div>
          </button>
          <router-link to="/order" class="flex-1 th-p-btn py-2 px-4">Buy Now</router-link>
        </div>
      </div>
    </div>

    <PopUp 
      :show="isPopupVisible" 
      :product="currentProduct" 
      :message="popupMessage" 
      :showDetails="showProductDetails"
      @close="isPopupVisible = false"  />

    <!-- Seller Info -->
    <div v-if="retailer" class="mt-8 border-t border-secondary pt-4">
      <div class="mb-5">
        <span class="font-semibold text-xl">
          Retailer Information
        </span>
      </div>
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img :src="retailer.image" alt="Seller" class="w-12 h-12 mr-4">
          <div>
            <h2 class="font-semibold">{{ retailer.username }}</h2>
            <p class="text-gray-500 text-sm">{{ retailer.email }}</p>
            <p class="text-gray-500 text-sm">{{ retailer.phone }}</p>
          </div>
        </div>
        <div class="flex gap-2">
          <router-link :to="`/chat/${retailer.user_id}`" class="border border-secondary py-2 px-4">Chat Now</router-link>
          <router-link :to="`/retailer/${retailer.user_id}`" class="border border-secondary py-2 px-4">View Shop</router-link>
        </div>
      </div>
    </div>
    
    <div class="p-8 border-t border-secondary mt-6 max-w-4xl mx-auto">
    <section class="mb-8">
      <h1 class="text-2xl font-bold border-b border-secondary w-40 mb-4">DESCRIPTION</h1>
      <div class="mb-5">
        <span>
          {{ watchStore.watch_data.description || "No Information"}}
        </span>
      </div>
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h2 class="text-xl font-bold border-b border-secondary w-40 mb-4">FEATURES</h2>
        <ul class="space-y-2">
          <li><strong>Calendar:</strong> {{ watchStore.watch_data.calender || "No Information" }} </li>
          <li><strong>Feature:</strong> {{ watchStore.watch_data.feature || "No Information" }}</li>
          <li><strong>Movement:</strong> {{ watchStore.watch_data.movement || "No Information" }}</li>
          <li><strong>Functions:</strong> {{ watchStore.watch_data.function || "No Information" }}</li>
          <li><strong>Engine:</strong> {{ watchStore.watch_data.engine || "No Information" }}</li>
          <li><strong>Water Resistant:</strong> {{ watchStore.watch_data.waterresistant || "No Information" }}</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl border-b border-secondary font-bold w-40 mb-4">DIAL</h2>
        <ul class="space-y-2">
          <li><strong>Dial Type:</strong> {{ watchStore.watch_data.dialtype || "No Information" }}</li>
          <li><strong>Dial Color:</strong> {{ watchStore.watch_data.dialcolor || "No Information" }}</li>
          <li><strong>Crystal:</strong> {{ watchStore.watch_data.crystal || "No Information" }}</li>
          <li><strong>Second Markers:</strong> {{ watchStore.watch_data.secondmaker || "No Information"}}</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl border-b border-secondary font-bold w-40 mb-4">BAND</h2>
        <ul class="space-y-2">
          <li><strong>Band Color:</strong> {{ watchStore.watch_data.bandcolor || "No Information"}}</li>
          <li><strong>Band Type:</strong> {{ watchStore.watch_data.bandtype || "No Information"}}</li>
          <li><strong>Clasp:</strong> {{ watchStore.watch_data.clasp || "No Information"}} </li>
          <li><strong>Bracelet:</strong> {{ watchStore.watch_data.bracelet || "No Information"}}</li>
        </ul>
      </div>

      <div>
        <h2 class="text-xl border-b border-secondary w-40 font-bold mb-4">CASE</h2>
        <ul class="space-y-2">
          <li><strong>Bezel:</strong> {{ watchStore.watch_data.bezel || "No Information"}}</li>
          <li><strong>Bezel Material:</strong> {{ watchStore.watch_data.bezelmaterial || "No Information"}}</li>
          <li><strong>Case Back:</strong> {{ watchStore.watch_data.caseback || "No Information"}}</li>
          <li><strong>Case Dimension:</strong> {{ watchStore.watch_data.casedimension || "No Information"}}</li>
          <li><strong>Case Shape:</strong> {{ watchStore.watch_data.caseshape || "No Information"}}</li>
        </ul>
      </div>
    </section>

    <section class="mt-8">
      <h2 class="text-xl border-b border-secondary w-40 font-bold mb-4">ABOUT</h2>
      <ul class="space-y-2">
        <li><strong>Brand:</strong> {{ watchStore.watch_data.brand || "No Information"}}</li>
        <li><strong>Series:</strong> {{ watchStore.watch_data.series || "No Information"}}</li>
        <li><strong>Model:</strong> {{ watchStore.watch_data.model || "No Information"}}</li>
        <li><strong>Gender:</strong> {{ watchStore.watch_data.gender || "No Information"}}</li>
        <li><strong>Style Type:</strong> {{ watchStore.watch_data.style || "No Information"}}</li>
        <li><strong>Sub-Class:</strong> {{ watchStore.watch_data.subclass || "No Information"}}</li>
        <li><strong>Made Label:</strong> {{ watchStore.watch_data.madelabel || "No Information"}}</li>
        
      </ul>
    </section>

    <section class="mt-10">
      <h2 class="text-xl border-b border-secondary font-bold w-40 mb-4">Warranty</h2>
      <p>
        TimeHarmony will service every brand name watch sold on our website (see chart for exceptions) for a period of 1 to 5 years after purchase. Watches that have symptoms of abnormally gaining time, losing time, or not keeping proper time will be serviced under our warranty program.
      </p>
      <br>
      <p>
        What's not covered: The watch case, bracelet, straps, crown/stem, crystal/glass, finishes, damage caused by excessive wear-and-tear and/or physical abuse and damage resulting from wear under conditions exceeding the watch manufacturer's water resistance limits. Consequential and incidental damages are not covered under this warranty or any implied warranties.      </p>
      <br>
        <p>
        Please note: Damage that occurs due to having the watch serviced by a third party null and voids the warranty from TimeHarmony.      </p>
    </section>
  </div>

  </div>

</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useWatchStore } from '../stores/watch';
import { useUserStore } from '../stores/user';
import PopUp from '../components/PopUp.vue';

const route = useRoute();
const watchStore = useWatchStore();
const userStore = useUserStore();

const watchId = route.params.watch_id;
const currentImage = ref('');
const isModalOpen = ref(false);
const isPopupVisible = ref(false);
const retailer = ref(null);
const isLoading = ref(false);
const currentProduct = ref({});
const popupMessage = ref('');
const showProductDetails = ref(true);

const formatPriceVND = (price) => {
  const formattedPrice = (price / 1).toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });
  return formattedPrice;
};

async function addToCart() {
  console.log("WatchID: " + watchId);
  console.log("UserID: " + retailer.value.user_id);
  isLoading.value = true;
  try {
    const response = await userStore.addToCart(retailer.value.user_id, watchId);
    console.log("Already in cart ", response);
    if (response==='Watch aready in cart!') {
      popupMessage.value = 'This item is already in your cart.';
      showProductDetails.value = false;
    } else {
      currentProduct.value = {
        image: currentImage.value,
        name: watchStore.watch_data.name,
        price: watchStore.watch_data.price
      };
      popupMessage.value = 'Added to Cart Successfully';
      showProductDetails.value = true;
    }
    isPopupVisible.value = true;
  } catch (error) {
    console.error("Error adding item to cart", error);
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await watchStore.getDetailWatch(watchId);
  updateCurrentImage();
  if (watchStore.watch_data.seller && watchStore.watch_data.seller.member_id) {
    retailer.value = await userStore.getUserInfo(watchStore.watch_data.seller.member_id);
  }
});

watch(() => watchStore.watch_data.images, updateCurrentImage);

function updateCurrentImage() {
  if (watchStore.watch_data.images && watchStore.watch_data.images.length > 0) {
    currentImage.value = watchStore.watch_data.images[0];
  }
}

// Existing modal functions
const currentImageIndex = ref(0);
const currentModalImage = computed(() => watchStore.watch_data.images[currentImageIndex.value]);

function openModal() {
  isModalOpen.value = true;
  currentImageIndex.value = watchStore.watch_data.images.indexOf(currentImage.value);
}

function closeModal() {
  isModalOpen.value = false;
}

function nextImage() {
  currentImageIndex.value = (currentImageIndex.value + 1) % watchStore.watch_data.images.length;
}

function prevImage() {
  currentImageIndex.value = (currentImageIndex.value - 1 + watchStore.watch_data.images.length) % watchStore.watch_data.images.length;
}

</script>


<style scoped>
.thumbnail {
  transition: border-color 0.2s;
}

.main-image {
  transition: transform 0.2s;
}

.modal {
  background-color: rgba(20, 20, 20, 0.836);
  backdrop-filter: blur(10px); /* Apply a blur effect to the background */
}

.bg-drop{
  background-color: rgba(20, 20, 20, 0.836);
  backdrop-filter: blur(50px); /* Apply a blur effect to the background */
}



@media (min-width: 768px) {
  .thumbnail {
    width: 60px;
    height: 60px;
  }
}


.loader-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  background: rgba(23, 23, 23, 0.5);
}

.loader {
  width: 80px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  position: relative;
  padding: 1px;
}

.loader .loaderBar {
  position: absolute;
  top: 0;
  right: 100%;
  bottom: 0;
  left: 0;
  background: var(--secondary);
  width: 0;
  animation: borealisBar 2s linear infinite;
}

.loader::after {
  content: "";
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 2px solid var(--secondary);
  left: 0;
  top: 0;
  animation: rotation 2s ease-in-out infinite alternate;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
