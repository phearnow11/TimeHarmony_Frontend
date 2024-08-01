<template>
  <div v-if="auth.user_id" class="flex justify-center h-full pb-96 items-center flex-col mb-96">
    <section class="w-full pt-5 px-9">
      <div class="flex justify-between">
        <span class="text-2xl font-semibold text-primary">Giỏ hàng</span>
      </div>
    </section>
    
    <div class="flex justify-center h-24 items-start w-full px-10 pt-5">
      <section class="w-8/12 flex items-center bg-zinc-900 p-4 mr-4">
        <div class="flex items-center flex-grow">
          <label
            class="container flex justify-start items-center text-center gap-2"
          >
            <input type="checkbox" :checked="selectAll" @change="toggleAllProducts"/>
            <svg viewBox="0 0 64 64" height="1em">
              <path
                d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16"
                pathLength="575.0541381835938"
                class="path"
              ></path>
            </svg>
            <label>{{ selectAll ? "Bỏ chọn" : "Chọn tất cả" }} ( {{ cartItems.length }} sản phẩm )</label>
          </label>
        </div>
        <div>
          <button
            @click="deleteSelected"
            class="hover-underline-animation-r text-gray-500"
          >
            <i class="fas fa-trash-alt mr-1"></i> Xoá
          </button>
        </div>
        
      </section>
      
      <section class="flex flex-col z-20 bg-zinc-900 p-5 shadow w-4/12 space-y-4">
        <div class="flex flex-row items-center justify-between w-full">
          <div class="w-80 flex items-center">
            <p v-if="selectedAddress" class="flex items-center">
              <span class="mdi mdi-map-marker pr-2"></span>
              {{ selectedAddress.address }}
            </p>
            <p v-else-if="defaultAddress" class="flex pr-2 items-center">
              <span class="mdi mdi-map-marker pr-2"></span>
              {{ defaultAddress.address }}
            </p>
            <p v-else class="flex items-center">Địa chỉ chưa được chọn</p>
          </div>
          <button @click="openAddressModal" class="hover-underline-animation flex items-center">Chỉnh sửa</button>
        </div>
        <div class="border-t border-secondary border-dashed pt-4">
          <span class="block font-bold text-xl pb-4">Thông tin đơn hàng</span>
          <div class="flex justify-between font-normal">
            <span class="text-gray-99">Tạm tính ({{ selectedItemsCount }} sản phẩm)</span>
            <span class="text-gray-99 font-bold">{{ totalPrice.toLocaleString("vi-VN") }} ₫</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-99">Phí dịch vụ (2%)</span>
            <span class="text-gray-99 font-bold">
              {{ selectedItemsCount > 0 ? Math.round(shipFee).toLocaleString("vi-VN") + ' ₫' : '0 ₫' }}
            </span>
          </div>
          
        </div>
        <div class="border-t border-secondary border-dashed pt-5 form-content">
          <span class="text-xl font-bold">Ghi chú</span>
          <div class="form__group field w-full">
            <input
              v-model="note"
              type="text"
              class="form__field"
              placeholder="Enter a note"
            />
            <label for="note" class="form__label">Nhập ghi chú ở đây</label>
          </div>
        </div>
        

        <div class="border-t border-secondary border-dashed pt-5 flex justify-between items-center">
          <span class="font-semibold text-xl">Tổng tiền</span>
          <span class="font-bold">{{ Math.round(totalAll).toLocaleString("vi-VN") }} ₫</span>
        </div>
        <button
          @click="createOrder"
          :disabled="isCartEmpty || selectedItemsCount === 0"
          :class="['th-p-btn text-white px-4 py-2 w-full text-center', 
                  {'opacity-50 cursor-not-allowed': isCartEmpty || selectedItemsCount === 0}]"
        >
          Xác nhận giỏ hàng ({{ selectedItemsCount }})
        </button>
      </section>
    </div>
    
    
    <cart-item
        v-for="item in cartItems"
        :watch_id = "item.watch_id"
        :key="item.watch_id"
        :productName="item.name || 'Loading...'"
        :retailerName="item.sellerName || 'Loading...'"
        :productImage="item.image || ''"
        :price="item.price || 0"
        :retailerAvatar="item.sellerAvatar || ''"
        :isSelected="item.isSelected"
        @toggle-select="toggleItemSelection(item.watch_id)"
        @delete-item="removeItem(item.watch_id)"
      />

      <div v-if="showAddressModal" class="modal-overlay">
      <div class="modal-content">
        <div class="flex justify-between items-center pb-5">
          <span class="text-xl font-bold">Chọn địa chỉ giao hàng</span>
          <span @click="openAddAddressModal" class="hover-underline-animation cursor-pointer">+ Thêm địa chỉ</span>
        </div>
        <div v-for="address in addresses" :key="address.id" class="address-item mb-2">
          <label class="flex items-center">
            <input
              type="radio"
              :value="address"
              v-model="tempSelectedAddress"
              :checked="address.id === tempSelectedAddress?.id"
              class="mr-2"
            />
            <span>
              {{ address.name}} {{ address.phone }} <br>
              {{ address.address }}
            </span>
            <span v-if="address.default">{{ address.default }}</span>
          </label>
        </div>
        <div class="mt-4 flex justify-end">
          <button @click="closeAddressModal" class="mr-2 px-4 py-2 border border-secondary">Huỷ</button>
          <button @click="confirmAddressSelection" class="th-p-btn px-4 py-2">Xác nhận</button>
        </div>
      </div>
      <PopUp 
      :show="isPopupVisible" 
      :product="currentProduct" 
      :message="popupMessage" 
      :showDetails="showProductDetails"
      @close="isPopupVisible = false"  />
    </div>
     <!-- New Add Address Modal -->
     <div v-if="showAddAddressModal" class="modal-overlay">
      <div class="modal-content">
        <h2 class="text-2xl relative bottom-8 pt-10">Thêm Địa Chỉ Mới</h2>
        <form @submit.prevent="submitNewAddress">
          <div class="form__group field w-96">
            <input
              id="name"
              type="text"
              class="form__field w-full"
              placeholder="Tên"
              v-model="newAddress.name"
              required
            />
            <label for="name" class="form__label">Tên</label>
          </div>
          <div class="form__group field w-96">
            <input
              id="phone"
              type="tel"
              class="form__field w-full"
              placeholder="Số điện thoại"
              v-model="newAddress.phone"
              @input="validatePhone"
              required
            />
            <label for="phone" class="form__label">Số điện thoại</label>
            <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
          </div>
          <!-- Lựa chọn địa chỉ -->
          <div class="address-form mt-2">
            <div class="select-item">
              <label for="province" class="select-label">Tỉnh/Thành Phố:</label><br>
              <select class="custom-select w-96" id="province" v-model="selectedProvince">
                <option value="">Chọn Tỉnh/Thành Phố...</option>
                <option v-for="province in provinces" :key="province.idProvince" :value="province.idProvince">
                  {{ province.name }}
                </option>
              </select>
              <span v-if="isLoadingProvinces">Đang tải...</span>
            </div>
        
            <div class="select-item">
              <label for="district" class="select-label">Quận/Huyện:</label> <br>
              <select class="custom-select w-96" id="district" v-model="selectedDistrict" :disabled="!selectedProvince">
                <option value="">Chọn Quận/Huyện...</option>
                <option v-for="district in districts" :key="district.idDistrict" :value="district.idDistrict">
                  {{ district.name }}
                </option>
              </select>
              <span v-if="isLoadingDistricts">Đang tải...</span>
            </div>
        
            <div class="select-item">
              <label for="ward" class="select-label">Phường/Xã:</label> <br>
              <select class="custom-select w-96" id="ward" v-model="selectedWard" :disabled="!selectedDistrict">
                <option value="">Chọn Phường/Xã...</option>
                <option v-for="ward in wards" :key="ward.idCommune" :value="ward.idCommune">
                  {{ ward.name }}
                </option>
              </select>
              <span v-if="isLoadingWards">Đang tải...</span>
            </div>
          </div>

          <div class="form__group field w-96">
            <input
              id="address"
              type="text"
              class="form__field w-full"
              placeholder="Địa chỉ"
              v-model="newAddress.detail"
              required
            />
            <label for="address" class="form__label">Địa chỉ chi tiết</label>
          </div>
          <div class="form__group button-like-field">
            <input
              id="default"
              type="checkbox"
              class="form__field"
              v-model="newAddress.default"
            />
            <label for="default" :class="{'button-label': true, 'active': newAddress.default}">
              {{ newAddress.default ? 'Địa chỉ mặc định' : 'Đặt làm mặc định' }}
            </label>
          </div>
          <div class="pt-10 flex justify-end">
            <button type="button" @click="closeAddAddressModal" class="mr-2 px-4 py-2 border border-secondary">Hủy</button>
            <button type="submit" class="th-p-btn">Lưu Địa Chỉ</button>
          </div>
        </form>
        
      </div>
    </div>
    <PopUp 
      :show="isPopupVisible" 
      :product="currentProduct" 
      :message="popupMessage" 
      :showDetails="showProductDetails"
      @close="isPopupVisible = false"  />
  </div>
  <div v-else class="h-screen flex flex-col items-center justify-center">
    <div>
      <p class="text-xl font-medium text-center">Bạn cần đăng nhập để sử dụng chức năng này, <router-link class="hover-underline-animation" to="/login">Đăng nhập ngay</router-link></p>
    </div>
    <div class="mt-4">
      <router-link to="/" class="hover-underline-animation">Quay trở lại trang chủ</router-link>
    </div>
  </div>
  
