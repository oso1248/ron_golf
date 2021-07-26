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
    let data = read_delete();
    let res = await axios.post('/api/admin/course_get_name', { name: data.name });

    if (res.data.details.length === 0) {
      alert(`Invalid Course`);
    } else if (res.data.details.length > 0) {
      document.getElementById('phone').value = res.data.details[0].phone;
      document.getElementById('email').value = res.data.details[0].email;
    }
  } catch (err) {
    alert(err);
  }
}

async function form_delete(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  let data = read_delete();
  let fails = validate_delete(data);
  if (fails.length > 0) {
    alert(`Problems:\n${fails}`);
    return;
  }
  let delete_course = confirm(
    `Deleting a Course removes all its data from the database\nIncluding:\n\nIts Profile\nAll Rounds Played At Course\nAll Tournaments At Course\n\nDeleting A Courser Cannot Be Undone\n\nARE YOU SURE YOU WANT TO DELETE\n${data.name}\nFROM THE DATABASE?`
  );
  if (!delete_course) {
    alert(`${data.name} Not Deleted`);
    document.getElementById('form_delete').reset();
    return;
  } else if (delete_course) {
    let response = await upload_delete(data);
    alert(response);
    document.getElementById('form_delete').reset();
    course_name_load_select();
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
  try {
    let res = await axios.post('/api/admin/course_delete_name', data);
    if (res.data.details[0].message) {
      throw res.data.details[0].message;
    } else {
      return `${res.data.details[0].name} Has Been Deleted`;
    }
  } catch (err) {
    return err;
  }
}

document.addEventListener('DOMContentLoaded', (ev) => {
  course_name_load_select();

  document.getElementById('name').addEventListener('change', course_name_selected);

  document.getElementById('btnSubmit').addEventListener('click', form_delete);

  document.getElementById('btnClear').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.getElementById('form_delete').reset();
  });
});
