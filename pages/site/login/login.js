const formLogin = document.getElementById('login');
const formRegister = document.getElementById('register');

// Cookies
function setCookie(cookieName, cookieValue, hoursToExpire, path, domain) {
  let date = new Date();
  date.setTime(date.getTime() + hoursToExpire * 60 * 60 * 1000);
  document.cookie = cookieName + '=' + cookieValue + '; expires=' + date.toGMTString() + 'path=' + path + 'domain=' + domain;
}
function getCookie(cookieName) {
  var cookieValue = document.cookie.match('(^|;)\\s*' + cookieName + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : '';
}
function deleteCookie(cookieName) {
  document.cookie = cookieName + '=; max-age=0; expires=0';
}

// Functions
function setFormMessage(formElement, type, message) {
  const messageElement = formElement.querySelector('.form__message');

  messageElement.textContent = message;
  messageElement.classList.remove(`form__message-success`, `form__message-error`);
  messageElement.classList.add(`form__message-${type}`);
}
function clearFormMessage(formElement) {
  const messageElement = formElement.querySelector('.form__message');
  messageElement.textContent = ``;
  messageElement.classList.remove(`form__message-success`, `form__message-error`);
}
function setInputError(inputElement, message) {
  inputElement.classList.add(`form__input-error`);
  inputElement.parentElement.querySelector('.form__input-error-message').textContent = message;
}
function clearInputElement(inputElement) {
  inputElement.classList.remove(`form__input-error`);
  inputElement.parentElement.querySelector('.form__input-error-message').textContent = ``;
}

// Login
async function login() {
  try {
    let data = {};
    data.username = document.getElementById('username').value;
    data.password = document.getElementById('password').value;
    let res = await axios.post('/api/auth/login', data);
    res = res.data.details[0];

    if (res.message === 'pass') {
      setCookie('perm', res.permissions, '4320', '/');
      window.location.href = '../index.html';
    } else {
      throw res.message;
    }
  } catch (err) {
    setFormMessage(formLogin, `error`, err);
  }
}

// Register
async function register() {
  let data = {};
  data.username = document.getElementById('registerUsername').value;
  data.email = document.getElementById('registerEmail').value;
  data.password = document.getElementById('registerPassword').value;
  data.password2 = document.getElementById('confirmPassword').value;

  let fails = validateRegister(data);
  console.log(fails.length);
  console.log(fails);
  if (fails.length === 0) {
    console.log('send');
    sendRegister(data);
  } else {
    setFormMessage(formRegister, `error`, `form validation error`);
  }
}
function validateRegister(data) {
  let regexPass = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm);
  let regexName = new RegExp(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/gm);
  let regexEmail = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/gm);

  let failures = [];

  if (!data.username) {
    failures.push({ input: 'username', msg: 'required' });
    data.username = null;
  } else if (!regexName.test(data.username)) {
    failures.push({ input: 'username', msg: 'invalid' });
    data.username = null;
  }

  if (!data.email) {
    failures.push({ input: 'email', msg: 'required' });
    data.email = null;
  } else if (!regexEmail.test(data.email)) {
    failures.push({ input: 'email', msg: 'invalid' });
    data.email = null;
  }

  if (!data.password) {
    failures.push({ input: 'password', msg: 'required' });
    data.password = null;
  } else if (regexPass.test(data.password) === false) {
    failures.push({ input: 'password', msg: 'invalid' });
    data.password = null;
  }

  if (!data.password2) {
    failures.push({ input: 'confirm password', msg: 'required' });
    data.password2 = null;
  } else if (data.password != data.password2) {
    failures.push({ input: 'passwords', msg: 'do not match' });
    data.password = null;
    data.password2 = null;
  }

  return failures;
}
async function sendRegister(data) {
  try {
    let res = await axios.post('/api/auth/register', data);
    if (res.data.detail) {
      throw res.data.detail;
    }

    res = res.data.details[0];
    if (res.message === 'pass') {
      setCookie(`perm`, res.permissions, `4320`, `/`);
      window.location.href = '../index.html';
    } else {
      throw `form validation error`;
    }
  } catch (err) {
    setFormMessage(formRegister, `error`, err);
  }
}