</template>


<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useCartStore } from "../stores/cart";
import { useAuthStore } from "../stores/auth";
import { useWatchStore } from "../stores/watch";
import { useUserStore } from "../stores/user";
import CartItem from "../components/CartItem.vue";
import { useRouter } from 'vue-router';
import PopUp from "../components/PopUp.vue";
import { fetchProvinces, fetchDistricts, fetchWards } from '../stores/vnmap';

const watchStore = useWatchStore();
const auth = useAuthStore();
const cartStore = useCartStore();
const userStore = useUserStore();
const router = useRouter();

const watchDetails = ref({});
const cartItems = ref([]);
const selectAll = ref(false);
const addresses = ref([]);
const defaultAddress = ref(null);
const showAddressModal = ref(false);
const showAddAddressModal = ref(false);
const selectedAddress = ref(null);
const tempSelectedAddress = ref(null);
const note = ref('');
const currentProduct = ref();

const newAddress = ref({
  name: '',
  phone: '',
  detail: '',
  default: false
});

const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);

const selectedProvince = ref('');
const selectedDistrict = ref('');
const selectedWard = ref('');

const isLoadingProvinces = ref(false);
const isLoadingDistricts = ref(false);
const isLoadingWards = ref(false);
const isPopupVisible = ref(false);
const popupMessage = ref('');
const showProductDetails = ref(true);




