const express = require("express");
const app = express();
const ejs = require("ejs");
const path = require("path");
const bodyparser = require("body-parser");
const axios = require("axios");
// const mongoose = require(mongoose);

const dbcon = require("./dbcon/dbcon");
const regschema = require("./Models/registration");
const moviesuploadtable = require("./Models/uploadmovie");
const theaterdata = require("./Models/theaterdata");
const ticketbookdata = require("./Models/booked_movie");
const multer = require("multer");
// const url = require("url");
const jshonwebtoken = require("jsonwebtoken");
const tokenkey = "hgdjhsbdbkjfjbhdyuwagdubxbczvccgbjhcbszcnvc";
const querystring = require("query-string");
const port = process.env.PORT || 4000;
const viewspath = path.join(__dirname, "/Views");
const jsonParser = bodyparser.json();
const cookiespar = require("cookie-parser");
const { homeaccess, checkNotAuthenticated } = require("./Controllers/auth");

const { response } = require("express");
const { default: mongoose } = require("mongoose");
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(cookiespar());
app.use(express.json());
app.set("view cache", false);
app.use("/serverimg", express.static(__dirname + "/serverimg"));
app.use("/components", express.static(__dirname + "/components"));

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  // console.log(req.originalUrl);
  next();
});
// ***************************************mulster start*******************************
const filestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "serverimg"));
  },
  filename: (req, file, cb) => {
    // console.log(file);
    cb(null, file.originalname);
  },
});
const movieimgupload = multer({ storage: filestorage });
// console.log(movieimgupload.storage);
// ***************************************mulster end*******************************

app.use(jsonParser);

// app.use(checkNotAuthenticated);

// console.log()

app.get("/", checkNotAuthenticated, (req, res) => {
  res.render("login", {
    formsubmit: null,
    redirectToLogin: false,
    loginerr: null,
  });
});

