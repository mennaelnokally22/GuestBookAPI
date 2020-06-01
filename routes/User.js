const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');
const { check, query, validationResult } = require('express-validator');

const CustomError = require('../helpers/customError');
const asyncRouterWrapper = require('../helpers/helper');
const checkValidationErrors = require('../helpers/checkValidation');
const authUser = require('../middlewares/auth');

//Add new user
router.post(
  '/register',
  asyncRouterWrapper(async (req, res, next) => {
    const user = new User(req.body);
    const regUser = await user.save();
    res.status(200).send({ message: 'Registered Succ', user: regUser });
  })
);

//verify user and get token
router.post(
  '/login',
  [check('email').exists().isEmail(), check('password').exists()],
  checkValidationErrors,
  asyncRouterWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email, password);
    const result = await User.findOne({ email });
    console.log(result);
    if (result != null) {
      const user = new User(result);
      const isMatched = await user.checkPassword(password);
      if (isMatched) {
        const token = await user.generateToken();
        res.send({ token, user });
        console.log(token);
      } else {
        const errors = validationResult(req);
        const error = new CustomError('Validation Error', 401, errors.mapped());
        next(error);
      }
    } else {
      const error = new CustomError('Not registered', 401);
      next(error);
    }
  })
);

module.exports = router;
