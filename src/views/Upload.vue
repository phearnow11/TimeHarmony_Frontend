<template>
  <div
    v-if="auth.user_id"
    class="flex grid-cols-2 items-start justify-center w-full"
  >
    <div class="col-span-1 mt-8 mx-auto">
      <div class="flex items-start">
        <div
          class="file-upload-form"
          @drop.prevent="handleDrop"
          @dragover.prevent
          @dragenter.prevent
        >
          <label for="file" class="file-upload-label w-full">
            <div class="file-upload-design">
              <span class="mdi mdi-cloud-upload-outline text-xl"></span>
              <p>Kéo và thả</p>
              <p>hoặc</p>
              <span class="hover-underline-animation" @click="handleFileUpload"
                >Tải tệp lên</span
              >
            </div>
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleFileUpload"
          />
        </div>
      </div>

      <div class="mt-3 upload-img grid grid-cols-5 gap-3">
        <div
          v-for="(image, index) in uploadedImages"
          :key="index"
          class="uploaded-image w-full sm:w-1/5"
        >
          <img :src="image.url" alt="Uploaded Image" />
          <div class="image-overlay"></div>
          <div
            v-if="image.loading"
            class="loader-container flex justify-center items-center"
          >
            <div class="loader">
              <div class="loaderBar"></div>
            </div>
          </div>
          <button class="close-button" @click="removeImage(index)">×</button>
        </div>
      </div>
    </div>
    <div class="col-span-1 mx-auto flex justify-start items-start">
      <h3 class="text-3xl">Thông tin sản phẩm đăng bán</h3>
      <div class="form-content">
        <div class="form__group field">
          <input
            v-model="watchData.name"
            type="text"
            class="form__field"
            placeholder="Watch's Name"
          />
          <label for="watchname" class="form__label">Tên đồng hồ</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96 mt-5">
          <textarea
            class="form__field form__field-description"
            placeholder="Description"
            id="description"
            rows="4"
            v-model="watchData.description"
            @input="adjustHeight"
            ref="textarea"
            :style="{ height: textareaHeight + 'px' }"
            @focus="isFocused = true"
            @blur="isFocused = false"
          ></textarea>
          <label
            for="description"
            class="desclabel"
            :class="{ active: isFocused }"
            >Mô tả</label
          >
        </div>
      </div>

      <div class="form__group field flex flex-col w-96 justify-start">
        <div class="mydict">
          <div class="form">
            <label class="mb-3 text-[#9b9b9b]">Hình thức kiểm định</label>
            <div class="select pb-4 gender-select">
              <label>
                <input
                  type="radio"
                  name="radio"
                  checked
                  @click="unisexGender"
                  id="defaut-gender"
                  value="Unisex"
                />
                <span class="select-op">Offline</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="radio"
                  @click="maleGender"
                  value="Male"
                />
                <span class="select-op">Online</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="form__group field flex w-96 justify-start">
        <VueDatePicker
          v-model="date"
          placeholder="Chọn ngày muốn kiểm định"
          :format="formatDate"
          :enable-time-picker="false"
        ></VueDatePicker>
      </div>
      <!-- <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.price"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Giá mong</label>
        </div>
      </div> -->
      <!-- <h3 class="text-3xl">Tính năng</h3>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.calender"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Lịch</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.feature"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Tính năng</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.movement"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Hoạt động</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.function"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Chức năng</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.engine"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Động cơ</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.water_resistant"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Kháng nước</label>
        </div>
      </div>
      <h3 class="text-3xl">Quay số</h3>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.dial_type"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Loại quay số</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.dial_color"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Màu sắc</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.crystal"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Pha lê</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.second_makers"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Nhà sản xuất thứ hai</label>
        </div>
      </div>
      <h3 class="text-3xl">Dây đeo</h3>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.band_color"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Màu sắc</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.band_type"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Loại dây</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.clasp"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Móc cài</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.bracelet"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Vòng đeo</label>
        </div>
      </div>
      <h3 class="text-3xl">Vỏ</h3>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.bezel"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Khung viền</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.bezel_material"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Chất liệu khung viền</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.case_back"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Mặt sau</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.casedimension"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Kích thước vỏ đồng hồ</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.case_shape"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Hình dạng vỏ</label>
        </div>
      </div>

      <h3 class="text-3xl">Thuộc tính</h3>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.brand"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Thương hiệu</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.series"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Series</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.model"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Mẫu</label>
        </div>
      </div>
      
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.style_type"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Phong cách</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.sub_class"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Lớp phụ</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input
            v-model="watchData.made_label"
            type="text"
            class="form__field"
            placeholder="Price"
          />
          <label for="price" class="form__label">Nhãn thực hiện</label>
        </div>
      </div> -->
      <p v-if="dateWarning" class="text-red-500">{{ dateWarning }}</p>
      <br />
      <div class="flex justify-end button-div">
        <div class="flex items-center submit-watch">
          <div class="hover-underline-animation-r" @click.stop="clear">
            Xoá dữ liệu nhập
          </div>
        </div>
        <button @click="uploadHandle" class="th-p-btn w-44 relative">
          <span :class="{ 'opacity-0': isLoading }">Hoàn tất đăng tin</span>
          <div v-if="isLoading" class="loader-container">
            <div class="loader">
              <div class="loaderBar"></div>
            </div>
          </div>
        </button>
      </div>
      <PopUp
        :show="isPopupVisible"
        :product="currentProduct"
        :message="popupMessage"
        :showDetails="showProductDetails"
        @close="isPopupVisible = false"
      />
    </div>
  </div>
  <div v-else class="h-screen flex flex-col items-center justify-center">
    <div>
      <p class="text-xl font-medium text-center">
        Bạn cần đăng nhập để sử dụng chức năng này,
        <router-link class="hover-underline-animation" to="/login"
          >Đăng nhập ngay</router-link
        >
      </p>
    </div>
    <div class="mt-4">
      <router-link to="/" class="hover-underline-animation"
        >Quay trở lại trang chủ</router-link
      >
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, watch } from "vue";
import { useWatchStore } from "../stores/watch";
import { useUserStore } from "../stores/user";
import { useCloudinaryStore } from "../stores/cloudinary";
import PopUp from "../components/PopUp.vue";
import router from "../router";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import { useAuthStore } from "../stores/auth";

