import '@babel/polyfill';
import { addProduct, updateProduct } from './addProduct';

const addProductForm = document.querySelector('.form-addProduct');
if (addProductForm) addProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = {};
  form.name = document.getElementById('product_name').value;
  form.quantity = document.getElementById('product_qty').value;
  form.city = document.getElementById('product_city').value;
  form.description = document.getElementById('product_des').value;
  addProduct(form);
  document.getElementById('product_name').value = '';
  document.getElementById('product_qty').value = '';
  document.getElementById('product_city').value = '';
  document.getElementById('product_des').value = '';
});

const updateProductForm = document.querySelector('.form-updateProduct');
if (updateProductForm) addProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = {};
  form.name = document.getElementById('product_name').value;
  form.quantity = document.getElementById('product_qty').value;
  form.city = document.getElementById('product_city').value;
  form.description = document.getElementById('product_des').value;
  console.log(form);
  updateProduct(form);
});


const deleteProductBtn = document.getElementById(`.btn-delete`);
if (deleteProductBtn) deleteProductBtn.addEventListener('click', (e) => {
  e.preventDefault();
})
