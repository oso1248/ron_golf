let tbl_view;
function course_view() {
  axios
    .post('/api/admin/course_view', { view: true })
    .then((res) => {
      let tableData = res.data.details;
      tbl_view = new Tabulator('#view_table', {
        printHeader: '<h1>Courses<h1>',
        resizableColumns: false,
        selectable: false,
        height: '100%',
        layout: 'fitDataFill',
        data: tableData,
        columns: [
          { title: 'Name', field: 'name', hozAlign: 'center', frozen: true },
          { title: 'Address', field: 'address', hozAlign: 'center' },
          { title: 'Phone', field: 'phone', hozAlign: 'center' },
          { title: 'Email', field: 'email', hozAlign: 'center' },
          { title: 'Holes', field: 'hole_count', hozAlign: 'center' },
          { title: 'Par', field: 'par', hozAlign: 'center' },
          { title: 'Length', field: 'distance', hozAlign: 'center' },
          { title: 'Difficulty', field: 'rating_course', hozAlign: 'center' },
          { title: 'Slope', field: 'rating_slope', hozAlign: 'center' },
          { title: 'Added Date', field: 'created_at', hozAlign: 'center' },
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
  course_view();

  document.getElementById('xlsx_table').addEventListener('click', () => {
    tbl_view.download('xlsx', 'courses.xlsx', {
      sheetName: 'courses',
    });
  });
  document.getElementById('print_table').addEventListener('click', () => {
    tbl_view.print(false, true);
  });
});
