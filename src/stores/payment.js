import axios from 'axios';
var api = import.meta.env.VITE_API_PORT

export const createVnPayPayment = async (amount, wids) => {
  const totalAmount = Math.round(amount);
  try {
    const response = await axios.post(`${api}/payment/vn-pay?amount=${totalAmount}`, wids);
    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error('Error fetching payment URL:', error.response ? error.response.data : error.message);
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

export const paymentCOD = async (data) => {
  try {
    const response = await axios.post(`${api}/payment/cash`, data);
    return response.data;
  } catch (error) {
    console.error('Error saving payment details:', error);
    throw error;
  }
};