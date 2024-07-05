import axios from 'axios';

export const createVnPayPayment = async (amount) => {
  try {
    const response = await axios.get(`http://localhost:8080/payment/vn-pay?amount=${amount}`);
    return response.data;
  } catch (error) {
    console.error('Error creating VNPay payment:', error);
    throw error;
  }
};