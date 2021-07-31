const ApiError = require('./ApiError');

function api_error_handler(err, req, res, next) {
  if (err instanceof ApiError) {
    res.status(err.code).json({ details: [{ message: `${err.message}` }] });
    return;
  }
  res.status(err.code).json({ details: [{ message: `Something Went Wrong.` }] });
}

module.exports = api_error_handler;
