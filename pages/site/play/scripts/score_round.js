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
  let api = { str: '/api/play/round_list' };
  createList(api, dropDown);
}

// On Select
function selected() {
  let elem = document.getElementById('name');
  let round_id = elem.options[elem.selectedIndex].id;
  let tournament_id = elem.options[elem.selectedIndex].value;

  if (tournament_id > 0) {
    let api = '/api/play/tournament_get_id';
    let data = { api: api, data: { tournament_id: tournament_id } };
    selected_tournament(data);
  } else if (round_id > 0) {
    let api = '/api/play/round_get_id';
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
    .post('/api/play/round_get_id', data)
    .then((res) => {
      let tableData = res.data.details;
      tbl_score = new Tabulator('#round_score_table', {
        printHeader: '<h1>Courses<h1>',
        resizableColumns: false,
        selectable: false,
        height: '100%',
        layout: 'fitDataFill',
        data: tableData,
        columns: [
          { title: 'Course', field: 'course_name', hozAlign: 'center', frozen: true },
          { title: 'Hole', field: 'hole_number', hozAlign: 'center' },
          { title: 'Strokes', field: 'strokes', editor: 'number', hozAlign: 'center' },
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
    .post('/api/play/tournament_get_id', data)
    .then((res) => {
      let tableData = res.data.details;
      tbl_score = new Tabulator('#round_score_table', {
        printHeader: '<h1>Courses<h1>',
        resizableColumns: false,
        selectable: false,
        height: '100%',
        layout: 'fitDataFill',
        data: tableData,
        columns: [
          { title: 'Course', field: 'course_name', hozAlign: 'center', frozen: true },
          { title: 'Hole', field: 'hole_number', hozAlign: 'center' },
          { title: 'Strokes', field: 'strokes', editor: 'number', hozAlign: 'center' },
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

// Upload round data
async function round_score_upload(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  let table_data = tbl_score.getData();
  let send_data = await shape_data(table_data);
  upload_score(send_data);
}
function shape_data(data) {
  let string_value = ``;
  data.forEach((elem) => {
    let course_id = `${elem.course_id}`;
    course_id = course_id.toNonAlpha(false).cutLeadingZeros();
    if (course_id === ``) {
      course_id = 0;
    }

    let player_id = `${elem.player_id}`;
    player_id = player_id.toNonAlpha(false).cutLeadingZeros();
    if (player_id === ``) {
      player_id = 0;
    }

    let hole_id = `${elem.hole_id}`;
    hole_id = hole_id.toNonAlpha(false).cutLeadingZeros();
    if (hole_id === ``) {
      hole_id = 0;
    }

    let tournament_id = `${elem.tournament_id}`;
    if (tournament_id == 0) {
      tournament_id = null;
    }

    let round_id = `${elem.round_id}`;
    if (round_id == 0) {
      round_id = null;
    }

    let strokes = `${elem.strokes}`;
    strokes = strokes.toNonAlpha(false).cutLeadingZeros();
    if (strokes === ``) {
      strokes = 0;
    }

    let handicap = `${elem.handicap}`;
    handicap = handicap.toNonAlpha(false).cutLeadingZeros();
    if (handicap === ``) {
      handicap = 0;
    }

    let string_elem = `(${course_id},${player_id},${hole_id},${tournament_id},${round_id},${strokes},${handicap}),`;
    string_value = string_value + string_elem;
  });
  string_value = string_value.slice(0, -1);
  return { values: string_value };
}
async function upload_score(data) {
  axios
    .post('/api/play/score_upload', data)
    .then((res) => {
      alert(`${res.data.details[0].count} holes played at ${res.data.details[0].name}`);
      round_name_load_select();
      document.getElementById('round_score_div').style.display = 'none';
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
  round_name_load_select();

  document.getElementById('btnSubmit').addEventListener('click', round_name_selected);
  document.getElementById('name').addEventListener('change', selected);
  document.getElementById('round_score_upload').addEventListener('click', round_score_upload);

  document.getElementById('btnClear').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.getElementById('round_score_div').style.display = 'none';
    document.getElementById('form_view').reset();
  });
});
