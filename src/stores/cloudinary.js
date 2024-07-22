import { defineStore } from 'pinia';
import { Cloudinary } from '@cloudinary/url-gen';

const cloudinaryConfig = {
  cloudName: import.meta.env.VITE_CLOUD_NAME,
  uploadPreset: import.meta.env.VITE_UPLOAD_PRESET,  // replace with your actual upload preset
};

export const useCloudinaryStore = defineStore('cloudinary', {
  state: () => ({
    cloudinaryInstance: new Cloudinary({
      cloud: {
        cloudName: cloudinaryConfig.cloudName,
      },
    }),
  }),
  actions: {
    async uploadImage(imageUrl) {
      try {
        const formData = new FormData();
        formData.append('file', imageUrl);
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Image upload failed');
        }

        const data = await response.json();
        console.log('Image uploaded successfully:', data);
        return data;
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
      }
    },

    getImageUrl(publicId, options = {}) {
      return this.cloudinaryInstance.url(publicId, options);
    }
  }
});
