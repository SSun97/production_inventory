import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alert';

export const addProduct = async (data) => {
  try {
    const url = `/api/products/?name=${data.name}&quantity=${data.quantity}&description=${data.description}&city=${data.city}`;
    const res = await axios.post(url);
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} created successfully`);
    }
  } catch (error) {
    // showAlert('error', error.response.data.message);
  }
};