const errorMessage = ref('');

const handleUploadClick = (event) => {
  if (!userStore.isVerify) {
    event.preventDefault();
    isPopupVisible.value = true;
    popupMessage.value = 'Vui lòng xác nhận Email để có thể mua hàng';
    showProductDetails.value = false;
  }
};

function validatePhone(event) {
  const value = event.target.value;
  const numericValue = value.replace(/\D/g, '');
  newAddress.value.phone = numericValue;

  if (value !== numericValue) {
    errorMessage.value = 'Vui lòng chỉ nhập số vào ô này.';
  } else {
    errorMessage.value = '';
  }
}

const shipFee = computed(() => {
  return selectedItemsCount.value > 0 ? totalPrice.value * 0.02 : 0;
});

const fetchAddresses = async () => {
  try {
    addresses.value = await userStore.getAddressDetails(auth.user_id);
    console.log("Fetched addresses:", addresses.value);
    selectedAddress.value = addresses.value.find(addr => addr.isDefault) || null;
    console.log("Selected address:", selectedAddress.value);
  } catch (error) {
    console.error("Error fetching addresses:", error);
  }
};

const disableBodyScroll = () => {
  document.body.style.overflow = 'hidden';
};

const enableBodyScroll = () => {
  document.body.style.overflow = '';
};

