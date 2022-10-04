const jwt = require("jsonwebtoken");
const regschema = require("../Models/registration");
const moviesuploadtable = require("../Models/uploadmovie");
const theaterdata = require("../Models/theaterdata");
const tokenkey = "hgdjhsbdbkjfjbhdyuwagdubxbczvccgbjhcbszcnvc";
const cookies = require("cookie-parser");

const homeaccess = async (req, res, next) => {
  // console.log("authmiddleware", req.cookies);
  try {
    if (!req.cookies.bookmyshowtoken) {
      console.log("no cookie");
      return res.redirect("/");
    } else {
      const token = req.cookies.bookmyshowtoken;
      // console.log("this is the" + token);
      const verifyuser = jwt.verify(token, tokenkey);
      // console.log(verifyuser);
      const LoginUser = await regschema.findOne(
        { _id: verifyuser.id },
        { password: 0, cpassword: 0 }
      );
      // console.log("loginuser" + LoginUser);

      req.user = LoginUser;
      next();
    }
  } catch (err) {
    res.status(401).send(err);
  }
};

function checkNotAuthenticated(req, res, next) {
  if (req.cookies.bookmyshowtoken) {
    return res.redirect("/homepage");
  }
  next();
}

// module.exports = homeaccess;
module.exports = { homeaccess, checkNotAuthenticated };