const date = ref(new Date());
const dateWarning = ref("");

const validateDate = (selectedDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part for comparison
  if (!selectedDate) return null;

  if (selectedDate < today) {
    dateWarning.value = "Bạn không thể chọn ngày trong quá khứ.";
    date.value = null;
  } else {
    dateWarning.value = "";
  }
};

watch(date, (newDate) => {
  validateDate(newDate);
});

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
console.log(formatDate(date.value));
const isPopupVisible = ref(false);
const popupMessage = ref("");
const showProductDetails = ref(true);
const isLoading = ref(false);
const auth = useUserStore();
const watchData = reactive({
  name: "",
  price: "",
  description: "",
  brand: "",
  series: "",
  model: "",
  gender: "Unisex",
  style_type: "",
  sub_class: "",
  made_label: "",
  calender: "",
  feature: "",
  movement: "",
  function: "",
  engine: "",
  water_resistant: "",
  band_color: "",
  band_type: "",
  clasp: "",
  bracelet: "",
  dial_type: "",
  dial_color: "",
  crystal: "",
  second_makers: "",
  bezel: "",
  bezel_material: "",
  case_back: "",
  casedimension: "",
  case_shape: "",
});

if (
  useUserStore().role != "ROLE_USER" &&
  useUserStore().role != "ROLE_SELLER"
) {
  router.push("/");
}

const textareaHeight = ref("80"); // Initial height of textarea
const isFocused = ref(false); // Flag to track textarea focus state
const uploadedImages = ref([]); // Array to hold uploaded images
const imageURLs = ref([]);

// const adjustHeight = () => {
//   // Adjust textarea height dynamically based on content
//   textareaHeight.value = textareaRef.value.scrollHeight;
// };

onMounted(() => {
  date.value = null;
  if (localStorage.getItem("showUploadSuccessPopup") === "true") {
    popupMessage.value = "Đăng bán thành công";
    isPopupVisible.value = true;
    showProductDetails.value = false;
    localStorage.removeItem("showUploadSuccessPopup");
  }
});

