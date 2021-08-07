let DateTime = luxon.DateTime;

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function par() {
  const now = DateTime.local();
  let res = [];
  for (let i = 0; i < 60; i++) {
    res.push({ handicap_date: now.minus({ month: i }).toFormat('MM-yyyy'), handicap: randomIntFromInterval(12, 16) });
  }

  let labels = [];
  let data = [];
  for (let i = 59; i >= 0; i--) {
    labels.push(res[i].handicap_date);
    data.push(res[i].handicap);
  }
  chart_handicap(labels, data);
}
function chart_handicap(labels, data) {
  let ctx = document.getElementById('me_handicap').getContext('2d');
  let myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Handicap',
          data: data,
          backgroundColor: ['rgba(54, 162, 235, 0.2)'],
          borderColor: ['rgba(54, 162, 235, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function round() {
  const now = DateTime.local();
  let res = [];
  for (let i = 0; i < 60; i++) {
    res.push({ handicap_date: now.minus({ month: i }).toFormat('MM-yyyy'), handicap: randomIntFromInterval(0, 9) });
  }

  let labels = [];
  let data = [];
  for (let i = 59; i >= 0; i--) {
    labels.push(res[i].handicap_date);
    data.push(res[i].handicap);
  }
  chart_round(labels, data);
}
function chart_round(labels, data) {
  let ctx = document.getElementById('me_round').getContext('2d');
  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Rounds',
          data: data,
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function distance() {
  const now = DateTime.local();
  let res = [];
  for (let i = 0; i < 60; i++) {
    res.push({ handicap_date: now.minus({ month: i }).toFormat('MM-yyyy'), handicap: randomIntFromInterval(3000, 16000) });
  }

  let labels = [];
  let data = [];
  for (let i = 59; i >= 0; i--) {
    labels.push(res[i].handicap_date);
    data.push(res[i].handicap);
  }
  chart_distance(labels, data);
}
function chart_distance(labels, data) {
  let ctx = document.getElementById('me_distance').getContext('2d');
  let myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Yards',
          data: data,
          backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
          borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

document.addEventListener('DOMContentLoaded', (ev) => {
  par();
  round();
  distance();
});
