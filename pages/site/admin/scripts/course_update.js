function createNode(element) {
  return document.createElement(element);
}
function append(parent, e1) {
  return parent.appendChild(e1);
}
function createList(api, parent, title) {
  axios
    .post(api.str, api.data)
    .then((res) => {
      let list = res.data.details;
      list.forEach((elem) => {
        let listItem = elem[title];
        let option = createNode('option');
        option.innerHTML = listItem;
        // option.id = listItem
        append(parent, option);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

function course_name_load_select() {
  let dropDown = document.getElementById('name');
  let length = dropDown.options.length;
  for (let i = length - 1; i >= 0; i--) {
    dropDown.options[i] = null;
  }
  dropDown.innerHTML = `<option value="" disabled selected hidden>Select Course</option>`;
  let api = { str: '/api/admin/course_view', data: { view: true } };
  let title = 'name';
  createList(api, dropDown, title);
}

async function course_name_selected() {
  try {
    let data = read_update_name();
    let res = await axios.post('/api/admin/course_get_name', { name: data.name });

    if (res.data.details.length === 0) {
      alert(`Invalid User`);
    } else if (res.data.details.length > 0) {
      document.getElementById('phone').value = res.data.details[0].phone;
      document.getElementById('email').value = res.data.details[0].email;
      document.getElementById('rating_course').value = res.data.details[0].rating_course;
      document.getElementById('rating_slope').value = res.data.details[0].rating_slope;
    }
  } catch (err) {
    alert(err);
  }
}
function read_update_name() {
  const form = document.getElementById('form_update');
  let data = {};
  for (let i = 0; i < form.length - 6; i++) {
    let id = form.elements[i].id;
    let name = form.elements[i].value;
    data[id] = name;
  }
  return data;
}
async function form_update(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  let data = read_update();

  let fails = await validate_update(data);

  if (fails.length > 0) {
    alert(`Problems:\n${fails}`);
    return;
  }
  console.log(data);
  let response = await upload_update(data);
  alert(response);
  document.getElementById('form_update').reset();
}
function read_update() {
  const form = document.getElementById('form_update');
  let data = {};
  for (let i = 0; i < form.length - 2; i++) {
    let id = form.elements[i].id;
    let name = form.elements[i].value;
    data[id] = name;
  }
  return data;
}
async function upload_update(data) {
  try {
    let res = await axios.post('/api/admin/course_update_name', data);
    if (res.data.details[0].message) {
      throw res.data.details[0].message;
    } else {
      return `${res.data.details[0].name} Has Been Updated`;
    }
  } catch (err) {
    return err;
  }
}

async function validate_update(data) {
  let regex_phone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  let regex_email = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/gm);
  let regex_rating = /^\d{0,3}(\.\d{1,2})?$/;

  let fails = ``;

  if (!regex_phone.test(data.phone)) {
    fails = fails + `\n10 Digit Phone Number Required\n`;
    data.phone = null;
  } else {
    data.phone = data.phone.replace(regex_phone, `($1) $2-$3`);
  }

  if (!regex_email.test(data.email)) {
    fails = fails + `\nValid Email Required\n`;
    document.getElementById('email').value = ``;
    data.email = null;
  } else {
    data.email = data.email.toLowerCase();
    let res = await axios.post('/api/admin/course_get_email', { email: data.email }).catch((err) => alert(err));
    if (res.data.details.length > 0) {
      if (data.name != res.data.details[0].name) {
        fails = fails + `\nEmail Taken\n`;
        document.getElementById('email').value = ``;
        data.email = null;
      }
    }
  }

  if (!regex_rating.test(data.rating_course) || data.rating_course === ``) {
    fails = fails + `\nCourse Rating: 0-999.99\n`;
    document.getElementById('rating_course').value = ``;
    data.rating_course = null;
  }

  if (!regex_rating.test(data.rating_slope) || data.rating_slope === ``) {
    fails = fails + `\nCourse Slope: 0-999.99\n`;
    document.getElementById('rating_slope').value = ``;
    data.rating_slope = null;
  }

  return fails;
}

document.addEventListener('DOMContentLoaded', (ev) => {
  course_name_load_select();

  document.getElementById('name').addEventListener('change', course_name_selected);
  document.getElementById('btnSubmit').addEventListener('click', form_update);

  document.getElementById('btnClear').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.getElementById('form_update').reset();
  });
});
