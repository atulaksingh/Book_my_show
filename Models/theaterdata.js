const mongoose = require("mongoose");
// import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    requred: true,
  },
  address: {
    type: String,
    requred: true,
  },
  timing: {
    type: Array,
    requred: true,
  },
  movie_name: {
    type: String,
    requred: true,
  },
});
module.exports = mongoose.model("Theater_data", theaterSchema);
