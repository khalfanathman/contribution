/* eslint-disable  */

import '@babel/polyfill';
import { login, logout } from './login';
import { UpdateSettings } from './updateSettings';
import { trasnactMpesa } from './mpesa';

const loginForm = document.querySelector('.user');
const logOutBtn = document.getElementById('logoutModal');
const Createbeneficiary = document.getElementById('contribution');
const userPasswordForm = document.querySelector('.form-user-password');
const updateUser = document.querySelector('.userform');
const contributeEvent = document.querySelector('.contribform');
// DOM ELEMENTS

//VALUES
if (Createbeneficiary) {
  contributeEvent.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.cntribtbtn').textContent = 'Processing...';
    const { contribId } = e.target.dataset;
    console.log(contribId);
    const phone = document.getElementById('phone').value;
    const amount = document.getElementById('amount').value;
    const sms = document.getElementById('sms').value;
    console.log(amount, phone, sms, contribId);
    if (contribId) trasnactMpesa(phone, amount, sms, contribId);
    document.querySelector('.cntribtbtn').textContent = 'Contribute';
  });
}
if (contributeEvent) {
  contributeEvent.addEventListener('click', (e) => {
    e.preventDefault();
    console.log(' test 1 ');
    document.querySelector('.cntribtbtn').textContent = 'Processing...';
    const { contribId } = e.target.dataset;
    console.log(contribId);
    const phone = document.getElementById('phone').value;
    const amount = document.getElementById('amount').value;
    const sms = document.getElementById('sms').value;
    console.log(amount, phone, sms, contribId);
    if (contribId) trasnactMpesa(phone, amount, sms, contribId);
    document.querySelector('.cntribtbtn').textContent = 'Contribute';
  });
}
if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('exampleInputEmail').value;
    const password = document.getElementById('exampleInputPassword').value;

    login(email, password);
  });
}
if (updateUser) {
  updateUser.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.submtbtn').textContent = 'Updating...';
    const email = document.getElementById('inputEmail').value;
    const first_name = document.getElementById('inputName').value;

    await UpdateSettings({ first_name, email }, 'data');
    document.querySelector('.submtbtn').textContent = 'Submit';
  });
}
if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
