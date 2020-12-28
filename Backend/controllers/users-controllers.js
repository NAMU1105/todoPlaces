// const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
// const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-errors");
const User = require("../models/user");
// const Place = require("../models/place");

const HOUR = 60;

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later",
      500
    );
    return next(error);
  }

  if (!users || users.length === 0) {
    return next(new HttpError("Could not find any user.", 404));
  }

  res.json({
    users: users.map((user) => user.toObject({ getters: true })),
  });
};

// ******************************************************************************
// signup
// ******************************************************************************
const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(`errors: `, errors.errors);

    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);

    const error = new HttpError(
      "Signing up failed!!!, please try again later.",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please login instead!!!",
      422
    );
    return next(error);
  }
  let hashedPassword;
  // try {
  //   const salt = bcrypt.genSaltSync(10);
  //   hashedPassword = bcrypt.hashSync(password, salt);
  //   console.log(`hashedPassword: `, hashedPassword);
  // } catch (error) {
  //   const error = new HttpError(
  //     "Signing up failed!!!, please try again later.",
  //     500
  //   );
  //   return next(error);
  // }
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    // image: "https://live.staticflickr.com/7631/26849088292_36fc52ee90_b.jpg",
    image: req.file.path,
    places: [],
  });

  //   DUMMY_USERS.push(createdUser);
  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    // console.log(err);
    return next(error);
  }

  // Issue JsonWebToken
  let token;
  try {
    token = await jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "secret",
      { expiresIn: "1h" }
    );
    console.log(`token:`, token);
  } catch (err) {
    const error = new HttpError("Signing up failed, please try again.", 500);
    return next(error);
  }

  // res.status(201).json({ user: createdUser.toObject({ getters: true }) });
  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
  });
};

// ******************************************************************************
// login
// ******************************************************************************
const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    // if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  // Load hash from your password DB.
  let hashCompare;
  // const hashCompare = bcrypt.compareSync(password, existingUser.password); // true

  try {
    hashCompare = await bcrypt.compare(password, existingUser.password); // true
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  console.log(`hashCompare: `, hashCompare);

  if (!hashCompare) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(error);
  }

  // Issue JsonWebToken
  let token;
  try {
    token = await jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "secret",
      { expiresIn: "1h" }
    );
    console.log(`token: `, token);
  } catch (err) {
    console.log(err);

    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  // res.json({
  //   message: "Logged in!",
  //   user: existingUser.toObject({ getters: true }),
  // });
  // const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 10);
  const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * HOUR);
  console.log(`tokenExpirationDate:`, tokenExpirationDate);

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    expirationDate: tokenExpirationDate,
  });
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;
