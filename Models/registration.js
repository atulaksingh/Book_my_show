const mongoose = require('mongoose');
// import mongoose from 'mongoose';

const regiSchema = new mongoose.Schema({
  username:{
    type:String,
    requred:true,
  },
  useremail:{
    type:String,
    requred:true,
  },
  userpass:{
    type:String,
    requred:true,
  }


})
module.exports = mongoose.model('Book-My-Show',regiSchema);