let tbl_view;
function user_view() {
  axios
    .post('/api/admin/user_view', { view: true })
    .then((res) => {
      // console.log('statusCode: ', res.status);
      // console.log('headers: ', res.headers);
      let tableData = res.data.details;
      tbl_view = new Tabulator('#user_view_table', {
        printHeader: '<h1>Tournaments<h1>',
        resizableColumns: false,
        selectable: false,
        height: '100%',
        layout: 'fitDataFill',
        data: tableData,
        columns: [
          { title: 'Name', field: 'name', hozAlign: 'center', frozen: true },
          { title: 'Phone', field: 'phone', hozAlign: 'center' },
          { title: 'Email', field: 'email', hozAlign: 'center' },
          { title: 'Access', field: 'permissions', hozAlign: 'center' },
          { title: 'Handicap', field: 'handicap', hozAlign: 'center' },
          { title: 'Start Date', field: 'created_at', hozAlign: 'center' },
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
  user_view();

  document.getElementById('xlsx_table').addEventListener('click', () => {
    tbl_view.download('xlsx', 'users.xlsx', {
      sheetName: 'users',
    });
  });
  document.getElementById('print_table').addEventListener('click', () => {
    tbl_view.print(false, true);
  });
});