const openAddressModal = () => {
  tempSelectedAddress.value = selectedAddress.value;
  showAddressModal.value = true;
  disableBodyScroll();
};

const closeAddressModal = () => {
  showAddressModal.value = false;
  tempSelectedAddress.value = null;
  enableBodyScroll();
};

const openAddAddressModal = () => {
  showAddAddressModal.value = true;
  disableBodyScroll();
};

const closeAddAddressModal = () => {
  showAddAddressModal.value = false;
  enableBodyScroll();
};

const confirmAddressSelection = () => {
  if (tempSelectedAddress.value) {
    selectedAddress.value = tempSelectedAddress.value;
    console.log("New selected address:", selectedAddress.value);
  }
  closeAddressModal();
};

const fetchWatchDetails = async (watchId) => {
  try {
    const details = await watchStore.getDetailWatch(watchId);
    watchDetails.value[watchId] = details;
    updateCartItem(watchId, details);
  } catch (error) {
    console.error(`Error fetching watch details for ${watchId}:`, error);
  }
};

const updateCartItem = (watchId, details) => {
  const index = cartItems.value.findIndex((item) => item.watch_id === watchId);
  if (index !== -1) {
    cartItems.value[index] = {
      ...cartItems.value[index],
      name: details.name,
      price: parseFloat(details.price) || 0,
      image: details.images?.[0] || "",
      sellerName: details.seller?.user_log_info?.username || "",
      sellerAvatar: details.seller?.member_image || "",
    };
  }
};

const fetchAllWatchDetails = async () => {
  for (const item of cartStore.cart_info) {
    await fetchWatchDetails(item.watch_id);
  }
};

const loadProvinces = async () => {
  isLoadingProvinces.value = true;
  try {
    provinces.value = await fetchProvinces();
  } catch (error) {
    console.error('Error loading provinces:', error);
  }
  isLoadingProvinces.value = false;
};

const loadDistricts = async () => {
  if (!selectedProvince.value) return;
  isLoadingDistricts.value = true;
  try {
    districts.value = await fetchDistricts(selectedProvince.value);
  } catch (error) {
    console.error('Error loading districts:', error);
  }
  isLoadingDistricts.value = false;
};

const loadWards = async () => {
  if (!selectedDistrict.value) return;
  isLoadingWards.value = true;
  try {
    wards.value = await fetchWards(selectedDistrict.value);
  } catch (error) {
    console.error('Error loading wards:', error);
  }
  isLoadingWards.value = false;
};

watch(selectedProvince, () => {
  selectedDistrict.value = '';
  selectedWard.value = '';
  districts.value = [];
  wards.value = [];
  if (selectedProvince.value) {
    loadDistricts();
  }
});

watch(selectedDistrict, () => {
  selectedWard.value = '';
  wards.value = [];
  if (selectedDistrict.value) {
    loadWards();
  }
});

const selectedProvinceName = computed(() => {
  return provinces.value.find(p => p.idProvince === selectedProvince.value)?.name || '';
});

const selectedDistrictName = computed(() => {
  return districts.value.find(d => d.idDistrict === selectedDistrict.value)?.name || '';
});

const selectedWardName = computed(() => {
  return wards.value.find(w => w.idCommune === selectedWard.value)?.name || '';
});

