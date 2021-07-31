String.prototype.toNonAlpha = function (spaces) {
  if (spaces === true) {
    return this.replace(/[^\w\s]/gi, '').replace(/ +(?= )/g, '');
  } else {
    return this.replace(/[^0-9a-z]/gi, '');
  }
};
String.prototype.cutLeadingZeros = function () {
  return this.replace(/\D|^0+/g, '');
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

// On Load
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

// On Select
let tbl_update;
async function course_name_selected(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  let data = read_view();
  if (!data.name) {
    return;
  }
  document.getElementById('hole_update_div').style.display = 'block';
  axios
    .post('/api/admin/hole_get_name', data)
    .then((res) => {
      let tableData = res.data.details;
      tbl_update = new Tabulator('#hole_update_table', {
        printHeader: '<h1>Courses<h1>',
        resizableColumns: false,
        selectable: false,
        height: '100%',
        layout: 'fitDataFill',
        data: tableData,
        columns: [
          { title: 'Course', field: 'name', hozAlign: 'center', frozen: true },
          { title: 'Hole', field: 'hole_number', hozAlign: 'center' },
          { title: 'Par', field: 'hole_par', editor: 'number', hozAlign: 'center' },
          { title: 'DIstance', field: 'hole_distance', editor: 'number', hozAlign: 'center' },
          { title: 'Handicap', field: 'hole_handicap', editor: 'number', hozAlign: 'center' },
        ],
      });
    })
    .catch((err) => {
      if (err.response) {
        alert(err.response.details[0].message);
        console.log(err.response);
      } else if (err.request) {
        alert('Request Fail');
        console.log(err.request);
      } else {
        alert('Fail');
        console.log(err);
      }
    });
}
function read_view() {
  const form = document.getElementById('form_view');
  let data = {};
  for (let i = 0; i < form.length - 2; i++) {
    let id = form.elements[i].id;
    let name = form.elements[i].value;
    data[id] = name;
  }
  return data;
}

// Upload hole data
async function hole_update(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  let table_data = tbl_update.getData();
  let send_data = await shape_data(table_data);

  upload_hole(send_data);
}
function shape_data(data) {
  let string_value = ``;
  data.forEach((elem) => {
    let par = `${elem.hole_par}`;
    par = par.toNonAlpha(false).cutLeadingZeros();
    if (par === ``) {
      par = 0;
    }
    let distance = `${elem.hole_distance}`;
    distance = distance.toNonAlpha(false).cutLeadingZeros();
    if (distance === ``) {
      distance = 0;
    }
    let handicap = `${elem.hole_handicap}`;
    handicap = handicap.toNonAlpha(false).cutLeadingZeros();
    if (handicap === ``) {
      handicap = 0;
    }
    let string_elem = `(${elem.hole_id}, ${par}, ${distance},${handicap}),`;
    string_value = string_value + string_elem;
  });
  string_value = string_value.slice(0, -1);
  return { values: string_value };
}
async function upload_hole(data) {
  axios
    .post('/api/admin/hole_update_name', data)
    .then((res) => {
      alert(`${res.data.details[0].count} Rows Have Been Updated`);
      document.getElementById('hole_update_div').style.display = 'none';
      document.getElementById('form_view').reset();
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

// Hold
function parse_data(return_data) {
  return_data.forEach((row) => {
    for (key in row) {
      let str = `${row[key]}`;
      str = str.toNonAlpha(false).cutLeadingZeros();
      row.key = str;
    }
  });
  return return_data;
}

document.addEventListener('DOMContentLoaded', (ev) => {
  course_name_load_select();

  document.getElementById('btnSubmit').addEventListener('click', course_name_selected);

  document.getElementById('hole_update_name').addEventListener('click', hole_update);

  document.getElementById('btnClear').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.getElementById('hole_update_div').style.display = 'none';
    document.getElementById('form_view').reset();
  });
});
