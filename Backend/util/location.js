// 입력한 주소를 구글맵 api에 띄울 수 있는 지도정보로 변환
const axios = require("axios");

const HttpError = require("../models/http-errors");

const API_KEY = "AIzaSyBUg5GaeCRZVs7KrcOTRnPplvfojXeBUa0";

const getCoordsForAddress = async (address) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
};

module.exports = getCoordsForAddress;