const submitNewAddress = async () => {
  try {
    const fullAddress = `${selectedWardName.value}, ${selectedDistrictName.value}, ${selectedProvinceName.value}`;
    newAddress.value.detail = `${newAddress.value.detail}, ${fullAddress}`;
    console.log('Sending address data:', newAddress.value);
    await userStore.addAddress(auth.user_id, newAddress.value);
    addresses.value = await userStore.getAddressDetails(auth.user_id);
    closeAddAddressModal();
    
    // Show success popup
    popupMessage.value = 'Thêm địa chỉ thành công!';
    isPopupVisible.value = true;
    showProductDetails.value = false;
  } catch (error) {
    console.error('Failed to save new address:', error);
    console.error('Error response:', error.response);
    
    // Show error popup
    popupMessage.value = 'Có lỗi xảy ra khi thêm địa chỉ. Vui lòng thử lại.';
    isPopupVisible.value = true;
    showProductDetails.value = false;
  }
};

watch(() => cartStore.cart_info, checkSelectedItems, { deep: true });

function checkSelectedItems() {
  const selectedItems = cartStore.cart_info.filter(item => item.isSelected);
  if (selectedItems.length > 0) {
    // Scroll to the selected item or perform any other necessary actions
    // ...
  }
}

const isCartEmpty = computed(() => cartItems.value.length === 0 || selectedItemsCount.value === 0);

