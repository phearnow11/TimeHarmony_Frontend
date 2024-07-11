<script setup>
import { ref, watch, computed } from 'vue';
import axios from 'axios';

const apiUrl = "https://vietnam-administrative-division-json-server-swart.vercel.app";
const apiEndpointProvince = `${apiUrl}/province`;
const apiEndpointDistrict = `${apiUrl}/district`;
const apiEndpointCommune = `${apiUrl}/commune`;

const provinces = ref([]);
const districts = ref([]);
const wards = ref([]);

const selectedProvince = ref('');
const selectedDistrict = ref('');
const selectedWard = ref('');

const isLoadingProvinces = ref(false);
const isLoadingDistricts = ref(false);
const isLoadingWards = ref(false);

// Fetch provinces
const fetchProvinces = async () => {
  isLoadingProvinces.value = true;
  try {
    const response = await axios.get(apiEndpointProvince);
    provinces.value = response.data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
  }
  isLoadingProvinces.value = false;
};

// Fetch districts based on selected province
const fetchDistricts = async () => {
  if (!selectedProvince.value) return;
  isLoadingDistricts.value = true;
  try {
    const response = await axios.get(`${apiEndpointDistrict}?idProvince=${selectedProvince.value}`);
    districts.value = response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
  }
  isLoadingDistricts.value = false;
};

// Fetch wards based on selected district
const fetchWards = async () => {
  if (!selectedDistrict.value) return;
  isLoadingWards.value = true;
  try {
    const response = await axios.get(`${apiEndpointCommune}?idDistrict=${selectedDistrict.value}`);
    wards.value = response.data;
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching wards:', error);
  }
  isLoadingWards.value = false;
};

// Watch for changes in selections
watch(selectedProvince, () => {
  selectedDistrict.value = '';
  selectedWard.value = '';
  districts.value = [];
  wards.value = [];
  if (selectedProvince.value) {
    fetchDistricts();
  }
});

watch(selectedDistrict, () => {
  selectedWard.value = '';
  wards.value = [];
  if (selectedDistrict.value) {
    fetchWards();
  }
});

// Fetch provinces on component mount
fetchProvinces();

const selectedProvinceName = computed(() => {
  return provinces.value.find(p => p.idProvince === selectedProvince.value)?.name || '';
});

const selectedDistrictName = computed(() => {
  return districts.value.find(d => d.idDistrict === selectedDistrict.value)?.name || '';
});

const selectedWardName = computed(() => {
  return wards.value.find(w => w.idCommune === selectedWard.value)?.name || '';
});

const selectedProvinceId = computed(() => selectedProvince.value || '');
const selectedDistrictId = computed(() => selectedDistrict.value || '');
const selectedWardId = computed(() => selectedWard.value || '');

</script>

<template>
  <div class="address-form">
    <div class="select-item">
      <label for="province" class="select-label">Tỉnh/Thành Phố:</label><br>
      <select class="custom-select w-96" id="province" v-model="selectedProvince">
        <option value="">Chọn Tỉnh/Thành Phố...</option>
        <option v-for="province in provinces" :key="province.idProvince" :value="province.idProvince">
          {{ province.name }}
        </option>
      </select>
      <span v-if="isLoadingProvinces">Loading...</span>
    </div>

    <div class="select-item">
      <label for="district" class="select-label">Quận/Huyện:</label> <br>
      <select class="custom-select w-96" id="district" v-model="selectedDistrict" :disabled="!selectedProvince">
        <option value="">Chọn Quận/Huyện...</option>
        <option v-for="district in districts" :key="district.idDistrict" :value="district.idDistrict">
          {{ district.name }}
        </option>
      </select>
      <span v-if="isLoadingDistricts">Loading...</span>
    </div>

    <div class="select-item">
      <label for="ward" class="select-label">Phường/Xã:</label> <br>
      <select class="custom-select w-96" id="ward" v-model="selectedWard" :disabled="!selectedDistrict">
        <option value="">Chọn Phường/Xã...</option>
        <option v-for="ward in wards" :key="ward.idCommune" :value="ward.idCommune">
          {{ ward.name }}
        </option>
      </select>
      <span v-if="isLoadingWards">Loading...</span>
    </div>
  </div>
  <div>
    <br>
    <h2 v-if="selectedProvinceName || selectedDistrictName || selectedWardName">
      Selected Province: {{ selectedProvinceName }} (ID: {{ selectedProvinceId }})<br>
      Selected District: {{ selectedDistrictName }} (ID: {{ selectedDistrictId }})<br>
      Selected Ward: {{ selectedWardName }} (ID: {{ selectedWardId }})
    </h2>
  </div>
</template>

<style scoped>
.select-item {
  margin-bottom: 1rem;
}

.select-label {
  display: block;
  font-size: 1rem;
  color: var(--secondary); /* Yellow text color */
}

.custom-select {
  padding: 0.5rem 1rem;
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

span {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--secondary); /* Yellow text color */
}
</style>
