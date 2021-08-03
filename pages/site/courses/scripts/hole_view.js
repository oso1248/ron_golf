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
  let api = { str: '/api/course/course_view', data: { view: true } };
  let title = 'name';
  createList(api, dropDown, title);
}

// On Select
let tbl_view;
async function course_name_selected(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  let data = read_view();
  if (!data.name) {
    return;
  }
  document.getElementById('hole_get_div').style.display = 'block';
  axios
    .post('/api/admin/hole_get_name', data)
    .then((res) => {
      let tableData = res.data.details;
      tbl_view = new Tabulator('#user_view_table', {
        printHeader: '<h1>Course<h1>',
        resizableColumns: false,
        selectable: false,
        height: '100%',
        layout: 'fitDataFill',
        data: tableData,
        columns: [
          { title: 'Course', field: 'name', hozAlign: 'center', frozen: true },
          { title: 'Hole', field: 'hole_number', hozAlign: 'center' },
          { title: 'Par', field: 'hole_par', hozAlign: 'center' },
          { title: 'DIstance', field: 'hole_distance', hozAlign: 'center' },
          { title: 'Handicap', field: 'hole_handicap', hozAlign: 'center' },
        ],
      });
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.log(err.request);
      } else {
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

document.addEventListener('DOMContentLoaded', (ev) => {
  course_name_load_select();

  document.getElementById('btnSubmit').addEventListener('click', course_name_selected);

  document.getElementById('xlsx_table').addEventListener('click', () => {
    tbl_view.download('xlsx', 'course.xlsx', {
      sheetName: 'course',
    });
  });
  document.getElementById('print_table').addEventListener('click', () => {
    tbl_view.print(false, true);
  });
  document.getElementById('btnClear').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.getElementById('hole_get_div').style.display = 'none';
    document.getElementById('form_view').reset();
  });
});