app.post("/signup", checkNotAuthenticated, async (req, res) => {
  try {
    username = req.body.username;
    useremail = req.body.userEmail;
    userpass = req.body.password;
    const reguser = regschema({
      username,
      useremail,
      userpass,
    });
    reguser.save();
    res.render("login", {
      formsubmit: "registration success",
      redirectToLogin: true,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/", jsonParser, checkNotAuthenticated, async (req, res) => {
  try {
    loginuseremail = req.body.userEmail;
    loginuserpass = req.body.password;
    // console.log(loginuseremail + " " + loginuserpass);
    let newuser = await regschema.findOne({ useremail: loginuseremail });
    // console.log("newuser" + newuser.userpass);
    if (loginuserpass === newuser.userpass) {
      const newusertoken = jshonwebtoken.sign({ id: newuser._id }, tokenkey);
      // console.log("token is" + newusertoken);
      res.cookie("bookmyshowtoken", newusertoken, {
        httpOnly: true,
        expires: new Date(Date.now() + 86400 * 1000),
      });
      return res.redirect("/homepage");
    } else {
      res.render("login", {
        redirectToLogin: true,
        loginerr: "please enter a valid emailid and password",
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.use(homeaccess);

app.get("/homepage", (req, res) => {
  moviesuploadtable.find({}, (err, result) => {
    // console.log(result);
    if (!err) {
      res.render("Home_Page", {
        data: result || [],
        loginsuccessful: null,
      });
    } else {
      res.render("login", { error: "server error" });
    }
  });
});

app.get("/Movies_name/:id", (req, res) => {
  let reqid = req.params.id;
  // console.log("hello" + "   " + reqid);
  moviesuploadtable.findOne({ _id: reqid }, (err, result) => {
    // console.log("this is result"+result);
    if (!err) {
      res.render("Movies_name", {
        reqmoviedata: result || [],
      });
    } else {
      res.render("login", { reqmoviedata: [], error: "server error" });
    }
  });
  // res.render("Movies_name");
});

app.get("/bookticket", (req, res) => {
  res.render("bookticket", {
    bookdate: null,
    booklang: null,
    bookani: null,
    theaterdata: null,
  });
});

app.post("/bookticket", async (req, res) => {
  var date = req.body.movie_booking_date;
  let lang = req.body.language;
  let ani = req.body.animaton;
  let movieid = req.body.movieid;
  let moviename = req.body.moviename;
  let name = req.body.selectSeats;
  // console.log("this is the res " + response);
  // console.log(req.body.BookDate);
  // console.log(req.body.MovieName);

  theaterdata.find({ movie_name: moviename }, (err, result) => {
    // console.log({ result });
    if (!err) {
      res.render("bookticket", {
        bookdate: date,
        booklang: lang,
        bookani: ani,
        theaterdata: result || [],
      });
    }
  });
  // try {
  //   console.log("hellooo" + req.body);
  // } catch (err) {
  //   console.log(err);
  // }
});
app.get("/adminloginpage/", (req, res) => {
  res.render("adminlogin");
});
app.get("/adminuploadmovie/", (req, res) => {
  res.render("adminuploadmovie");
});

app.post(
  "/adminuploadmovie/",
  movieimgupload.single("movieimage"),
  async (req, res) => {
    try {
      const movie_img = "/serverimg/" + (req.file && req.file.originalname);
      const movie_genre = req.body.prefer;
      const movie_name = req.body.moviename;
      const movie_animation = req.body.movanimation;
      const movie_language = req.body.movlanguage;
      const movie_hour = req.body.movhour;
      const movie_types = req.body.movtype;
      const movie_coun_name = req.body.movcountime;
      const movie_date = req.body.movdate;
      const Movie_about = req.body.movabout;

      // console.log(Movie_about);

      const moviesupload = moviesuploadtable({
        movie_img,
        movie_name,
        movie_genre,
        movie_animation,
        movie_language,
        movie_types,
        movie_hour,
        movie_types,
        movie_coun_name,
        movie_date,
        Movie_about,
      });
      moviesupload.save();
      res.render("Movies_name");
    } catch (err) {
      console.log(err);
    }
  }
);
app.get("/userprofile", (req, res) => {
  // console.log(req.user);
  const requsername = req.user.username;
  const requseremail = req.user.useremail;
  const reqbookID = req.user._id;
  // console.log(requsername);
  // console.log(useremail);
  // console.log("thisssssssssssssssssssssssssss", reqbookID);
  ticketbookdata.find(
    {
      reqbookID: reqbookID,
    },
    (err, result) => {
      // console.log(result);
      if (!err) {
        res.render("userProfile", {
          UserBookData: result,
          UserName: requsername,
          UserEmail: requseremail,
        });
      }
    }
  );
});

app.post("/userprofile", async (req, res) => {
  const reqbookID = req.user._id;
  // console.log("thisssssssssssssssssssssssssss", reqbookID);
  // const newId = req.body.selectseat;
  const getid = req.body.theaterId;
  var id = mongoose.Types.ObjectId(getid);
  // console.log(req.user);

  // console.log(id);
  try {
    theaterdata.find({ _id: id }, (err, result) => {
      // console.log(JSON.stringify(req.body));
      const theatername = result[0].name;
      const theateraddress = result[0].address;
      const movie_name = result[0].movie_name;
      const movieBookDate = req.body.BookDate;
      const movie_Animation = req.body.Animation;
      const movie_Language = req.body.MovieLanguage;
      const movie_Seats = req.body.selectseat;
      const movie_timing = req.body.selectTime;
      const reqbookID = req.user._id;

      const bookingdata = ticketbookdata({
        theatername,
        theateraddress,
        movie_name,
        movieBookDate,
        movieBookDate,
        movie_Animation,
        movie_Language,
        movie_Language,
        movie_Seats,
        movie_timing,
        reqbookID,
      });
      bookingdata.save();
      res.render("userProfile");

      // console.log(theatername);
      // console.log(theateraddress);
      // console.log(movie_name);
      // console.log(movieBookDate);
      // console.log(movie_Animation);
      // console.log(movie_Language);
      // console.log(movie_Seats);
      // console.log(movie_timing);
    });
  } catch (err) {
    console.log(err);
  }
  // console.log(newId);
});
app.get("/logout", async (req, res) => {
  try {
    res.clearCookie("bookmyshowtoken");

    console.log("logout");

    return res.redirect("/?refresh=true");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`server as running at port no ${port}`);
});
