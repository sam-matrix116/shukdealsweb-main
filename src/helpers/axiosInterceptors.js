import { getUserToken } from './authUtils';
import axios from 'axios';

axios.interceptors.request.use(function (config) {
  const token = getUserToken();
  // document.body.classList.add('custom-loader');
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
  }
  // if (config.url.includes('categories') && (config.method == 'post' || config.method == 'POST')) {
  // }
  else {
    config.headers['Content-Type'] = 'Application/json';

  }
  return config;
}, function (error) {
  // Do something with request error
  document.body.classList.remove('custom-loader');
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  document.body.classList.remove('custom-loader');
  return response;
}, function (error) {
  document.body.classList.remove('custom-loader');
  return Promise.reject(error);
});

