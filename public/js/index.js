import '@babel/polyfill';
import { addProduct } from './addProduct';

const addProductForm = document.querySelector('.form-addProduct');
// console.log(addProductForm);
// if (addProductForm) {
//   addProductForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const productName = 'aaa';
//     // const productName = document.getElementById('product_name').value;
//     const productQty = 1;
//     // const productQty = document.getElementById('product_qty').value;
//     // const productLocation = document.getElementById('product_location').value;
//     const productLocation = 'New York';
//     const productDes = 'bbb';
//     // const productDes = document.getElementById('product_des').value;
//     addProduct(productName, productQty, productLocation, productDes);
//   });
// }
if (addProductForm) addProductForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = {};
  form.name = document.getElementById('product_name').value;
  form.quantity = document.getElementById('product_qty').value;
  // form.city = 'New York';
  form.city = document.getElementById('product_city').value;
  form.description = document.getElementById('product_des').value;
  // form.append('name', document.getElementById('product_name').value);
  // form.append('quantity', document.getElementById('product_qty').value);
  // form.append('city', 'New York');
  // // form.append('city', document.getElementById('product_city').value);
  // form.append('description', document.getElementById('product_des').value);
  console.log(form);
  addProduct(form);
});