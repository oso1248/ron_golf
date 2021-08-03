let DateTime = luxon.DateTime;

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
function createListData(data, parent, title) {
  data.forEach((elem) => {
    let listItem = elem[title];
    let option = createNode('option');
    option.innerHTML = listItem;
    // option.id = listItem
    append(parent, option);
  });
}

// On Load
function dates_load_select() {
  let dropDown = document.getElementById('round_date');
  let length = dropDown.options.length;
  for (let i = length - 1; i >= 0; i--) {
    dropDown.options[i] = null;
  }

  let data = [];
  const now = DateTime.local();
  for (let i = 0; i < 14; i++) {
    data.push({ tournament_date: now.plus({ day: i }).toFormat('MM-dd-yyyy') });
  }

  dropDown.innerHTML = `<option value="" disabled selected hidden>Select Date</option>`;
  let title = 'tournament_date';
  createListData(data, dropDown, title);
}
function course_name_load_select() {
  let dropDown = document.getElementById('course_name');
  let length = dropDown.options.length;
  for (let i = length - 1; i >= 0; i--) {
    dropDown.options[i] = null;
  }
  dropDown.innerHTML = `<option value="" disabled selected hidden>Select Course</option>`;
  let api = { str: '/api/course/course_view', data: { view: true } };
  let title = 'name';
  createList(api, dropDown, title);
}

// Add
async function form_add(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  let data = read_add();

  let fails = await validate_add(data);

  if (fails.length > 0) {
    alert(`Problems:\n${fails}`);
    return;
  }
  let response = await upload_add(data);
  alert(response);
  document.getElementById('form_add').reset();
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
  let fails = ``;

  if (!data.course_name || !data.round_date) {
    fails = fails + `Select Both A Date And A Course`;
  }

  return fails;
}
async function upload_add(data) {
  try {
    let res = await axios.post('/api/play/round_add', data);
    if (res.data.details[0].message) {
      throw res.data.details[0].message;
    } else {
      return `Playing:\n\n${res.data.details[0].course_name} On ${res.data.details[0].round_date}`;
    }
  } catch (err) {
    return err;
  }
}

document.addEventListener('DOMContentLoaded', (ev) => {
  course_name_load_select();
  dates_load_select();

  document.getElementById('btnSubmit').addEventListener('click', form_add);

  document.getElementById('btnClear').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.getElementById('form_add').reset();
  });
});
