import { defineStore } from 'pinia';

const cdnConfig = {
  botToken: '7318850828:AAFFatY9PLo2waC_LH4qkYVpxGxQ5scr_fo',
  chatId: '-1002201789618',
};

export const useContentDeliveryNetwork = defineStore('cdn', {
  state: () => ({}),
  actions: {
    async uploadFile(file) {
      try {
        const formData = new FormData();
        formData.append('bot_token', cdnConfig.botToken);
        formData.append('chat_id', cdnConfig.chatId);
        formData.append('document', file);

        console.log('Uploading file with formData:', formData);

        const response = await fetch('https://cdn.thinology.id.vn/send', {
          method: 'POST',
          body: formData,
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
          throw new Error('File upload failed');
        }

        const data = await response.json();
        console.log('File uploaded successfully:', data);
        return data;
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    },
  }
});
