import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alert';

export const updateProduct = async (data) => {
  try {
    const url = `/api/products/${data.id}?name=${data.name}&quantity=${data.quantity}&description=${data.description}&city=${data.city}`;
    const res = await axios.patch(url);
    if (res.data.status === 'success') {
      showAlert('success', `${data.name} updated successfully`);
    }
  } catch (error) {
    showAlert('error', `Something went wrong. The product with the same name already exists`);
  }
};
