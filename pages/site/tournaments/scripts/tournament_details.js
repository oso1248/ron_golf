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
function createList(api, parent) {
  axios
    .post(api.str, api.data)
    .then((res) => {
      let list = res.data.details;
      list.forEach((elem) => {
        let option = createNode('option');
        option.innerHTML = `${elem.tournament_name},${elem.tournament_date}`;
        option.value = elem.tournament_id;
        append(parent, option);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

//On Load
function tournament_name_load_select() {
  let dropDown = document.getElementById('tournament_id');
  let length = dropDown.options.length;
  for (let i = length - 1; i >= 0; i--) {
    dropDown.options[i] = null;
  }
  dropDown.innerHTML = `<option value="" disabled selected hidden>Select Tournament</option>`;
  let api = { str: '/api/tournament/tournament_list', data: { view: true } };
  createList(api, dropDown);
}

//Select
async function tournament_name_change_select() {
  let data = read_get();
  if (!data.tournament_id) {
    return;
  }

  tournament_get(data);
}
async function tournament_get(data) {
  axios
    .post('/api/tournament/tournament_get_id', data)
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
async function form_get(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  let data = read_get();
  if (!data.tournament_id) {
    return;
  }

  let fails = await validate_get(data);

  if (fails.length > 0) {
    alert(`Problems:\n${fails}`);
    return;
  }
  await get_tournament(data);
  document.getElementById('tournament_score_div').style.display = 'block';
}
function read_get() {
  const form = document.getElementById('form_add');
  let data = {};
  for (let i = 0; i < form.length - 4; i++) {
    let id = form.elements[i].id;
    let name = form.elements[i].value;
    data[id] = name;
  }
  return data;
}
async function validate_get(data) {
  let fails = ``;

  if (!data.tournament_id) {
    fails = fails + `Select Select A Tournament`;
  }

  return fails;
}
let tournament_view;
async function get_tournament(data) {
  axios
    .post('/api/tournament/tournament_details_get_id', data)
    .then((res) => prep_data(res.data.details))
    .then((result) => {
      tournament_view = new Tabulator('#tournament_score_table', {
        printHeader: '<h1>Round Details<h1>',
        resizableColumns: false,
        selectable: false,
        height: '100%',
        layout: 'fitDataFill',
        data: result,
        columns: [
          { title: 'Name', field: 'user_name', hozAlign: 'center', frozen: true },
          { title: 'Hole 1', field: 'hole_1', hozAlign: 'center' },
          { title: 'Hole 2', field: 'hole_2', hozAlign: 'center' },
          { title: 'Hole 3', field: 'hole_3', hozAlign: 'center' },
          { title: 'Hole 4', field: 'hole_4', hozAlign: 'center' },
          { title: 'Hole 5', field: 'hole_5', hozAlign: 'center' },
          { title: 'Hole 6', field: 'hole_6', hozAlign: 'center' },
          { title: 'Hole 7', field: 'hole_7', hozAlign: 'center' },
          { title: 'Hole 8', field: 'hole_8', hozAlign: 'center' },
          { title: 'Hole 9', field: 'hole_9', hozAlign: 'center' },
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

async function prep_data(data) {
  let tableData = [];
  for (let c = 0; c < data.length; c += data[0].hole_count) {
    let player = [];
    for (let i = 0; i < data[0].hole_count; i++) {
      player.push(data[c + i]);
    }
    player = await adjust_strokes(player);
    player = await transpose_data(player);
    tableData.push(player);
  }
  return tableData;
}

async function adjust_strokes(data) {
  let counter = 0;
  for (let i = 0; i < data[0].course_handicap; i++) {
    data[counter].strokes_adjusted = data[counter].strokes_adjusted - 1;
    if (counter === data.length - 1) {
      counter = 0;
    } else {
      counter++;
    }
  }
  data.sort((a, b) => (a.hole_number > b.hole_number ? 1 : b.hole_number > a.hole_number ? -1 : 0));
  return data;
}
async function transpose_data(data) {
  let td = {};
  td.user_name = data[0].user_name;
  for (let i = 0; i < data.length; i++) {
    td[`hole_${i + 1}`] = data[i].strokes_adjusted;
  }
  return td;
}

document.addEventListener('DOMContentLoaded', (ev) => {
  tournament_name_load_select();

  document.getElementById('btnSubmit').addEventListener('click', form_get);

  document.getElementById('btnClear').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.getElementById('form_add').reset();
    document.getElementById('tournament_score_div').style.display = 'none';
  });
  document.getElementById('tournament_id').addEventListener('change', tournament_name_change_select);

  document.getElementById('xlsx_table').addEventListener('click', () => {
    tournament_view.download('xlsx', 'tournament.xlsx', {
      sheetName: 'tournament',
    });
  });
  document.getElementById('print_table').addEventListener('click', () => {
    tournament_view.print(false, true);
  });
});
