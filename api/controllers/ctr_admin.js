const db = require('../queries/qry_admin');
const bcrypt = require('bcryptjs');
const validate = require('../validations/val_admin');

// Users
exports.user_view = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.user_view.validateAsync(req.body);
    let response = await db.user_view();
    res.status(resStatus).json({ details: response });
  } catch (err) {
    resStatus = 500;
    res.status(resStatus).json(err);
  }
};
exports.user_add = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.user_add.validateAsync(req.body);
    result.password = bcrypt.hashSync(result.password, 6);
    let response = await db.user_add(result);
    res.status(resStatus).json({ details: response });
  } catch (err) {
    if (!err.details[0].message) {
      resStatus = 400;
    }
    res.status(resStatus).json(err);
  }
};
exports.user_get_username = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.user_get_username.validateAsync(req.body);
    let response = await db.user_get_username(result);
    res.status(resStatus).json({ details: response });
  } catch (err) {
    if (!err.details[0].message) {
      resStatus = 400;
    }
    res.status(resStatus).json(err);
  }
};
exports.user_get_email = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.user_get_email.validateAsync(req.body);
    let response = await db.user_get_email(result);
    res.status(resStatus).json({ details: response });
  } catch (err) {
    if (!err.details[0].message) {
      resStatus = 400;
    }
    res.status(resStatus).json(err);
  }
};
exports.user_get_name = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.user_get_name.validateAsync(req.body);
    let response = await db.user_get_name(result);
    res.status(resStatus).json({ details: response });
  } catch (err) {
    if (!err.details[0].message) {
      resStatus = 400;
    }
    res.status(resStatus).json(err);
  }
};
exports.user_update_name = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.user_update_name.validateAsync(req.body);
    let response = await db.user_update_name(result);
    res.status(resStatus).json({ details: response });
  } catch (err) {
    if (!err.details[0].message) {
      resStatus = 400;
    }
    res.status(resStatus).json(err);
  }
};
exports.user_delete_name = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.user_delete_name.validateAsync(req.body);
    let response = await db.user_delete_name(result);
    res.status(resStatus).json({ details: response });
  } catch (err) {
    if (!err.details[0].message) {
      resStatus = 400;
    }
    res.status(resStatus).json(err);
  }
};

// Courses
exports.course_view = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.course_view.validateAsync(req.body);
    let response = await db.course_view();
    res.status(resStatus).json({ details: response });
  } catch (err) {
    resStatus = 500;
    res.status(resStatus).json(err);
  }
};
exports.course_add = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.course_add.validateAsync(req.body);
    let response = await db.course_add(result);
    res.status(resStatus).json({ details: response });
  } catch (err) {
    if (!err.details[0].message) {
      resStatus = 400;
    }
    res.status(resStatus).json(err);
  }
};
exports.course_get_email = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.course_get_email.validateAsync(req.body);
    let response = await db.course_get_email(result);
    res.status(resStatus).json({ details: response });
  } catch (err) {
    if (!err.details[0].message) {
      resStatus = 400;
    }
    res.status(resStatus).json(err);
  }
};
exports.course_get_name = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.course_get_name.validateAsync(req.body);
    let response = await db.course_get_name(result);
    res.status(resStatus).json({ details: response });
  } catch (err) {
    if (!err.details[0].message) {
      resStatus = 400;
    }
    res.status(resStatus).json(err);
  }
};
exports.course_update_name = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.course_update_name.validateAsync(req.body);
    let response = await db.course_update_name(result);
    res.status(resStatus).json({ details: response });
  } catch (err) {
    if (!err.details[0].message) {
      resStatus = 400;
    }
    res.status(resStatus).json(err);
  }
};
exports.course_delete_name = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.course_delete_name.validateAsync(req.body);
    let response = await db.course_delete_name(result);
    res.status(resStatus).json({ details: response });
  } catch (err) {
    if (!err.details[0].message) {
      resStatus = 400;
    }
    res.status(resStatus).json(err);
  }
};

// Holes
exports.hole_get_name = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.hole_get_name.validateAsync(req.body);
    let response = await db.hole_get_name(result);
    res.status(resStatus).json({ details: response });
  } catch (err) {
    resStatus = 500;
    res.status(resStatus).json(err);
  }
};
exports.hole_update_name = async function (req, res, next) {
  let resStatus = 200;
  try {
    let result = await validate.hole_update_name.validateAsync(req.body);
    let response = await db.hole_update_name(result);
    res.status(resStatus).json({ details: response });
  } catch (err) {
    if (!err.details[0].message) {
      resStatus = 400;
    }
    res.status(resStatus).json(err);
  }
};
