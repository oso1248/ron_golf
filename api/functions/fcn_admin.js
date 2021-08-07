const axios = require('axios');
const bcrypt = require('bcryptjs');

// User
async function hash_password(user, saltRounds) {
  user.password = await new Promise((resolve, reject) => {
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return user;
}

// Course
async function get_coords(course) {
  let address = encodeURIComponent(course.address.trim());
  let API_POSITION = process.env.API_POSITION;
  let coords = await axios.get(`http://api.positionstack.com/v1/forward?access_key=${API_POSITION}&query=${address}`);
  course.latitude = coords.data.data[0].latitude;
  course.longitude = coords.data.data[0].longitude;
  return course;
}

module.exports = {
  hash_password,
  get_coords,
};
