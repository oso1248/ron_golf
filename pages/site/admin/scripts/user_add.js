String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
String.prototype.toNonAlpha = function (spaces) {
  if (spaces === true) {
    return this.replace(/[^\w\s]/gi, '').replace(/ +(?= )/g, '');
  } else {
    return this.replace(/[^0-9a-z]/gi, '');
  }
};

async function form_add(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  let data = read_add();
  // let fails = await validate_add(data);
  // if (fails.length > 0) {
  //   alert(`Problems:\n ${fails}`);
  //   return;
  // }
  upload_add(data);
}
function read_add() {
  const form = document.getElementById('form_add');
  let data = {};
  for (let i = 0; i < form.length - 2; i++) {
    let id = form.elements[i].id;
    let name = form.elements[i].value;
    data[id] = name;
  }
  return data;
}
async function validate_add(data) {
  let regex_username = new RegExp(/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/gm);
  let regex_name = new RegExp(/^\b(?!.*?\s{2})[A-Za-z ]{4,50}\b$/gm);
  let regex_email = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/gm);
  let regex_phone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  let regex_handicap = new RegExp(/^[0-9][0-9]?$|^100$/gm);
  let regex_password = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/gm);

  let fails = ``;

  if (!regex_username.test(data.username)) {
    fails = fails + `\nUsername Must Be Between 8-20 Characters\nAnd Cannot Contain Special Characters\n`;
    document.getElementById('username').value = ``;
    data.username = null;
  } else {
    let res = await axios.post('/api/admin/user_get_username', { username: data.username }).catch((err) => alert(err));
    if (res.data.details.length > 0) {
      fails = fails + `\nUsername Taken\n`;
      document.getElementById('username').value = ``;
      data.username = null;
    }
  }

  if (!regex_name.test(data.name)) {
    fails = fails + `\nName Must Be Letters, One Space Between Words And Less Than 50 Characters\n`;
    document.getElementById('name').value = ``;
    data.name = null;
  } else {
    data.name = data.name.toNonAlpha(true).toProperCase();
    let res = await axios.post('/api/admin/user_get_name', { name: data.name }).catch((err) => alert(err));
    if (res.data.details.length > 0) {
      fails = fails + `\nName Taken\n`;
      document.getElementById('name').value = ``;
      data.name = null;
    }
  }

  if (!regex_email.test(data.email)) {
    fails = fails + `\nValid Email Required\n`;
    document.getElementById('email').value = ``;
    data.email = null;
  } else {
    data.email = data.email.toLowerCase();
    let res = await axios.post('/api/admin/user_get_email', { email: data.email }).catch((err) => alert(err));
    if (res.data.details.length > 0) {
      fails = fails + `\nEmail Taken\n`;
      document.getElementById('email').value = ``;
      data.email = null;
    }
  }

  if (!regex_phone.test(data.phone)) {
    fails = fails + `\n10 Digit Phone Number Required\n`;
    data.phone = null;
  } else {
    data.phone = data.phone.replace(regex_phone, `($1) $2-$3`);
  }

  if (!regex_handicap.test(data.handicap)) {
    fails = fails + `\nHandicap Between 0-54 Required\n`;
    data.handicap = null;
  }

  if (!regex_password.test(data.password)) {
    fails = fails + `\nValid Password: Minimum 8 Characters In Length\nAndMust Contain\n1 Uppercase, 1 Lowercase, 1 Number And 1 Special Character\n`;
    document.getElementById('password').value = ``;
    document.getElementById('password2').value = ``;
    data.password = null;
  }

  if (data.password != data.password2) {
    fails = fails + `\nPasswords Must Match\n`;
    document.getElementById('password').value = ``;
    document.getElementById('password2').value = ``;
    data.password = null;
    data.password2 = null;
  }

  return fails;
}
async function upload_add(data) {
  try {
    let res = await axios.post('/api/admin/user_add', data);
    if (res.data.details[0].message) {
      throw res.data.details[0].message;
    } else {
      alert(`${res.data.details[0].name} Has Been Added`);
      document.getElementById('form_add').reset();
    }
  } catch (err) {
    alert(err);
  }
}

document.addEventListener('DOMContentLoaded', (ev) => {
  document.getElementById('btnSubmit').addEventListener('click', form_add);

  document.getElementById('btnClear').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.getElementById('form_add').reset();
  });
});
