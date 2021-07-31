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

// On Load
function user_name_load_select() {
  let dropDown = document.getElementById('name');
  let length = dropDown.options.length;
  for (let i = length - 1; i >= 0; i--) {
    dropDown.options[i] = null;
  }
  dropDown.innerHTML = `<option value="" disabled selected hidden>Select User</option>`;
  let api = { str: '/api/admin/user_view', data: { view: true } };
  let title = 'name';
  createList(api, dropDown, title);
}

// On Select
async function user_name_selected() {
  let data = read_delete();
  axios
    .post('/api/admin/user_get_name', { name: data.name })
    .then((res) => {
      document.getElementById('phone').value = res.data.details[0].phone;
      document.getElementById('email').value = res.data.details[0].email;
    })
    .catch((err) => {
      document.getElementById('form_delete').reset();
      if (err.response) {
        console.log(err.response);
        alert(err.response.data.details[0].message);
      } else if (err.request) {
        console.log(err.request);
        alert(`Request Error`);
      } else {
        console.log(err);
        alert(`Failure`);
      }
    });
}

// Delete
async function form_delete(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  let data = read_delete();
  if (!data.user_name) {
    return;
  }

  let fails = validate_delete(data);
  if (fails.length > 0) {
    alert(`Problems:\n${fails}`);
    return;
  }
  let delete_user = confirm(
    `Deleting a user removes all their data from the database\nIncluding:\n\nTheir User Profile\nAll Rounds Played\nAll Tournaments\n\nDeleting A User Cannot Be Undone\n\nARE YOU SURE YOU WANT TO DELETE\n${data.name}\nFROM THE DATABASE?`
  );
  if (!delete_user) {
    alert(`${data.name} Not Deleted`);
    document.getElementById('form_delete').reset();
    return;
  } else if (delete_user) {
    upload_delete(data);
  }
}
function read_delete() {
  const form = document.getElementById('form_delete');
  let data = {};
  for (let i = 0; i < form.length - 4; i++) {
    let id = form.elements[i].id;
    let name = form.elements[i].value;
    data[id] = name;
  }
  return data;
}
function validate_delete(data) {
  let fails = ``;
  if (data.name === ``) {
    fails = fails + `\nNo Name\n`;
  }
  return fails;
}
async function upload_delete(data) {
  axios
    .post('/api/admin/user_delete_name', data)
    .then((res) => {
      document.getElementById('form_delete').reset();
      user_name_load_select();
      alert(`${res.data.details[0].name} Has Been Deleted`);
    })
    .catch((err) => {
      if (err.response) {
        alert(err.response.data.details[0].message);
      } else if (err.request) {
        alert(`Request Error`);
      } else {
        alert(`Failure`);
      }
    });
}

document.addEventListener('DOMContentLoaded', (ev) => {
  user_name_load_select();

  document.getElementById('name').addEventListener('change', user_name_selected);

  document.getElementById('btnSubmit').addEventListener('click', form_delete);

  document.getElementById('btnClear').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.getElementById('form_delete').reset();
  });
});
