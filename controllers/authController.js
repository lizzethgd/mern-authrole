const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../schemas/user");
const DBError= require('../utils/DBError')
const _= process.env
const { promisify } = require("util");


const signJwt = (id) => {
    return jwt.sign({ id }, _.JWT_SECRET, {
      expiresIn: _.JWT_EXPIRES
    });
  };

const decryptJwt = async (token) => {
    const jwtVerify = promisify(jwt.verify);
return await jwtVerify(token, _.JWT_SECRET);
}

const sendToken = (user, statusCode, req, res) =>{
    const token = signJwt(user._id)
    const options = {
        expires: new Date(Date.now() + _.JWT_EXPIRATION_NUM),
        secure: _.NODE_ENV === "prodution" ? true : false,
        httpOnly: _.NODE_ENV === "production" ? true : false
      };
    res.cookie("jwt", token, options);
    
    user.password= undefined

    res.status(statusCode).json({
        status: 'succes',
        token,
        user
    })
}

const encryptPw = async (password) => {
    return await bcrypt.hash(password, 12);
  };

exports.signup = async (req, res) =>{
    const {email, password} = req.body
    const pw = await encryptPw(password);
    console.log("SIGNUP!!!!!!!!!!");
    try {
        const newUser = await User.create({
            email, 
            password: pw,
        })
        sendToken(newUser, 201, req, res)
    } catch (err) {
        console.log(err.name)
        let errorHandled = err
        err.name==='MongoError' ? errorHandled = DBError(err) : errorHandled
        res.status(401).json({message: errorHandled.message})
    }
} 

exports.login = async (req, res) => {
    const {email, password} = req.body
    console.log("LOGIN!!!!!!!!!!");
    try {
        const user = await User.findOne({ email }).select("+password");
        const compared = await bcrypt.compare(password, user.password);
        compared
          ? sendToken(user, 200, req, res)
          : res.status(400).json({ message: "Login Failed" });
    } catch (err) {
        console.log(err);
        res.status(400).json({message: err.message});
    }
}

exports.logout = async (req, res) => {
    const options = {
        expires: new Date(Date.now() + 10000),
        secure: _.NODE_ENV === "prodution" ? true : false,
        httpOnly: _.NODE_ENV === "production" ? true : false
      };
    res.cookie('jwt','expiredtoken', options)
    res.status(200).json({status: 'success'})
    console.log("LOGOUT!!!!!!!!!!");
      
}

exports.secretContent = (req, res) => {
    res.status(200).json({ status: "SECRET CONTENT SHOWN!!!" });
    console.log("REQ USER: "+req.user);
  };

// Middelware

  exports.secure = async (req, res, next) => {
    let token;
    if (req.cookies) token = req.cookies.jwt;
    if (!token || token === "expiredtoken") {
      return res.status(401).json({
        status: "unauthorized",
        message: "You are not allowed to view this content",
      });
    }
    const jwtInfo = await decryptJwt(token);
    console.log(jwtInfo);
    const user = await User.findById(jwtInfo.id);
    if (!user) {
      return res.status(401).json({
        status: "unauthorized",
        message: "You are not allowed to view this content",
      });
    }
    req.user = user;
    next();
  };

  exports.clearanceLevel = (...clearanceLevel) => {
    return (req, res, next) => {
      clearanceLevel.includes(req.user.clearance)
        ? next()
        : res.status(401).json({
            status: "unauthorized",
            message: "Content not available at your current clearance level",
          })
    }
  }

  exports.blackList = (...inputs) => {
    return (req, res, next) => {
      const { body } = req;
      console.log(body);
      let bodyProps;
      for (let prop in inputs) {
        bodyProps = inputs[prop];
        if (body[bodyProps]) delete body[bodyProps];
      }
      console.log(req.body);
      next()
    }
  }