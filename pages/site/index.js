let DateTime = luxon.DateTime;
String.prototype.toNonAlpha = function (spaces) {
  if (spaces === true) {
    return this.replace(/[^\w\s]/gi, '').replace(/ +(?= )/g, '');
  } else {
    return this.replace(/[^0-9a-z]/gi, '');
  }
};
let weather = {
  thunderstormwithlightrain: `THUNDER_SHOWERS_DAY`,
  thunderstormwithrain: `THUNDER_RAIN`,
  thunderstormwithheavyrain: `THUNDER_RAIN`,
  lightthunderstorm: `THUNDER`,
  thunderstorm: `THUNDER`,
  heavythunderstorm: `THUNDER`,
  raggedthunderstorm: `THUNDER`,
  thunderstormwithlightdrizzle: `THUNDER_RAIN`,
  thunderstormwithdrizzle: `THUNDER_RAIN`,
  thunderstormwithheavydrizzle: `THUNDER_RAIN`,
  lightintensitydrizzle: `THUNDER_SHOWERS_DAY`,
  drizzle: `THUNDER_SHOWERS_DAY`,
  heavyintensitydrizzle: `THUNDER_SHOWERS_DAY`,
  lightintensitydrizzlerain: `THUNDER_SHOWERS_DAY`,
  drizzlerain: `RAIN`,
  heavyintensitydrizzlerain: `RAIN`,
  showerrainanddrizzle: `RAIN`,
  heavyshowerrainanddrizzle: `RAIN`,
  showerdrizzle: `RAIN`,
  lightrain: `SHOWERS_DAY`,
  moderaterain: `SHOWERS_DAY`,
  heavyintensityrain: `RAIN`,
  veryheavyrain: `RAIN`,
  extremerain: `RAIN`,
  freezingrain: `HAIL`,
  lightintensityshowerrain: `SHOWERS_DAY`,
  showerrain: `SHOWERS_DAY`,
  heavyintensityshowerrain: `RAIN`,
  raggedshowerrain: `RAIN`,
  lightsnow: `SNOW_SHOWERS_DAY`,
  Snow: `SNOW_SHOWERS_DAY`,
  Heavysnow: `SNOW`,
  Sleet: `SLEET`,
  Lightshowersleet: `SLEET`,
  Showersleet: `SLEET`,
  Lightrainandsnow: `RAIN_SNOW`,
  Rainandsnow: `RAIN_SNOW`,
  Lightshowersnow: `RAIN_SNOW`,
  Showersnow: `SNOW`,
  Heavyshowersnow: `SNOW`,
  clearsky: `CLEAR_DAY`,
  fewclouds: `PARTLY_CLOUDY_DAY`,
  scatteredclouds: `PARTLY_CLOUDY_DAY`,
  brokenclouds: `CLOUDY`,
  overcastclouds: `CLOUDY`,
  mist: `FOG`,
  Smoke: `FOG`,
  Haze: `FOG`,
  sanddustwhirls: `FOG`,
  fog: `FOG`,
  sand: `FOG`,
  dust: `FOG`,
  volcanicash: `FOG`,
  squalls: `FOG`,
  tornado: `FOG`,
};
async function get_next_up() {
  await axios
    .post('/api/home/course_next_weather')
    .then((res) => {
      setLocalWithExpiry(`courses`, res.data.details, 480);
      load_widgets();
      return res;
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

async function load_widgets() {
  let { courses } = getLocalWithExpiry(`courses`);
  for (let i = 0; i < courses.length; i++) {
    widget(courses, i);
  }
  view(courses);
}
function widget(courses, index) {
  let rdt = courses[index].round_date.split('-');
  rdt = rdt.map(Number);
  let end = DateTime.local(rdt[2], rdt[0], rdt[1]).startOf('day');
  let start = DateTime.local().startOf('day');
  let weather_index = end.diff(start, 'days');
  weather_index = weather_index.values.days;

  document.getElementsByClassName('round_date')[index].textContent = courses[index].round_date;
  document.getElementsByClassName('status_weather')[index].textContent = courses[index].weather[weather_index].weather[0].description;
  document.getElementsByClassName('round_name')[index].textContent = courses[index].round_name;
  document.getElementsByClassName('course_name')[index].textContent = courses[index].course_name;

  document.getElementsByClassName('temp_morning_value')[index].innerHTML = `${courses[index].weather[weather_index].temp.morn}<span>&#8457;</span>`;
  document.getElementsByClassName('temp_day_value')[index].innerHTML = `${courses[index].weather[weather_index].temp.day}<span>&#8457;</span>`;
  document.getElementsByClassName('temp_evening_value')[index].innerHTML = `${courses[index].weather[weather_index].temp.eve}<span>&#8457;</span>`;
  document.getElementsByClassName('wind_speed_value')[index].textContent = courses[index].weather[weather_index].wind_speed;
  document.getElementsByClassName('wind_gust_value')[index].textContent = courses[index].weather[weather_index].wind_gust;
  document.getElementsByClassName('uvi_value')[index].textContent = courses[index].weather[weather_index].uvi;

  icons(courses[index], index, weather_index);
}
function icons(course, index, weather_index) {
  let weather_icon = course.weather[weather_index].weather[0].description.toNonAlpha(false).toLowerCase();
  let skycons = new Skycons({ monochrome: false });

  if (course.weather[weather_index].wind_speed > 15) {
    skycons.add(`icon${index}`, Skycons.WIND);
  }
  skycons.add(`icon${index}${index}`, Skycons[weather[weather_icon]]);

  skycons.play();
}
function view(courses) {
  for (let i = 0; i < courses.length; i++) {
    document.getElementsByClassName('widget')[i].style.display = 'grid';
  }
}

document.addEventListener('DOMContentLoaded', async (ev) => {
  if (!getLocalWithExpiry(`courses`)) {
    get_next_up();
    // console.log(`from download`);
  } else if (getLocalWithExpiry(`courses`)) {
    load_widgets();
    // console.log('from local');
  }
});
