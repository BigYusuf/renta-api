const jwt = require('jsonwebtoken');
//const {check}
const generateToken = (user, expiry) => {
  return jwt.sign(
    {
      id: user.user_id,
      fist_name: user.first_name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: expiry ? expiry : '1d',
    }
  );
};
//const {check}
const generateVerificationToken = (user, expiry) => {
  return jwt.sign(
    {
      id: user.user_id,
      fist_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: expiry ? expiry : '1d',
    }
  );
};

const generatePwdResToken = (user) => {
  return jwt.sign(
    {
      id: user.user_id,
      fist_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      date: Date.now(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '15m',
    }
  );
};
//validate from cookie
const isAuth = async(req, res, next) => {

  const token = req.cookies['access-token'];

  if (token) {
     
      const validateToken = jwt.decode(token, process.env.JWT_SECRET) 
      // console.log(validateToken)
       const expiredToken=Date.now() >= validateToken.exp * 1000;
       if (expiredToken) {
          res.status(400).clearCookie('access-token').send({ message: 'Token Expired, You need to Login' });
      }
      else if (!expiredToken && validateToken) {
          req.user = validateToken;
          next();
      } else {
          res.status(403).send({ message: 'Invalid Token' });
      }
  } else {
      res.status(401).send({ message: 'No Token, you need to Login' });
  }
};
  
const isAdmin = (req, res, next) => {
  if (req.user && req.user.is_admin) {
      next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};
const isVendor = (req, res, next) => {
  if (req.user && req.user.is_vendor) {
      next();
  } else {
    res.status(401).send({ message: 'Invalid Vendor Token' });
  }
};


module.exports= { generatePwdResToken, generateVerificationToken, generateToken, isAuth, isAdmin, isVendor};