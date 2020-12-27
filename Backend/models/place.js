const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// 2. 몽구스 스키마를 만든다.
const placeSchema = new Schema({
  //   id: {
  //     type: String,
  //     required: true,
  //   },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  //   date: {
  //     type: Date,
  //   },
});

// // 3. 몽구스 모델을 만든다.
// const Item = mongoose.model("Item", itemsSchema);

module.exports = mongoose.model("Place", placeSchema);
