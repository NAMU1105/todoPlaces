const mongoose = require("mongoose");
const fs = require("fs");

const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-errors");
const getCoordsForAddress = require("../util/location");
const User = require("../models/user");
const Place = require("../models/place");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a place.",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(
      new HttpError("Could not find places for the provided place id.", 404)
    );
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later",
      500
    );
    return next(error);
  }

  // if (!places || places.length === 0) {
  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(
      new HttpError("Could not find places for the provided user id.", 404)
    );
  }

  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

// ******************************************************************************
// createPlace
// ******************************************************************************
const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed!, please try again",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  console.log(user);

  try {
    // 장소를 생성하거나 유저의 장소 정보를 추가하는 두 가지 액션 중에 하나라도 실패한다면,
    // 아무 값도 변경하지 않기 위해 sesstion과 transaction을 쓴다.
    // const db = mongoose.connection;
    // const sess = await db.startSession();
    // sess.transaction();
    // await createdPlace.save();
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    // await createdPlace.save({ session: sess });
    // user.places.push(createdPlace); // 이 단계에서는 places에 id만 push한다.
    // await user.save({ session: sess });
    // await sess.commitTransaction(); // 이 단계에서 db에 저장이 됨

    await createdPlace.save(/* { session: session } */);
    user.places.push(createdPlace);
    await user.save(/* { session: session } */);
  } catch (err) {
    console.log(err);

    const error = new HttpError(
      "Creating place failed, please try again!",
      500
    );
    return next(error);
  }

  // //   DUMMY_PLACES.push(createdPlace); //unshift(createdPlace)
  // Place.insert(createdPlace, (err) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("place 인서트 성공");
  //     }
  //   });

  res.status(201).json({ place: createdPlace });
};

// ******************************************************************************
// updatePlace
// ******************************************************************************
const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  if (place.creator.toString() !== req.userData.userId) {
    const error = new HttpError("You are not allowed to edit this place.", 401);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place.",
      500
    );
    return next(error);
  }

  //   res.status(200).json({ place: updatedPlace });
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// ******************************************************************************
// deletePlace
// ******************************************************************************
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find place for this id.", 404);
    return next(error);
  }

  if (place.creator.id !== req.userData.userId) {
    const error = new HttpError(
      "You are not allowed to delete this place.",
      403
    );
    return next(error);
  }

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    await place.remove(/*{ session: sess }*/);
    place.creator.places.pull(place);
    await place.creator.save(/*{ session: sess }*/);
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  // remove place image from server
  fs.unlink(place.image, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Place deleted." });
};

// exports.getAllPlaces = getAllPlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