async function uploadHandle() {
  isLoading.value = true;
  try {
    const uploadData = {
      name: watchData.name,
      price: watchData.price,
      description: watchData.description,
      images: imageURLs.value,
      brand: watchData.brand,
      series: watchData.series,
      model: watchData.model,
      gender: watchData.gender,
      style: watchData.style_type,
      subclass: watchData.sub_class,
      madelabel: watchData.made_label,
      calender: watchData.calender,
      feature: watchData.feature,
      movement: watchData.movement,
      function: watchData.function,
      engine: watchData.engine,
      waterresistant: watchData.water_resistant,
      bandcolor: watchData.band_color,
      bandtype: watchData.band_type,
      clasp: watchData.clasp,
      bracelet: watchData.bracelet,
      dialtype: watchData.dial_type,
      dialcolor: watchData.dial_color,
      crystal: watchData.crystal,
      secondmaker: watchData.second_makers,
      bezel: watchData.bezel,
      bezelmaterial: watchData.bezel_material,
      caseback: watchData.case_back,
      casedimension: watchData.casedimension,
      caseshape: watchData.case_shape,
    };
    useWatchStore().loadWatch(uploadData);
    const response = await useWatchStore().uploadWatch(
      useUserStore().user_id,
      useUserStore().username
    );
    useWatchStore().createRequestWatch(useAuthStore().user_id, response.data, watchData.description)
    console.log("Upload successful", response.data);

    await new Promise((resolve) => setTimeout(resolve, 2000));
    localStorage.setItem("showUploadSuccessPopup", "true");
    window.location.reload();
  } catch (error) {
    console.error("Upload error", error);
  } finally {
    isLoading.value = false;
  }
}

const isImageFile = (file) => {
  return file.type.startsWith("image/");
};

const handleDrop = async (event) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  await handleFiles(files);
};

const handleFileUpload = async (event) => {
  const files = event.target.files;
  await handleFiles(files);
};

const handleFiles = async (files) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!isImageFile(file)) {
      alert("Chỉ cho phép tải lên file ảnh!");
      continue;
    }
    const reader = new FileReader();

    reader.onload = () => {
      const localUrl = reader.result;
      const imageObject = { url: localUrl, loading: true };
      uploadedImages.value.push(imageObject);

      // Upload to CDN
      uploadToCDN(file, imageObject);
    };

    reader.readAsDataURL(file);
  }
};

const clear = () => {
  (watchData.name = ""),
    (watchData.price = ""),
    (watchData.description = ""),
    (imageURLs.value = ""),
    (watchData.brand = ""),
    (watchData.series = ""),
    (watchData.model = ""),
    (watchData.gender = ""),
    (watchData.style_type = ""),
    (watchData.sub_class = ""),
    (watchData.made_label = ""),
    (watchData.calender = ""),
    (watchData.feature = ""),
    (watchData.movement = ""),
    (watchData.function = ""),
    (watchData.engine = ""),
    (watchData.water_resistant = ""),
    (watchData.band_color = ""),
    (watchData.band_type = ""),
    (watchData.clasp = ""),
    (watchData.bracelet = ""),
    (watchData.dial_type = ""),
    (watchData.dial_color = ""),
    (watchData.crystal = ""),
    (watchData.second_makers = ""),
    (watchData.bezel = ""),
    (watchData.bezel_material = ""),
    (watchData.case_back = ""),
    (watchData.casedimension = ""),
    (watchData.case_shape = "");
  date.value = null;
};

const uploadToCDN = async (file, imageObject) => {
  try {
    const response = await useCloudinaryStore().uploadImage(file);
    // Update image URL and loading status after successful upload
    imageObject.url = response.secure_url;
    imageURLs.value.push(imageObject.url);
    imageObject.loading = false;
  } catch (error) {
    console.error("Error uploading file:", error);
    // Handle error as needed, e.g., show error message to user
    imageObject.loading = false;
    imageObject.error = true;
  } finally {
    // Force Vue to re-render to reflect changes in imageObject
    uploadedImages.value = [...uploadedImages.value];
  }
};

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1);
};

const unisexGender = () => {
  watchData.gender = "Unisex";
};

const maleGender = () => {
  watchData.gender = "Male";
};

const femaleGender = () => {
  watchData.gender = "Female";
};
</script>

