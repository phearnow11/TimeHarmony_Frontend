<template>
  <div class="flex grid-cols-2 items-start justify-center w-full">
    <div class="col-span-1 mt-8">
      <div class="file-upload-form" @drop.prevent="handleDrop" @dragover.prevent>
        <label for="file" class="file-upload-label">
          <div class="file-upload-design">
            <span class="mdi mdi-cloud-upload-outline text-xl"></span>
            <p>Drag and Drop</p>
            <p>or</p>
            <span class="hover-underline-animation" @click="handleFileUpload">Browse file</span>
          </div>
        </label>
        <input id="file" type="file" accept="image/png, image/gif, image/jpeg" style="display: none" @change="handleFileUpload">
      </div>
      <div class="mt-3 upload-img grid grid-cols-5 gap-3">
        <div v-for="(image, index) in uploadedImages" :key="index" class="uploaded-image">
          <img :src="image" alt="Uploaded Image" />
          <button class="close-button" @click="removeImage(index)">×</button>
        </div>
      </div>
    </div>
    <div class="col-span-1">
      <div class="form-content">
        <div class="form__group field w-96">
          <input v-model="watchName" type="text" class="form__field" placeholder="Watch's Name" />
          <label for="watchname" class="form__label">Watch's Name</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96 mt-5">
          <textarea
            class="form__field form__field-description"
            placeholder="Description"
            id="description"
            rows="4"
            v-model="description"
            @input="adjustHeight"
            ref="textarea"
            :style="{ height: textareaHeight + 'px' }"
            @focus="isFocused = true"
            @blur="isFocused = false"
          ></textarea>
          <label for="description" class="desclabel" :class="{ active: isFocused }">Description</label>
        </div>
      </div>
      <div class="form-content">
        <div class="form__group field w-96">
          <input v-model="price" type="text" class="form__field" placeholder="Price" />
          <label for="price" class="form__label">Price</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useContentDeliveryNetwork } from '../stores/cdn'; // Adjust path as necessary

const description = ref("");
const textareaHeight = ref("80"); // Initial height of textarea
const isFocused = ref(false); // Flag to track textarea focus state
const textareaRef = ref(null); // Reference to the textarea element
const uploadedImages = ref([]); // Array to hold uploaded images
const watchName = ref(""); // Watch's Name
const price = ref(""); // Price

const adjustHeight = () => {
  // Adjust textarea height dynamically based on content
  textareaHeight.value = textareaRef.value.scrollHeight;
};

const handleDrop = async (event) => {
  const files = event.dataTransfer.files;
  await handleFiles(files);
};

const handleFileBrowse = async () => {
  const inputElement = document.getElementById('file');
  inputElement.click();
};

const handleFileUpload = async (event) => {
  const files = event.target.files;
  await handleFiles(files);
};

const handleFiles = async (files) => {
  for (let i = 0; i < files.length; i++) {
    try {
      const response = await useContentDeliveryNetwork().uploadFile(files[i]);
      uploadedImages.value.push(response.secure_url); // Assuming response structure, adjust as per your API response
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error as needed, e.g., show error message to user
    }
  }
};

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1);
};

</script>

<style scoped>
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

.upload-img {
  margin-left: -23%;
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

.file-upload-form {
  margin-top: 12px;
  width: 100%;
  height: fit-content;
  display: flex;
}

.file-upload-label {
  width: 100%;
  margin-right: 10rem;
  cursor: pointer;
  padding: 30px 150px;
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
  border: 1px solid #ddd;
  padding: 5px;
}

.uploaded-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #ff6b6b;
  border: none;
  color: white;
  font-size: 16px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
}
</style>
