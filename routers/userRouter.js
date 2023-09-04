
const express =require('express');
const { isAuth, isAdmin, generateToken} =require('../utils/utils')
const { register, getUser, getAllUsers, loginUser, logoutUser, updateUser, deleteUser, verifyEmail, forgotPassword, resetPassword, passportUser,
     addAddress, getMyAddress, getAddress, updateAddress } = require('../controllers/userController');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');
const pool = require('../config/database');
const { getUserByIdQuery } = require('../queries/usersQueries');


const googleClientID= process.env.GOOGLE_CLIENT_ID
const googleClientSecret= process.env.GOOGLE_CLIENT_SECRET
const fbClientID= process.env.FB_CLIENT_ID
const fbClientSecret= process.env.FB_CLIENT_SECRET

    passport.use(new GoogleStrategy({
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: "http://localhost:5000/api/users/login/google/callback",
        scope: [ 'profile','email' ],
        state: true
    },
    function(accessToken, refreshToken, profile, cb) {
        passportUser(profile, cb)
    }
    ));
  
    passport.use(new FacebookStrategy({
        clientID: fbClientID,
        clientSecret: fbClientSecret,
        callbackURL: "http://localhost:5000/api/users/login/facebook/callback",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        function(accessToken, refreshToken, profile, cb) {      
            passportUser(profile, cb)
        }
    ));
    
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
       // done(null, user)
       pool.query( getUserByIdQuery, [id], (error, results) => {
        if(error || !results.rows.length){
          done(new Error("Failed to deserialize an user"));
        }else if(results.rows.length){
          const user= results.rows
          user.forEach(object => {
            delete object['password'];
            delete object['is_admin'];
            delete object['is_vendor'];
            delete object['is_social_login'];
          });
             done(null, user);
          };
          pool.end;
      })  
    })
    
  
const userRouter = express.Router();

userRouter.post('/login', loginUser);

userRouter.post('/register', register);

userRouter.get('/:id', getUser);

//userRouter.get('/',isAuth, isAdmin, getAllUsers);
userRouter.get('/',isAuth, getAllUsers);

// verify email
userRouter.put('/verify-email', verifyEmail);

// log user out
userRouter.post('/logout', isAuth, logoutUser);

// forgot password
userRouter.put('/forgot-password', forgotPassword);

// password reset
userRouter.put('/reset-password', resetPassword);

// delete user
//userRouter.delete('/:id', isAuth, isAdmin, deleteUser);
userRouter.delete('/:id', deleteUser);

// update user
userRouter.put('/:id', isAuth, updateUser);

//address
userRouter.post('/:id/address', isAuth, addAddress);
userRouter.get('/:id/address', isAuth, getMyAddress);
userRouter.get('/:id/address/:id2', isAuth, getAddress);
userRouter.put('/:id/address/:id2', isAuth, updateAddress);


// when login is successful, retrieve user info
userRouter.get("/login/success", (req, res) => {
  
  //console.log(req.cookies)
  //console.log(generateToken(req.user))
  const token = generateToken(req.user)
  if (req.user) {
    res.cookie('access-token', token, { httpOnly: true}).send({
      success: true,
      message: "user has successfully authenticated",
      user: req.user
    });
  }
});

// when login failed, send failed msg
userRouter.get("/login/failed", (req, res) => {
  res.status(401).send({
    success: false,
    message: "user failed to authenticate. email already exist"
  });
});

userRouter.get('/login/google', passport.authenticate('google'));

userRouter.get('/login/google/callback', 
  passport.authenticate('google', { failureRedirect: '/api/users/login/failed', successRedirect: '/api/users/login/success'})
);

userRouter.get('/login/facebook', passport.authenticate('facebook'));

userRouter.get('/login/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/api/users/login/failed', successRedirect: '/api/users/login/success'})
);

module.exports = userRouter;