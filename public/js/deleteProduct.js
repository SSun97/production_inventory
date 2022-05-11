import '@babel/polyfill';
import axios from 'axios';
import { showAlert } from './alert';

export const deleteProduct = async (data) => {
  try {
    const url = `/api/products/${data.id}`;
    const res = await axios.delete(url);
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
    }
  } catch (error) {
    // showAlert('error', error.response.data.message);
  }
}