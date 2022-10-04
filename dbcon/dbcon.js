const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost:27017/BookMyShow",{

}).then(()=>{
  console.log("connection succesfull");
}).catch((err)=>{
console.log("no connection")
})