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
function createList(api, parent) {
  axios
    .post(api.str)
    .then((res) => {
      let list = res.data.details;
      list.forEach((elem) => {
        let option = createNode('option');
        option.innerHTML = `${elem.round_name},${elem.round_date}`;
        option.id = elem.round_id;
        option.value = elem.tournament_id;
        append(parent, option);
      });
    })
    .catch((err) => {
      console.error(err);
    });
}

// On Load
function round_name_load_select() {
  let dropDown = document.getElementById('name');
  let length = dropDown.options.length;
  for (let i = length - 1; i >= 0; i--) {
    dropDown.options[i] = null;
  }
  dropDown.innerHTML = `<option value="" disabled selected hidden>Select Round</option>`;
  let api = { str: '/api/me/details_round_list' };
  createList(api, dropDown);
}

// On Select
function selected() {
  let elem = document.getElementById('name');
  let round_id = elem.options[elem.selectedIndex].id;
  let tournament_id = elem.options[elem.selectedIndex].value;

  if (tournament_id > 0) {
    let api = '/api/me/details_tournament_id';
    let data = { api: api, data: { tournament_id: tournament_id } };
    selected_tournament(data);
  } else if (round_id > 0) {
    let api = '/api/me/details_round_id';
    let data = { api: api, data: { round_id: round_id } };
    selected_round(data);
  }
}
async function selected_tournament(data) {
  axios
    .post(data.api, data.data)
    .then((res) => {
      document.getElementById('course_id').value = `${res.data.details[0].course_name}`;
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
async function selected_round(data) {
  axios
    .post(data.api, data.data)
    .then((res) => {
      document.getElementById('course_id').value = `${res.data.details[0].course_name}`;
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

// Get Round
let tbl_score;
async function round_name_selected(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  let elem = document.getElementById('name');
  let round_id = elem.options[elem.selectedIndex].id;
  let tournament_id = elem.options[elem.selectedIndex].value;

  if (tournament_id > 0) {
    let data = { tournament_id: tournament_id };
    get_tournament(data);
    document.getElementById('round_score_div').style.display = 'block';
  } else if (round_id > 0) {
    let data = { round_id: round_id };
    get_round(data);
    document.getElementById('round_score_div').style.display = 'block';
  }
}
async function get_round(data) {
  axios
    .post('/api/me/details_round_id', data)
    .then((res) => {
      let tableData = res.data.details;

      let counter = 0;
      for (let i = 0; i < tableData[0].course_handicap; i++) {
        tableData[counter].strokes_adjusted = tableData[counter].strokes_adjusted - 1;
        if (counter === tableData.length - 1) {
          counter = 0;
        } else {
          counter++;
        }
      }
      tableData.sort((a, b) => (a.hole_number > b.hole_number ? 1 : b.hole_number > a.hole_number ? -1 : 0));

      tbl_score = new Tabulator('#round_score_table', {
        printHeader: '<h1>Round Details<h1>',
        resizableColumns: false,
        selectable: false,
        height: '100%',
        layout: 'fitDataFill',
        data: tableData,
        columns: [
          { title: 'Date', field: 'round_date', hozAlign: 'center', frozen: true },
          { title: 'Name', field: 'round_name', hozAlign: 'center' },
          { title: 'Course', field: 'course_name', hozAlign: 'center' },
          { title: 'Hole', field: 'hole_number', hozAlign: 'center' },
          { title: 'Par', field: 'hole_par', hozAlign: 'center' },
          { title: 'Strokes', field: 'strokes_up', hozAlign: 'center' },
          { title: 'Adjusted', field: 'strokes_adjusted', hozAlign: 'center' },
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
async function get_tournament(data) {
  axios
    .post('/api/me/details_tournament_id', data)
    .then((res) => {
      let tableData = res.data.details;

      let counter = 0;
      for (let i = 0; i < tableData[0].course_handicap; i++) {
        tableData[counter].strokes_adjusted = tableData[counter].strokes_adjusted - 1;
        if (counter === tableData.length - 1) {
          counter = 0;
        } else {
          counter++;
        }
      }
      tableData.sort((a, b) => (a.hole_number > b.hole_number ? 1 : b.hole_number > a.hole_number ? -1 : 0));

      tbl_score = new Tabulator('#round_score_table', {
        printHeader: '<h1>Round Details<h1>',
        resizableColumns: false,
        selectable: false,
        height: '100%',
        layout: 'fitDataFill',
        data: tableData,
        columns: [
          { title: 'Date', field: 'round_date', hozAlign: 'center', frozen: true },
          { title: 'Name', field: 'round_name', hozAlign: 'center' },
          { title: 'Course', field: 'course_name', hozAlign: 'center' },
          { title: 'Hole', field: 'hole_number', hozAlign: 'center' },
          { title: 'Par', field: 'hole_par', hozAlign: 'center' },
          { title: 'Strokes', field: 'strokes_up', hozAlign: 'center' },
          { title: 'Adjusted', field: 'strokes_adjusted', hozAlign: 'center' },
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

document.addEventListener('DOMContentLoaded', (ev) => {
  round_name_load_select();

  document.getElementById('btnSubmit').addEventListener('click', round_name_selected);
  document.getElementById('name').addEventListener('change', selected);

  document.getElementById('btnClear').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.getElementById('round_score_div').style.display = 'none';
    document.getElementById('form_view').reset();
  });

  document.getElementById('xlsx_table').addEventListener('click', () => {
    tbl_score.download('xlsx', 'round_details.xlsx', {
      sheetName: 'round details',
    });
  });
  document.getElementById('print_table').addEventListener('click', () => {
    tbl_score.print(false, true);
  });
});
