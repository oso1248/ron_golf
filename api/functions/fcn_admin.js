const bcrypt = require('bcryptjs');

// Users
async function hashPassword(user, saltRounds) {
  user.password = await new Promise((resolve, reject) => {
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });
  return user;
}

module.exports = {
  hashPassword,
};
