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

//On Load
function tournament_name_load_select() {
  let dropDown = document.getElementById('tournament_name');
  let length = dropDown.options.length;
  for (let i = length - 1; i >= 0; i--) {
    dropDown.options[i] = null;
  }

  dropDown.innerHTML = `<option value="" disabled selected hidden>Select Tournament</option>`;
  let api = { str: '/api/play/tournament_list', data: { view: true } };
  let title = 'tournament_name';
  createList(api, dropDown, title);
}

//Select
async function tournament_name_change_select() {
  let data = read_add();
  if (!data.tournament_name) {
    return;
  }
  let str = data.tournament_name.split(`,`);
  let send_data = {};
  send_data.tournament_name = str[0];
  send_data.tournament_date = str[1];

  tournament_get(send_data);
}
async function tournament_get(data) {
  axios
    .post('/api/play/tournament_get_name', data)
    .then((res) => {
      document.getElementById('course_name').value = res.data.details[0].course_name;
      document.getElementById('tournament_date').value = res.data.details[0].tournament_date;
    })
    .catch((err) => {
      if (err.response) {
        alert(`Unable to retrieve tournament details. Try again later.`);
        document.getElementById('form_add').reset();
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log(err);
      }
    });
}

// Add
async function form_add(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  let data = read_add();
  if (!data.tournament_name) {
    return;
  }
  let str = data.tournament_name.split(`,`);
  let send_data = {};
  send_data.tournament_name = str[0];
  send_data.tournament_date = str[1];
  let fails = await validate_add(send_data);

  if (fails.length > 0) {
    alert(`Problems:\n${fails}`);
    return;
  }

  await upload_add(send_data);
  tournament_name_load_select();
  document.getElementById('form_add').reset();
  if (localStorage.getItem('courses')) {
    localStorage.removeItem('courses');
  }
}
function read_add() {
  const form = document.getElementById('form_add');
  let data = {};
  for (let i = 0; i < form.length - 4; i++) {
    let id = form.elements[i].id;
    let name = form.elements[i].value;
    data[id] = name;
  }
  return data;
}
async function validate_add(data) {
  let fails = ``;

  if (!data.tournament_name || !data.tournament_date) {
    fails = fails + `Select Select A Tournament`;
  }

  return fails;
}
async function upload_add(data) {
  axios
    .post('/api/play/tournament_sign_up', data)
    .then((res) => {
      document.getElementById('form_add').reset();
      tournament_name_load_select();
      alert(`${res.data.details[0].user_name}\nPlaying\n${res.data.details[0].tournament_name}\nOn\n${res.data.details[0].tournament_date}\nAT\n${res.data.details[0].course_name}`);
    })
    .catch((err) => {
      if (err.response) {
        alert(`Unable to sign up at this time. Try again later.`);
        document.getElementById('form_add').reset();
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log(err);
      }
    });
}

document.addEventListener('DOMContentLoaded', (ev) => {
  tournament_name_load_select();

  document.getElementById('btnSubmit').addEventListener('click', form_add);

  document.getElementById('btnClear').addEventListener('click', (ev) => {
    ev.preventDefault();

    document.getElementById('form_add').reset();
  });
  document.getElementById('tournament_name').addEventListener('change', tournament_name_change_select);
});
