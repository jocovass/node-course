/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';

//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const logoutBtn = document.querySelector('.nav__el--logout');

//DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const name = this.elements.name.value;
    const email = this.elements.email.value;

    updateSettings({ name, email }, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = this.elements['password-current'].value;
    const password = this.elements.password.value;
    const passwordConfirm = this.elements['password-confirm'].value;
    await updateSettings(
      { password, passwordCurrent, passwordConfirm },
      'password'
    );
    this.elements['password-current'].value = '';
    this.elements.password.value = '';
    this.elements['password-confirm'].value = '';
    document.querySelector('.btn--save-password').textContent = 'Save Password';
  });
}

if (logoutBtn) logoutBtn.addEventListener('click', logout);
