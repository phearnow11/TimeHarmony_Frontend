import axios from 'axios';

const apiUrl = "https://vietnam-administrative-division-json-server-swart.vercel.app";
const apiEndpointProvince = `${apiUrl}/province`;
const apiEndpointDistrict = `${apiUrl}/district`;
const apiEndpointCommune = `${apiUrl}/commune`;

export const fetchProvinces = async () => {
  try {
    const response = await axios.get(apiEndpointProvince);
    return response.data;
  } catch (error) {
    console.error('Error fetching provinces:', error);
    throw error;
  }
};

export const fetchDistricts = async (provinceId) => {
  try {
    const response = await axios.get(`${apiEndpointDistrict}?idProvince=${provinceId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    throw error;
  }
};

export const fetchWards = async (districtId) => {
  try {
    const response = await axios.get(`${apiEndpointCommune}?idDistrict=${districtId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wards:', error);
    throw error;
  }
};