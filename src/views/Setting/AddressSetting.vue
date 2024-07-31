<template>
  <div v-if="auth.user_id" class="mx-auto p-6 flex flex-col lg:flex-row">
    <!-- Thanh bên -->
    <aside class="lg:w-1/4 lg:mr-8 p-4">
      <h2 class="text-2xl text-secondary mb-4">Cài đặt Hồ sơ</h2>
      <ul class="space-y-2">
        <li><router-link to="/setting/profile" class="hover-underline-animation">Thông tin cá nhân</router-link></li>
        <li><router-link to="/setting/password" class="hover-underline-animation">Mật khẩu</router-link></li>
        <li class="text-secondary">Sổ địa chỉ</li>
        <li><router-link to="/setting/product" class="hover-underline-animation">Đơn hàng của tôi</router-link></li>
        <li><router-link to="/setting/profit" class="hover-underline-animation">Thu nhập</router-link></li>
        <li><router-link to="/setting/delete" class="hover-underline-animation-r">Xoá tài khoản</router-link></li>
      </ul>
    </aside>
    <!-- Nội dung -->
    <div class="container mx-auto p-4">
      
      <div v-if="!showAddForm">
        <div class=" justify-between flex items-center">
          <h2 class="text-2xl relative bottom-4 mb-5">Địa chỉ của tôi</h2>
          <div class="flex justify-end">
            <button class="mb-10 th-p-btn" @click="toggleAddForm">+ THÊM ĐỊA CHỈ MỚI</button>
          </div>
        </div>
        <div class="table-container"> 
        <table class="w-full border-collapse table">
          <thead class="table-header">
            <tr class="bg-[#494949] text-primary">
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
                <span v-if="address.isDefault" class="text-gray-500 text-sm">
                  Địa chỉ mặc định
                </span>
                <button class="hover-underline-animation" @click="editAddress(address)">Xoá</button>
              </td>
            </tr>
          </tbody>
        </table>
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
            <button type="button" @click="toggleAddForm" class="mr-2 px-4 py-2 border border-secondary">Hủy</button>
            <button type="submit" class="th-p-btn">Lưu Địa Chỉ</button>
          </div>
        </form>
      </div>
      <PopUp 
        :show="showPopup"
        :message="popupMessage"
        :showDetails="false"
        @close="closePopup"
      />
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth';
import { useUserStore } from '../../stores/user';
import { onMounted, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { fetchProvinces, fetchDistricts, fetchWards } from '../../stores/vnmap';
import PopUp from '../../components/PopUp.vue';

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

const errorMessage = ref('');

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

const editAddress = async (address) => {
  try {
    // Confirm deletion with the user
    const confirmDelete = window.confirm('Bạn có chắc chắn muốn xoá địa chỉ này?');
    if (confirmDelete) {
      await user.deleteAddress(auth.user_id, address.id);
      addresses.value = await user.getAddressDetails(auth.user_id); // Refresh the address list
      popupMessage.value = 'Địa chỉ đã được xoá thành công!';
      showPopup.value = true;
    }
  } catch (error) {
    console.error('Failed to delete address:', error);
    popupMessage.value = 'Xoá địa chỉ thất bại!';
    showPopup.value = true;
  }
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
const showPopup = ref(false);
const closePopup = () => {
  showPopup.value = false;
};
const popupMessage = ref('');
const submitNewAddress = async () => {
  try {
    const fullAddress = `${selectedWardName.value}, ${selectedDistrictName.value}, ${selectedProvinceName.value}`;
    newAddress.value.detail = `${newAddress.value.detail}, ${fullAddress}`;
    
    console.log('Sending address data:', newAddress.value);  // Add this line
    
    await user.addAddress(auth.user_id, newAddress.value);
    addresses.value = await user.getAddressDetails(auth.user_id);
    toggleAddForm();
    popupMessage.value = 'Thêm địa chỉ thành công!';
    showPopup.value = true;
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
  
.table-container {
  overflow-x: auto;
  max-height: 400px; /* Adjust this value as needed */
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background-color: var(--primary);
  color: #fff;
}

.table th, .table td {
  padding: 8px;
  border: 1px solid var(--secondary);
}

.table-header th {
  position: sticky;
  top: 0;
  background-color: #494949; /* Matches your background color */
  z-index: 1; /* Keeps the header above the table rows */
}

.table tbody tr:nth-child(even) {
  background-color: #333;
}

.table-container::-webkit-scrollbar {
  height: 8px;
}

.table-container::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #ffbd59;
}


</style>