<style scoped>
.field {
  width: 42rem;
}

.col-span-1 {
  width: 50%; /* Set the width of the left column to 50% */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center the content vertically */
  align-items: center; /* Center the content horizontally */
}

.file-upload-form {
  margin-top: 12px;
  width: 140%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center the drag-and-drop file section */
}

.form__field {
  padding: 0.5rem; /* Adjust padding as needed */
  width: 100%; /* Ensure the input fills its container */
  resize: vertical; /* Allow vertical resizing for textarea */
}

.form__field-description {
  border: 0.5px solid #9b9b9b; /* Border for description textarea */
  min-height: 80px; /* Adjust minimum height for textarea */
  margin-top: 1rem; /* Ensure space between top border and label */
  position: relative; /* Ensure relative positioning for containing the textarea */
  z-index: 1; /* Ensure textarea is behind the label */
}

.button-div {
  padding-left: 24rem;
}

.desclabel {
  color: #9b9b9b;
  font-size: 17px;
  position: absolute;
  top: -0rem; /* Adjust top positioning to overlap with textarea border */
  left: 0rem; /* Align with textarea */
  z-index: 2; /* Ensure label is above the textarea border */
  transition: color 0.2s ease-out; /* Smooth transition for label color change */
}

.desclabel.active {
  color: var(--secondary); /* Change label color when textarea is focused */
}

.form__field-description:focus {
  border: 1px solid #ffbd59;
}

.file-upload-label {
  width: 100%;
  cursor: pointer;
  padding: 30px 250px;
  border: 2px dashed rgb(82, 82, 82);
}

.file-upload-design {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.uploaded-image {
  position: relative;
  width: 100px;
  height: 100px;
  border: 0.5px solid var(--primary);
  padding: 5px;
}

.uploaded-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.759),
    transparent
  ); /* Add gradient overlay on top of the image */
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
  background: rgba(
    23,
    23,
    23,
    0.5
  ); /* Adjust the alpha value for transparency */
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

.close-button {
  position: absolute;
  top: -5px; /* Adjust the top position to move the button upwards */
  right: 5px; /* Adjust the right position to move the button to the right edge */
  border: none;
  font-size: 20px;
  width: 15px;
  height: 20px;
  cursor: pointer;
}

h3 {
  margin-top: 4rem;
  text-align: left;
  width: 45rem;
  font-family: "Arial", sans-serif; /* Use a clean and modern font */
  font-size: 1.5rem; /* Increase the font size */
  color: var(--secondary); /* Darker color for better readability */
  position: relative;
  margin-bottom: 1rem; /* Add some space below the heading */
  padding-bottom: 0.5rem; /* Add padding to the bottom */
  border-bottom: 2px solid #ffbd59; /* Add a bottom border for emphasis */
}

@media (max-width: 1024px) {
  .col-span-1 {
    width: 90%;
  }
  .file-upload-form {
    width: 100%;
  }
  .form__group.field {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .col-span-1 {
    width: 100%;
    padding: 0 20px;
  }
  .file-upload-form {
    padding: 20px;
  }
  .file-upload-label {
    padding: 20px;
  }
  h3 {
    font-size: 1.5rem;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .file-upload-design {
    gap: 2px;
  }
  .form__field {
    font-size: 0.9rem;
  }
  .file-upload-label {
    padding: 15px;
  }
  .uploaded-image {
    width: 80px;
    height: 80px;
  }
  .close-button {
    font-size: 18px;
    width: 12px;
    height: 18px;
  }
}

.submit-watch {
  width: 50%;
}

/* :focus {
  outline: 0;
  border-color: #FFBD59;
  box-shadow: 0 0 0 4px #FFBD59;
} */

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
  box-shadow: 0 0 0 0.0625em #ffbd59;
  background-color: #5232003a;
  z-index: 1;
  color: #ffbd59;
}

label .select-op {
  display: block;
  cursor: pointer;
  padding: 0.375em 0.75em;
  position: relative;
  margin-left: 0.0625em;
  box-shadow: 0 0 0 0.0625em #b5bfd9;
  letter-spacing: 0.05em;
  color: #fff;
  text-align: center;
  transition: background-color 0.5s ease;
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
