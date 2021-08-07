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

// Add
async function form_add() {
  let data = await read_add();
  let fails = await validate_add(data);
  if (fails.length > 0) {
    alert(`Problems:\n ${fails}`);
    return;
  }

  upload_add(data);
}
function read_add() {
  const form = document.getElementById('form_add');
  let data = {};
  for (let i = 0; i < form.length - 2; i++) {
    let id = form.elements[i].id;
    let name = form.elements[i].value;
    data[id] = name;
  }
  return data;
}
async function validate_add(data) {
  let regex_name = /^[0-9A-Za-z ]{1,100}$/;
  let regex_phone = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  let regex_email = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/gm);
  let regex_rating = /^\d{0,3}(\.\d{1,2})?$/;
  let regex_hole_count = /9|18|27/;
  let regex_address = new RegExp(/^[A-Za-z0-9 ]{1,120}$/gm);

  let fails = ``;

  if (!regex_name.test(data.name)) {
    fails = fails + `\nName Must Be Only Letters, Spaces And Less Than 100 Characters\n`;
    document.getElementById('name').value = ``;
    data.name = null;
  } else {
    data.name = data.name.toNonAlpha(true).toProperCase();
    let res = await axios.post('/api/admin/course_get_name', { name: data.name }).catch((err) => alert(err));
    if (res.data.details.length > 0) {
      fails = fails + `\nName Taken\n`;
      document.getElementById('name').value = ``;
      data.name = null;
    }
  }

  if (!regex_phone.test(data.phone)) {
    fails = fails + `\n10 Digit Phone Number Required\n`;
    data.phone = null;
  } else {
    data.phone = data.phone.replace(regex_phone, `($1) $2-$3`);
  }

  if (data.email) {
    if (!regex_email.test(data.email)) {
      fails = fails + `\nEmail Not In Valid Form\n`;
      document.getElementById('email').value = ``;
      data.email = null;
    } else {
      data.email = data.email.toLowerCase();
    }
  } else {
    data.email = ``;
  }

  if (!regex_rating.test(data.rating_course) || data.rating_course === ``) {
    fails = fails + `\nCourse Rating: 0-999.99\n`;
    document.getElementById('rating_course').value = ``;
    data.rating_course = null;
  }

  if (!regex_rating.test(data.rating_slope) || data.rating_slope === ``) {
    fails = fails + `\nCourse Slope: 0-999.99\n`;
    document.getElementById('rating_slope').value = ``;
    data.rating_slope = null;
  }

  if (!regex_hole_count.test(data.hole_count)) {
    fails = fails + `\nNumber Of Hole: 9, 18, 27\n`;
    document.getElementById('hole_count').value = ``;
    data.hole_count = null;
  }

  if (!regex_address.test(data.address)) {
    fails = fails + `\nAddress:Numbers, Letters, Spaces & Less Than 100 Characters\n`;
    data.address = null;
  } else {
    data.address = data.address.toNonAlpha(true).toProperCase();
  }

  return fails;
}
async function upload_add(data) {
  axios
    .post('/api/admin/course_add', data)
    .then((res) => {
      alert(`${res.data.details[0].name} Has Been Added`);
      document.getElementById('form_add').reset();
    })
    .catch((err) => {
      if (err.response) {
        console.log(err.response);
        alert(err.response.data.details[0].message);
      } else if (err.request) {
        console.log(err.request);
        alert(`Request Error`);
      } else {
        console.log(err);
        alert(`Failure`);
      }
    });
}

document.addEventListener('DOMContentLoaded', (ev) => {
  ev.preventDefault();
  ev.stopPropagation();

  document.getElementById('btnSubmit').addEventListener('click', (ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    form_add();
  });

  document.getElementById('btnClear').addEventListener('click', (ev) => {
    ev.preventDefault();
    document.getElementById('form_add').reset();
  });
});
