import axios from 'axios';
var api = import.meta.env.VITE_API_PORT
export const createVnPayPayment = async (amount,watch_ids) => {
  try {
    const response = await axios.get(`${api}/payment/vn-pay?amount=${amount}`,watch_ids);
    return response.data;
  } catch (error) {
    console.error('Error creating VNPay payment:', error);
    throw error;
  }
};

export const savePaymentDetail = async (data) => {
  try {
    const response = await axios.post(`${api}/payment/insert-payment-detail`, data);
    return response.data;
  } catch (error) {
    console.error('Error saving payment details:', error);
    throw error;
  }
};
