// On Load
let tbl_view;
function tournament_view() {
  axios
    .post('/api/admin/tournament_view', { view: true })
    .then((res) => {
      let tableData = res.data.details;
      tbl_view = new Tabulator('#view_table', {
        printHeader: '<h1>Tournaments<h1>',
        resizableColumns: false,
        selectable: 1,
        height: '100%',
        layout: 'fitDataFill',
        data: tableData,
        columns: [
          { title: 'Date', field: 'tournament_date', hozAlign: 'center', frozen: true },
          { title: 'Name', field: 'tournament_name', hozAlign: 'center' },
          { title: 'Course', field: 'course_name', hozAlign: 'center' },
          { title: 'Holes', field: 'holes', hozAlign: 'center' },
          { title: 'Par', field: 'par', hozAlign: 'center' },
          { title: 'Distance', field: 'distance', hozAlign: 'center' },
          { title: 'Rating', field: 'rating_course', hozAlign: 'center' },
        ],
      });
    })
    .catch((err) => {
      if (err.response) {
        alert(err.response);
      } else if (err.request) {
        alert(err.request);
      } else {
        alert(err);
      }
    });
}

// Delete
async function tournament_delete(ev) {
  ev.preventDefault();
  ev.stopPropagation();

  let selected_data = tbl_view.getSelectedData();

  if (selected_data.length === 0) {
    return;
  }

  let delete_tournament = confirm(
    `Deleting a tournament removes all associated data from the database\nIncluding:\n\nIts Profile\nAll Rounds Played\n\nDeleting A Tournament Cannot Be Undone\n\nARE YOU SURE YOU WANT TO DELETE\n${selected_data[0].tournament_name}\nFROM THE DATABASE?`
  );
  if (!delete_tournament) {
    alert(`${selected_data[0].tournament_name} Not Deleted`);
    return;
  } else if (delete_tournament) {
    upload_delete(selected_data[0]);
  }
}
async function upload_delete(data) {
  axios
    .post('/api/admin/tournament_delete_name', { id: data.id })
    .then((res) => {
      tournament_view();
      alert(`${res.data.details[0].tournament_name} Has Been Deleted`);
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
  tournament_view();

  document.getElementById('btnDelete').addEventListener('click', tournament_delete);
});
