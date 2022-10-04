const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
// import mongoose from "mongoose";
const { Schema } = mongoose;

const bookedData = new mongoose.Schema({
  theatername: {
    type: String,
    requred: true,
  },
  theateraddress: {
    type: String,
    requred: true,
  },

  movie_name: {
    type: String,
    requred: true,
  },
  movieBookDate: {
    type: String,
    requred: true,
  },
  movie_Animation: {
    type: String,
    requred: true,
  },
  movie_Language: {
    type: String,
    requred: true,
  },
  movie_Seats: {
    type: String,
    requred: true,
  },
  reqbookID: {
    type: Schema.Types.ObjectId,
    ref: "book-my-shows",
    required: true,
  },
  movie_timing: {
    type: String,
    requred: true,
  },
});
module.exports = mongoose.model("bookedData", bookedData);
