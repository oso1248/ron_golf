// On Load
let tbl_view;
function tournament_view() {
  axios
    .post('/api/me/played_list')
    .then((res) => {
      let tableData = res.data.details;
      tbl_view = new Tabulator('#view_table', {
        printHeader: '<h1>Played Rounds<h1>',
        resizableColumns: false,
        selectable: false,
        height: '100%',
        layout: 'fitDataFill',
        data: tableData,
        columns: [
          { title: 'Date', field: 'round_date', hozAlign: 'center', frozen: true },
          { title: 'Name', field: 'round_name', hozAlign: 'center' },
          { title: 'Course', field: 'course_name', hozAlign: 'center' },
          { title: 'Holes', field: 'hole_count', hozAlign: 'center' },
          { title: 'Distance', field: 'course_distance', hozAlign: 'center' },
          { title: 'Rating', field: 'rating_course', hozAlign: 'center' },
          { title: 'Handicap', field: 'course_handicap', hozAlign: 'center' },
          { title: 'Par', field: 'course_par', hozAlign: 'center' },
          { title: 'Strokes', field: 'strokes_up', hozAlign: 'center' },
          { title: 'Adjusted', field: 'strokes_adjusted', hozAlign: 'center' },
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

document.addEventListener('DOMContentLoaded', (ev) => {
  tournament_view();

  document.getElementById('xlsx_table').addEventListener('click', () => {
    tbl_view.download('xlsx', 'played.xlsx', {
      sheetName: 'played rounds',
    });
  });
  document.getElementById('print_table').addEventListener('click', () => {
    tbl_view.print(false, true);
  });
});