// DOM loaded
document.addEventListener('DOMContentLoaded', (ev) => {
  document.getElementById(`linkRegister`).addEventListener(`click`, (ev) => {
    ev.preventDefault();
    formLogin.classList.add(`form--hidden`);
    formRegister.classList.remove(`form--hidden`);
  });
  document.getElementById(`linkLogin`).addEventListener(`click`, (ev) => {
    ev.preventDefault();
    formLogin.classList.remove(`form--hidden`);
    formRegister.classList.add(`form--hidden`);
  });

  //Login
  formLogin.addEventListener('submit', (ev) => {
    ev.preventDefault();
    deleteCookie('perm');
    login();
  });

  // Register
  formRegister.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    register();
  });

  // form validation
  document.querySelectorAll('.form__input').forEach((inputElement) => {
    // Clear All Form Errors And Specific Input Errors On Input
    inputElement.addEventListener('input', (ev) => {
      clearInputElement(inputElement);
      clearFormMessage(formRegister);
      clearFormMessage(formLogin);
    });

    // Register From
    //Username
    inputElement.addEventListener('blur', async (ev) => {
      let regex = new RegExp(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/gm);
      if (ev.target.id === `registerUsername` && ev.target.value.length > 0 && !regex.test(ev.target.value)) {
        setInputError(inputElement, `8-20 Characters No Special Characters`);
      } else if (ev.target.id === `registerUsername` && ev.target.value.length > 0) {
        try {
          let res = await axios.post('/api/auth/register/get/user', { username: ev.target.value });

          if (res.data.details.length > 0) {
            res = res.data.details[0];
          } else {
            return;
          }

          if (res.username === ev.target.value) {
            setInputError(inputElement, `Username Taken`);
          } else if (res.message) {
            let err = res.message;
            throw err;
          }
        } catch (err) {
          setInputError(inputElement, err);
        }
      }
    });

    // Email
    inputElement.addEventListener('blur', async (ev) => {
      let regex = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/gm);
      if (ev.target.id === `registerEmail` && ev.target.value.length > 0 && !regex.test(ev.target.value)) {
        setInputError(inputElement, `Enter A Valid Email.`);
      } else if (ev.target.id === `registerEmail` && ev.target.value.length > 0) {
        try {
          let res = await axios.post('/api/auth/register/get/email', { email: ev.target.value });

          if (res.data.details.length > 0) {
            res = res.data.details[0];
          } else {
            return;
          }

          if (res.email === ev.target.value) {
            setInputError(inputElement, `Email Taken`);
          } else if (res.message) {
            let err = res.message;
            throw err;
          }
        } catch (err) {
          setInputError(inputElement, err);
        }
      }
    });

    //Password
    inputElement.addEventListener('blur', (ev) => {
      let regex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm);
      if (ev.target.id === `registerPassword` && ev.target.value.length > 0 && !regex.test(ev.target.value)) {
        setInputError(inputElement, `Uppercase; Lowercase; Number; Special; Minimum 8 Characters`);
      }
    });
    inputElement.addEventListener('blur', (ev) => {
      let confirmPassword = document.getElementById('confirmPassword');
      if (ev.target.id === `registerPassword` && ev.target.value.length > 0 && confirmPassword.value.length > 0 && ev.target.value != confirmPassword) {
        setInputError(confirmPassword, `Passwords Do Not Match`);
      }
    });
    inputElement.addEventListener('input', (ev) => {
      let confirmPassword = document.getElementById('confirmPassword');
      if (ev.target.id === `registerPassword` && confirmPassword.value.length > 0) {
        clearInputElement(confirmPassword);
      }
    });

    // Confirm Password
    inputElement.addEventListener('blur', (ev) => {
      let pass = document.getElementById('registerPassword').value;
      if (ev.target.id === `confirmPassword` && ev.target.value.length > 0 && ev.target.value != pass) {
        setInputError(inputElement, `Passwords Do Not Match`);
      }
    });
  });
});
