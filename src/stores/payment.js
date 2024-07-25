import axios from 'axios';
var api = import.meta.env.VITE_API_PORT
export const createVnPayPayment = async (amount, wids) => {
  const totalAmount = Math.round(amount);

  try {
    // Construct the URL
    const url = `${api}/payment/vn-pay?amount=${totalAmount}`;

    // Perform the GET request with custom headers
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Custom-Body': JSON.stringify(wids) // Use a custom header to send body data
      },
    });

    if (!response.ok) {
      console.log(JSON.stringify(wids));
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data.paymentUrl; // Return the payment URL
  } catch (error) {
    console.error('Error fetching payment URL:', error);
    throw error; // Re-throw the error to be handled by the caller
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
