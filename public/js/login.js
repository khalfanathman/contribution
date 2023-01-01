/* eslint-disable no-undef */
// const loginForm = document.querySelector('.user');
/* eslint-disable no-undef */
import '@babel/polyfill';
import { showAlert } from './alert';
import axios from 'axios';

export const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in Successfully');
      window.setTimeout(() => {
        location.assign('/');
        // location.replace(document.referrer);
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });
    if (res.data.status === 'success') {
      // window.location.reload(true);
      location.assign('/');
    }
  } catch (error) {
    showAlert('error', 'Error logging out! Try again.');
  }
};
