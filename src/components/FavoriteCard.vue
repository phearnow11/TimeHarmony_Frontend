<template>

  <div class="container">
    <div class="box">
       <router-link :to="`/detail/${watch_id}`">
      <div class="image-container">
        <img class="watch-img" :src="productImage" />
        <div class="gradient-overlay"></div>
      </div>
      <div>
        <strong class="product-name">{{ productName }}</strong>
        <div class="retailer">
          <img class="avatar" :src="retailerAvatar" />
          <router-link :to="seller_id">
            <span class="username hover-underline-animation">{{ retailerName }}</span>
          </router-link>
        </div>
        <span class="price">{{ formattedPrice }}</span>
      </div>
    </router-link>
      <div class="flex gap-1 justify-between w-full">
        <button @click="removeFavorite" type="submit" class="border-2 border-secondary mt-5 flex-1">Huỷ thích</button>
        <button @click="addToCart()" type="submit" class="th-p-btn mt-5 flex-1">Thêm vào giỏ</button>
      </div>
      <PopUp 
      :show="isPopupVisible" 
      :product="currentProduct" 
      :message="popupMessage" 
      :showDetails="showProductDetails"
      @close="isPopupVisible = false"  />
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useAuthStore } from '../stores/auth';
import PopUp from './PopUp.vue';
import { useWatchStore } from '../stores/watch';
import { useCartStore } from '../stores/cart';

const auth = useAuthStore();
const userStore = useUserStore();

const props = defineProps({
  productName: { type: String, required: true },
  productImage: { type: String, required: true },
  retailerName: { type: String, required: true },
  retailerAvatar: { type: String, required: true },
  price: { type: Number, required: true },
  watch_id: { type: String, required: true },
  seller_id: { type: String, required: true }
});

const emit = defineEmits(['favorite-removed']);
const currentImage = ref('');
const isPopupVisible = ref(false);
const isLoading = ref(false);
const currentProduct = ref({});
const popupMessage = ref('');
const showProductDetails = ref(true);
const watchStore = useWatchStore()
const cartStore = useCartStore()

async function addToCart() {
  console.log("WatchID: " + props.watch_id);
  console.log("UserID: " + userStore.user_id);
  isLoading.value = true;
  try {
    const response = await userStore.addToCart(userStore.user_id, props.watch_id);
    console.log("Already in cart ", response);
    if (response==='Watch state changed!') {
      popupMessage.value = 'Sản phẩm này đã được thêm vào giỏ hàng';
      showProductDetails.value = false;
    } else {
      currentProduct.value = {
        image: watchStore.watch_data.images,
        name: watchStore.watch_data.name,
        price: watchStore.watch_data.price
      };
      useUserStore().setCartNum(cartStore.cart_info.length);
      popupMessage.value = 'Thêm vào giỏ thành công';
      showProductDetails.value = true;
    }
    isPopupVisible.value = true;
  } catch (error) {
    console.error("Error adding item to cart", error);
  } finally {
    isLoading.value = false;
  }
}

const removeFavorite = async () => {
  try {
    await userStore.deleteFavorite(auth.user_id, props.watch_id);
    
    // Update popup message and visibility
    popupMessage.value = 'Huỷ thích thành công';
    isPopupVisible.value = true;
    
    // Emit an event to notify the parent component
    emit('favorite-removed', props.watch_id);
  } catch (error) {
    console.error('Error removing favorite:', error);
    popupMessage.value = 'Có lỗi xảy ra khi huỷ thích';
    isPopupVisible.value = true;
  }
};


const formatPriceVND = (price) => {
  return price.toLocaleString('vi-VN', {
    style: 'currency',
    currency: 'VND'
  });
};

const formattedPrice = computed(() => formatPriceVND(props.price));
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1em;
  z-index: 1;
}

.container .box {
  max-width: 22em;
  width: 100%;
  padding: 1rem;
  background-color: rgba(255, 255, 255, 0.074);
  border: 1px solid rgba(255, 255, 255, 0.222);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  transition: ease-in-out 0.1s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  box-sizing: border-box;
}

.container .box.bookmarked {
  border: 3px solid var(--primary);
}

.container .box:hover {
  box-shadow: 0px 0px 20px 1px #ffbb763f;
  border: 1px solid rgba(255, 255, 255, 0.454);
}

.image-container {
  position: relative;
}

.container .box .watch-img {
  width: 100%;
  height: auto;
  min-width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  filter: grayscale(100%);
  transition: transform 0.3s ease, filter 0.3s ease;
  transform-origin: center;
}

.container .box:hover img {
  filter: none;
}

.gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.512) 15%, transparent);
  pointer-events: none;
  z-index: 1;
}

.bookmark-icon {
  position: absolute;
  top: -40px;
  right: 10px;
  font-size: 1.5em;
  color: var(--primary);
  transition: top 0.3s ease, color 0.3s ease;
  z-index: 2;
}

.bookmark-icon.active {
  top: 10px;
  color: var(--primary);
}

.container .box:hover .bookmark-icon {
  top: 10px;
}

.container .box div strong.product-name {
  margin-top: 4px;
  color: white;
  display: block;
  margin-bottom: 0.5rem;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  white-space: normal;
  word-break: break-word;
  hyphens: auto;
  font-size: 1.2vw;
}

.container .box div p {
  margin: 0;
  font-size: 1.2vw;
  font-weight: 300;
  letter-spacing: 0.1em;
}

.container .box div span.price-tag {
  color: var(--secondary);
  font-size: 1vw;
  font-weight: 500;
  margin-right: 0.2rem;
}

.container .box div span.price {
  color: whitesmoke;
  font-size: 1vw;
  font-weight: bold;
}

.container .box .avatar {
  width: 2vw;
  height: 2vw;
  vertical-align: middle;
  border: 1px solid var(--primary);
}

.container .box .username {
  vertical-align: middle;
  margin-left: 0.5vw;
  font-size: 1vw;
}

.retailer {
  display: flex;
  justify-content: start;
  align-items: center;
  margin-bottom: 2vw;
}

@media screen and (max-width: 768px) {
  .container .box div strong.product-name {
    font-size: 4vw;
  }

  .container .box div p {
    font-size: 4vw;
  }

  .container .box div span.price-tag,
  .container .box div span.price {
    font-size: 3.5vw;
  }

  .container .box .avatar {
    width: 6vw;
    height: 6vw;
  }

  .container .box .username {
    font-size: 3.5vw;
    margin-left: 1vw;
  }

  .retailer {
    margin-bottom: 3vw;
  }
}
</style>
