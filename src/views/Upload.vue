<template>
  
  <div class="flex grid-cols-2 items-center justify-center w-full">
    <div class="col-span-1 mt-8 mx-auto">
      <div class="flex items-start">
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
      </div>
      
      <div class="mt-3 upload-img grid grid-cols-5 gap-3">
        <div v-for="(image, index) in uploadedImages" :key="index" class="uploaded-image">
          <img :src="image.url" alt="Uploaded Image" />
          <div class="image-overlay"></div> <!-- Add the gradient overlay div on top of the image -->
          <div v-if="image.loading" class="loader-container flex justify-center items-center">
            <span class="loader"></span>
          </div>
          <button class="close-button" @click="removeImage(index)">×</button>
        </div>
      </div>
    </div>
    <div class="col-span-1 mx-auto">
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

// const handleFileBrowse = async () => {
//   const inputElement = document.getElementById('file');
//   inputElement.click();
// };

const handleFileUpload = async (event) => {
  const files = event.target.files;
  await handleFiles(files);
};

const handleFiles = async (files) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
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

const uploadToCDN = async (file, imageObject) => {
  try {
    const response = await useContentDeliveryNetwork().uploadFile(file);
    // Update image URL and loading status after successful upload
    imageObject.url = response.data.secure_url;
  } catch (error) {
    console.error('Error uploading file:', error);
    // Handle error as needed, e.g., show error message to user
  } finally {
    // Update loading status after upload attempt
    imageObject.loading = false;
    // Force Vue to re-render to reflect changes in imageObject
    uploadedImages.value = [...uploadedImages.value];
  }
};

const removeImage = (index) => {
  uploadedImages.value.splice(index, 1);
};
</script>

<style scoped>
.col-span-1 {
  width: 50%; /* Set the width of the left column to 50% */
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center the content vertically */
  align-items: center; /* Center the content horizontally */
}

.file-upload-form {
  margin-top: 12px;
  width: 100%;
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

/* .upload-img {
  margin-left: -23%;
} */

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

.upload-img {
  display: flex;
  justify-content: center; /* Center the uploaded images horizontally */
  gap: 10px; /* Add gap between the uploaded images for spacing */
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
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.759), transparent); /* Add gradient overlay on top of the image */
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
  background: rgba(23, 23, 23, 0.5); /* Adjust the alpha value for transparency */
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

.loader::after {
  content: '';  
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