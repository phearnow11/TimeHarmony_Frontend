<template>
  <div v-if="auth.user_id" class="flex max-w-7xl mx-auto my-8 p-4">
    <!-- Thanh bên -->
    <div class="w-1/4 mr-8">
      <h2 class="text-2xl mb-4">Cài đặt Hồ sơ</h2>
      
      <ul>
        <li class="mb-2">
          <router-link to="/setting/profile" class="hover-underline-animation">Thông tin cá nhân</router-link>
        </li>
        <li class="mb-2">
          <router-link to="/setting/password" class="hover-underline-animation">Mật khẩu</router-link>
        </li>
        <li class="mb-2 text-secondary">Sổ địa chỉ</li>
        <li class="mb-2">
          <router-link to="/setting/product" class="hover-underline-animation">Đơn hàng của tôi</router-link>
        </li>
        <li class="mb-2">
          <router-link to="#" class="hover-underline-animation">Xóa tài khoản</router-link>
        </li>
      </ul>
    </div>
    <!-- Nội dung -->
    <div class="container mx-auto p-4">
      <div v-if="!showAddForm">
        <h2 class="text-2xl relative bottom-4 mb-5">Địa chỉ của tôi</h2>
        <table class="w-full border-collapse">
          <thead>
            <tr class="text-left">
              <th class="pb-2">Tên</th>
              <th class="pb-2 pl-2">Số điện thoại</th>
              <th class="pb-2 pl-2">Địa chỉ</th>
              <th class="pb-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="address in sortedAddresses" :key="address.id" class="border-t border-[#9b9b9b]">
              <td class="py-5">{{ address.name }}</td>
              <td class="py-5 px-2">{{ address.phone }}</td>
              <td class="py-5 px-2">{{ address.address }}</td>
              <td class="py-5 px-2 text-right">
                <span v-if="address.isDefault" class="text-gray-500 text-sm px-2">
                  Địa chỉ mặc định
                </span>
                <button class="hover-underline-animation" @click="editAddress(address)">Chỉnh sửa</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-end">
          <button class="mt-7 th-p-btn" @click="toggleAddForm">+ THÊM ĐỊA CHỈ MỚI</button>
        </div>
      </div>

      <!-- Biểu mẫu thêm địa chỉ mới -->
      <div v-else class="container mx-auto p-4">
        <h2 class="text-2xl relative bottom-8">Thêm Địa Chỉ Mới</h2>
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
              required
            />
            <label for="phone" class="form__label">Số điện thoại</label>
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
            <button type="button" @click="toggleAddForm" class="mr-2 px-4 py-2 border border-secondary">Hủy</button>
            <button type="submit" class="th-p-btn">Lưu Địa Chỉ</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth';
import { useUserStore } from '../../stores/user';
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { fetchProvinces, fetchDistricts, fetchWards } from '../../stores/vnmap';

const user = useUserStore();
const auth = useAuthStore();
const router = useRouter();
const showAddForm = ref(false);
const addresses = ref([]);
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

const sortedAddresses = computed(() => {
  return addresses.value.slice().sort((a, b) => b.isDefault - a.isDefault);
});

onMounted(async () => {
  if (!auth.user_id) {
    console.log('User is not logged in. Redirecting to login...');
    router.push('/login');
  } else {
    try {
      addresses.value = await user.getAddressDetails(auth.user_id);
      await loadProvinces();
    } catch (error) {
      console.error('Failed to fetch address details:', error);
    }
  }
});

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

const editAddress = (address) => {
  console.log('Edit address:', address);
};

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value;
  if (!showAddForm.value) {
    newAddress.value = { name: '', phone: '', detail: '', default: false };
    selectedProvince.value = '';
    selectedDistrict.value = '';
    selectedWard.value = '';
  }
};

const submitNewAddress = async () => {
  try {
    const fullAddress = `${selectedWardName.value}, ${selectedDistrictName.value}, ${selectedProvinceName.value}`;
    newAddress.value.detail = `${newAddress.value.detail}, ${fullAddress}`;
    
    console.log('Sending address data:', newAddress.value);  // Add this line
    
    await user.addAddress(auth.user_id, newAddress.value);
    addresses.value = await user.getAddressDetails(auth.user_id);
    toggleAddForm();
  } catch (error) {
    console.error('Failed to save new address:', error);
    console.error('Error response:', error.response);  // Add this line to see more details
  }
};

const selectedProvinceName = computed(() => {
  return provinces.value.find(p => p.idProvince === selectedProvince.value)?.name || '';
});

const selectedDistrictName = computed(() => {
  return districts.value.find(d => d.idDistrict === selectedDistrict.value)?.name || '';
});

const selectedWardName = computed(() => {
  return wards.value.find(w => w.idCommune === selectedWard.value)?.name || '';
});
</script>


<style scoped>
input {
  display: block;
  width: 100%;
}

label {
  font-weight: bold;
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