onMounted(async () => {
  try {
    await cartStore.getCart(auth.user_id);
    cartItems.value = cartStore.cart_info.map((item) => ({
      ...item,
      isSelected: item.isSelected || false, // Use the isSelected property from the store
      name: "Loading...",
      price: 0,
      image: "",
      sellerName: "Loading...",
      sellerAvatar: "",
    }));
    await loadProvinces();
    await fetchAddresses();
    await fetchAllWatchDetails();
    checkSelectedItems();
    buyNow()
    // Check if there's a newly added item and scroll to it
    const newlyAddedItem = cartItems.value.find(item => item.isSelected);
    if (newlyAddedItem) {
      // You might need to use nextTick to ensure the DOM has updated
      Vue.nextTick(() => {
        const element = document.getElementById(`cart-item-${newlyAddedItem.watch_id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
});

const selectedItemsCount = computed(
  () => cartItems.value.filter((item) => item.isSelected).length
);

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => {
    return item.isSelected ? total + (item.price || 0) : total;
  }, 0);
});

// const toggleAllProducts = () => {
//   selectAll.value = !selectAll.value;
//   cartItems.value.forEach((item) => (item.isSelected = selectAll.value));
// };

const toggleAllProducts = () => {
  selectAll.value = !selectAll.value;
  cartItems.value.forEach((item) => {
    item.isSelected = selectAll.value;
    // Add or remove all watchIds from selected_wids
    if (selectAll.value) {
      if (!useCartStore().selected_wids.includes(item.watch_id)) {
        useCartStore().selected_wids.push(item.watch_id);
      }
    } else {
      useCartStore().selected_wids = useCartStore().selected_wids.filter(id => id !== item.watch_id);
    }
    console.log(useCartStore().selected_wids);
  });
};




// const toggleItemSelection = (watchId) => {
//   const item = cartItems.value.find((item) => item.watch_id === watchId);
//   if (item) {
//     item.isSelected = !item.isSelected;
//   }
//   updateSelectAllState();
// };

const toggleItemSelection = (watchId) => {
  const item = cartItems.value.find(item => item.watch_id === watchId);
  if (item) {
    item.isSelected = !item.isSelected;
    useCartStore().selected_wids = item.isSelected
      ? [...useCartStore().selected_wids, watchId]
      : useCartStore().selected_wids.filter(id => id !== watchId);
  }
  updateSelectAllState();
  console.log(useCartStore().selected_wids);
};



const buyNow = () => {
  const item = cartItems.value.find((item) => item.watch_id === useCartStore().buyNowItem);
  if (item) {
    item.isSelected = !item.isSelected;
  }
  useCartStore().buyNowItem = null
  updateSelectAllState();
};

const updateSelectAllState = () => {
  selectAll.value =
    cartItems.value.length > 0 &&
    cartItems.value.every(item => item.isSelected);
};

const removeItem = async (watchId) => {
  try {
    await userStore.deleteWatchCart(auth.user_id, [watchId]);
    cartItems.value = cartItems.value.filter(item => item.watch_id !== watchId);
    // Update cart count
    userStore.setCartNum(cartItems.value.length);
  } catch (error) {
    console.error('Failed to remove item from cart:', error);
  }
};

const deleteSelected = async () => {
  try {
    const selectedWatchIds = cartItems.value
      .filter((item) => item.isSelected)
      .map((item) => item.watch_id);
    
    await userStore.deleteWatchCart(auth.user_id, selectedWatchIds);
    cartItems.value = cartItems.value.filter((item) => !item.isSelected);
    selectAll.value = false;
    // Update cart count
    userStore.setCartNum(cartItems.value.length);
  } catch (error) {
    console.error("Error deleting selected items:", error);
  }
};



const totalAll = computed(() => {
  cartStore.setShipFee(shipFee.value);
  return totalPrice.value + shipFee.value;
});

watch(cartItems, updateSelectAllState, { deep: true });



const createOrder = async () => {
  if (isCartEmpty.value) {
    isPopupVisible.value = true;
    popupMessage.value = 'Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng.';
    showProductDetails.value = false;
    return;
  }
  else if (!userStore.isVerify) {
    isPopupVisible.value = true;
    popupMessage.value = 'Vui lòng xác nhận Email để có thể mua hàng';
    showProductDetails.value = false;
  } else{
    const selectedItems = cartItems.value.filter(item => item.isSelected);
    if (selectedAddress.value !== null) {
      cartStore.setSelectedItems(selectedItems);
      cartStore.setTotalPrice(totalPrice.value);
      cartStore.setShippingAddress(selectedAddress.value);
      cartStore.setNote(note.value);
      router.push('/order');
    } else {
      isPopupVisible.value = true;
      popupMessage.value = 'Vui lòng chọn địa chỉ giao hàng trước khi xác nhận giỏ hàng';
      showProductDetails.value = false;
      console.log('Address must be chosen');
    }
  }
};

</script>

<style scoped>


.checkbox-container {
  display: inline-flex;
  align-items: center;
}
.checkbox-svg {
  width: 1em;
  height: 1em;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.checkbox-container input:checked + .checkbox-svg .path {
  stroke-dashoffset: 0;
}

.button-container {
  display: flex;
  justify-content: flex-end; /* Ensure the button is at the end */
  
}

.checkbox-container .path {
  stroke-dasharray: 320;
  stroke-dashoffset: 320;
  transition: stroke-dashoffset 0.3s ease;
}

.modal-overlay {
  padding: 5px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(20, 20, 20, 0.836);
  backdrop-filter: blur(10px); /* Apply a blur effect to the background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  overflow-y: hidden;
}

.modal-content {
  background-color: #1a1a1a;
  padding: 2rem;
  max-width: 700px;
  width: 100%;
  height: 70%;
  overflow-y: scroll;
  
}

.address-item {
  padding: 0.5rem;
  border: 1px solid #333;
}

.button-like-field {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 1rem;
}

.button-like-field input[type="checkbox"] {
  display: none;
}

.button-like-field .button-label {
  display: inline-block;
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: #9b9b9b15;
  transition: background-color 0.3s ease;
}

.button-like-field .button-label:hover {
  background-color: #131212;
}

.button-like-field .button-label.active {
  background-color: #131212;
}

.select-item{
  padding-top: 5px; 
}

.select-label {
    font-size: 1rem;
    color: #9b9b9b; /* Yellow text color */
  }
  
  .custom-select {
    font-size: 1rem;
    border: none;
    border-bottom: 2px solid var(--secondary); /* Yellow bottom border */
    background-color: transparent; /* Black background */
    color: var(--secondary); /* Yellow text color */
  }
  
  .custom-select option {
    background-color: #141414da;
    backdrop-filter: blur(40px); /* Apply a blur effect to the background */
    color: var(--secondary); /* Yellow text color */
  }
</style>