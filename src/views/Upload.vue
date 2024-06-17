<template>
  <div class="flex flex-col items-center justify-center w-full">
    <form class="file-upload-form">
      <label for="file" class="file-upload-label">
        <div class="file-upload-design">
          <span class="mdi mdi-cloud-upload-outline text-xl"></span>
          <p>Drag and Drop</p>
          <p>or</p>
          <span class="hover-underline-animation">Browse file</span>
        </div>
        <input id="file" type="file" />
      </label>
    </form>

    <div class="form-content mt-3">
      <div class="form__group field w-96">
        <input type="text" class="form__field" placeholder="Watch's Name" />
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
        <label
          for="description"
          class="desclabel"
          :class="{ active: isFocused }"
          >Description</label
        >
      </div>
    </div>

    <div class="form-content">
      <div class="form__group field w-96">
        <input type="text" class="form__field" placeholder="Price" />
        <label for="price" class="form__label">Price</label>
      </div>
    </div>





  </div>


</template>

<script>
export default {
  data() {
    return {
      description: "",
      textareaHeight: "80", // Initial height of textarea
      isFocused: false, // Flag to track textarea focus state
    };
  },
  methods: {
    adjustHeight() {
      // Adjust textarea height dynamically based on content
      this.textareaHeight = this.$refs.textarea.scrollHeight;
    },
  },
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
  width: 90%;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-upload-label {
  width: 100%;
}

.file-upload-label input {
  display: none;
}

.file-upload-label svg {
  height: 50px;
  fill: rgb(255, 255, 255);
  margin-bottom: 20px;
}

.file-upload-label {
  cursor: pointer;
  padding: 30px 70px;
  border: 2px dashed rgb(82, 82, 82);
}

.file-upload-design {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>
