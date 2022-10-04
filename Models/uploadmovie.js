const mongoose = require("mongoose");
// import mongoose from 'mongoose';

const moviesupload = new mongoose.Schema({
  movie_name: {
    type: String,
    requred: true,
  },
  movie_img: {
    type: String,
    requred: true,
  },
  movie_genre: {
    type: Array,
    requred: true,
  },
  movie_animation: {
    type: String,
    requred: true,
  },
  movie_language: {
    type: String,
    requred: true,
  },
  movie_hour: {
    type: String,
    requred: true,
  },
  movie_types: {
    type: String,
    requred: true,
  },
  movie_coun_name: {
    type: String,
    requred: true,
  },
  movie_date: {
    type: Date,
    requred: true,
  },
  Movie_about:{
    type:String,
    requred:true,
  }
});
module.exports = mongoose.model("movie-upload", moviesupload);
