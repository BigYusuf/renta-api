
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const expressAsyncHandler = require('express-async-handler');
const { getAllUsersQuery, getUserByIdQuery, checkUserExistQuery, registerQuery, deleteUserQuery, updateUserQuery, tokenRegQuery, checkEmailTokenQuery, deleteTokenQuery, registerwithSocialQuery, checkUidSocialQuery, registerSocialQuery, checkTokenQuery, updatePwdQuery, checkUserSocialQuery, updateResPwdTokenQuery, updateSocialQuery, updateUserTokenQuery, updateTokenQuery, getAddressByUserIdQuery, addAddressQuery, getAddressByIdQuery, updateAddressByIdQuery, deleteAddressQuery } = require('../queries/usersQueries');
const { generateToken, generateVerificationToken, generatePwdResToken } = require('../utils/utils');
const { sendMail1, sendResetMail } = require('../service/emails');
const jwt = require('jsonwebtoken');
const { generateOTP } = require('../service/generateOTP');

//validateRegister(first_name,last_name,email,password)
let emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
let passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
let passwordRegex2 = new RegExp("^(?=.{8,})");// minimum of 8
let nameRegex = new RegExp(/^[a-zA-Z]*$/);
let nameRegex2 = new RegExp("^(?=.{3,})");//minimum of 3

pool.connect();

exports.getAllUsers = expressAsyncHandler(async (req, res) => {
  await pool.query(getAllUsersQuery, (error, results) => {
    if (!results.rows[0]) {

      res.status(404).send({
        message: "No Users found in the database"
      });
    } else {

      //select basic information
      //not all information
      const allUsers = results.rows
      allUsers.forEach(object => {
        delete object['password'];
        delete object['is_admin'];
        delete object['is_vendor'];
        delete object['is_social_login'];
      })
      if (error) {
        throw error
      } else {
        res.status(200).send({
          message: "All Users loaded successfully",
          users: allUsers
        });
      }
      pool.end;
    }
  });
})

exports.getUser = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const checkId1 = (req.params.id).includes('or');
  const checkId2 = (req.params.id).includes('=');
  const checkId3 = (req.params.id).includes(' ');
  if (checkId1) {
    res.status(400).send({
      message: `Incorrect syntax 'or' used`
    });
  } else if (checkId2) {
    res.status(400).send({
      message: `Incorrect syntax '=' used`
    });
  } else if (checkId3) {
    res.status(400).send({
      message: `Incorrect syntax ' ' used`
    });
  } else if (id) {
    await pool.query(getUserByIdQuery, [id], (error, results) => {
      if (error || !results.rows.length) {
        res.status(404).send({
          message: `User doesn't exist`
        })
      } else if (results.rows.length) {
        const filteredUser = results.rows
        filteredUser.forEach(object => {
          delete object['password'];
          delete object['is_admin'];
          delete object['is_vendor'];
          delete object['is_social_login'];
        });
        res.status(200).send({
          message: `User loaded successfully`,
          user: filteredUser
        });
      };
      pool.end;
    })
  }
})

exports.register = expressAsyncHandler(async (req, res) => {
  const { first_name, last_name, email, password, image } = req.body;
try {
  //validation
  if (!email || !password) return res.status(400).send({message: "Email or password missing."})
  if (!first_name || !last_name) return res.status(400).send({message: "First name or Last name missing."})
  if (nameRegex.test(first_name)===false) return res.status(400).send({message: "First name must be only alphabets."})
  if (nameRegex.test(last_name)===false) return res.status(400).send({message: "Last name must be only alphabets."})
  if (nameRegex2.test(first_name)===false) return res.status(400).send({message: "First name must be 3 characters."})
  if (nameRegex2.test(last_name)===false) return res.status(400).send({message: "Last name must be 3 characters."})
  if (emailRegex.test(email)===false) return res.status(400).send({message: "Email invalid."})
  if (passwordRegex.test(password)===false)return res.status(400).send({ message: "Password must contain at least 1 lowercase, 1 uppercase, 1 numeric and 1 special character."})
  if (passwordRegex2.test(password)===false) return res.status(400).send({ message: "Password must be at least 8 characters or longer"})


  const userExist = await pool.query(checkUserExistQuery, [email])
  if (userExist.rows.length) {
    res.status(404).send({
      message: "The email is already assigned to a user"
    })
  }else{
    const hashPassword = bcrypt.hashSync(password, 8)

    const newUser = await pool.query(registerQuery, 
      [first_name, last_name, email, hashPassword, image])

      const expiry ="1hr"
      const token = generateToken(newUser)
      const verifytoken = generateVerificationToken(newUser, expiry)

      //send verification email
      sendMail1(req, email, first_name, verifytoken).then(result => console.log("Verification Email Sent ", result))
           
      res.status(201).cookie('access-token', token, { httpOnly: true }).send({
        message: "User Registered Successfully",
        user: first_name,
        token: token
      });
  }
} catch (error) {
  res.send({
    message: "Error Occured",
    detail: error.detail
  })
}
   
  
})

exports.loginUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if email is valid
  if (emailRegex.test(req.body.email) === false) return res.status(400).send({ message: "Email invalid, Input a valid Email" })
  try {
     //check if user (email) exist
     const user = await pool.query(checkUserExistQuery, [email]);
     if (user.rows.length === 0) {
       return res.status(401).send({ message: "Invalid Credential" });
     } else {
       const realUser = user.rows[0]
       if (bcrypt.compareSync(password, realUser.password)) {
 
         const token = generateToken(realUser)
         // store token in cookie
         res.status(200).cookie('access-token', token, { httpOnly: true }).send({
           message: "Sign in Successfully",
           first_name: realUser.first_name,
           last_name: realUser.last_name,
           email: realUser.email,
         });
         return;
       } else {
         res.status(401).send({ message: 'Invalid password' });
 
       }
     }
  } catch (error) {
    res.status(500).send({
      message: "Error Occured",
      error: error.detail
    });
  }
   
  
})

exports.passportUser = expressAsyncHandler(async (profile, cb) => {

  const uid = profile.id
  const name = profile.displayName
  const split_name = name.split(' ');
  const provider = profile.provider
  const email = profile.emails[0].value
  const first_name = profile.name.givenName ? profile.name.givenName : split_name[0]
  const last_name = profile.name.familyName ? profile.name.familyName : split_name[1]
  const image = profile.photos[0].value
  const password = uid + email + provider

  await pool.query(checkUserExistQuery, [email], (error, results) => {

    if (!results.rows.length) {
      //register user to db
      pool.query(registerwithSocialQuery,
        [first_name, last_name, email, bcrypt.hashSync(password, 8), image, 0, true, true, true], (error, results) => {
          if (error) throw error;
          pool.query(checkUserExistQuery, [email], (error, results) => {

            const newUser = results.rows[0]
            pool.query(registerSocialQuery, [newUser.user_id, provider, uid, name, email], (err, results) => {
              if (error) throw error;
            })

            pool.query(tokenRegQuery, [newUser.user_id, null, null, null], (err, results) => {

              let user = {
                id: newUser.user_id,
                name: newUser.first_name,
                email: newUser.email
              }
              cb(null, user)
              console.log('user registered');
            })
          })
        })

    } else if (results.rows.length) {
      //sign in
      //check if uid exist then sign in
      pool.query(checkUidSocialQuery, [uid], (err, results) => {
        if (err || !results.rows.length) {
          //if uid doesnt match then send error 
          cb(err)
          //  console.log('This email is already assigned to a user');
        } else if (results.rows.length) {
          //here user exist and ready to sign in
          // console.log('log user in');
          //find user
          let user = {
            id: results.rows[0].user_id,
            name: results.rows[0].social_provider_name
          }
          cb(null, user)
        }
      })
    }
    pool.end;
  })
})

exports.logoutUser = expressAsyncHandler(async (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.clearCookie('access-token').send({ message: 'Signed out successfully' })
    //res.redirect('/');
  });
})

exports.verifyEmail = expressAsyncHandler(async (req, res) => {

  const token = req.query.token
  const user = await pool.query(checkEmailTokenQuery, [token]);
  const validateToken = jwt.decode(token, process.env.JWT_SECRET)
  // console.log(validateToken)
  const expiredToken = Date.now() >= validateToken.exp * 1000;
  if (expiredToken) {
    res.status(401).send({ message: 'Token Expired' });
  }
  else if (user.rows.length === 0) {
    return res.status(401).send({ message: "Invalid Credential" });
  } else {
    const realUser = user.rows[0]
    const todaysDate = new Date()

    pool.query(updateTokenQuery, [null, todaysDate, realUser.token_id], (err, results) => {
      pool.query(updateUserTokenQuery, [true, true, realUser.user_id], (err, results) => {
        res.status(200).send({
          message: "Email has been verified successfully"
        });

        return;
      })
    })

  }
})

exports.forgotPassword = expressAsyncHandler(async (req, res) => {
  try {
  
    const user = await pool.query(checkUserExistQuery, [req.body.email]);

    if (emailRegex.test(req.body.email) === false) {
      return res.status(400).send({ message: "Email invalid, Input a valid Email" })
    } else if (user.rows.length === 0) {
      res.status(404).send({ message: 'User not found' });
    } else {
      const realUser = user.rows[0]
      const token = generateOTP()
     
      if (realUser.social_login === false) {
        let token_type = 2// for password resset
        let token_name = 'PASS_RST'// for password resset
        let token_desc = 'Password Reset'// for password resset
        const time = new Date().toISOString();
        pool.query(tokenRegQuery, [token_type, realUser.id, token, token_name, token_desc, time], (err, results) => {
          if(err)return  res.status(400).send({ message: 'Bad request' })
          sendResetMail( realUser.first_name, realUser.email, token).then(
            result => res.status(200).send({ message: 'Password Reset link has been sent to your Email' }))
        })
      } else {
        res.status(404).send({ message: 'Only users that register using email and password allowed' });
      }
    }  
  } catch (error) {
    res.status(500).send({ message: 'Internal Server Error' });
    console.log(error)
  }

})

exports.resetPassword = expressAsyncHandler(async (req, res) => {

  const { email, password, token } = req.body;
  const User = await pool.query(checkUserExistQuery, [email])
  const newtoken = await pool.query(checkTokenQuery, [token])
  //bad token
  if (!newtoken.rows[0]) return res.status(400).send({ message: 'Invalid token' })
  let difference = Date.now() - new Date(newtoken.rows[0].created_at )
  let resultInMinutes = Math.round(difference / 60000);

  //if time is greater than 15 minutes, send token expired  
  if(resultInMinutes > 15 ) return res.status(401).send({ message: "Token Expired" })
  //confirm the token with the user id
  if(newtoken.rows[0].id !== User.rows[0].id) return res.status(400).send({ message: "Bad request" })
  
  //validate password
  if (!password) {
    res.status(400).send({ message: "Password missing." })
  } else if (passwordRegex.test(password) === false) {
    res.status(400).send({ message: "Password must contain at least 1 lowercase, 1 uppercase, 1 numeric and 1 special character." })
  } else if (passwordRegex2.test(password) === false) {
    res.status(400).send({ message: "Password must be at least 8 characters or longer" })
  }  else {
    //update the password if all conditions are met
    pool.query(updatePwdQuery,
      [bcrypt.hashSync(password, 8), User.rows[0].id], (error, results) => {
        if (error) throw error;
        res.status(200).send({ message: `Password reset successfully` });
    })
  }

})

exports.updateUser = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const checkId1 = (req.params.id).includes('or');
  const checkId2 = (req.params.id).includes('=');
  const checkId3 = (req.params.id).includes(' ');
  if (checkId1) {
    res.status(400).send({
      message: `Incorrect syntax 'or' used`
    });
  } else if (checkId2) {
    res.status(400).send({
      message: `Incorrect syntax '=' used`
    });
  } else if (checkId3) {
    res.status(400).send({
      message: `Incorrect syntax ' ' used`
    });
  } else if (id) {
    await pool.query(getUserByIdQuery, [id], (error, results) => {

      if (error || !results.rows.length) {
        res.status(404).send({
          message: `User doesn't exist`
        })
      } else if (results.rows.length) {
        const Users = results.rows[0];
        pool.query(updateUserQuery,
          [req.body.first_name || Users.first_name, req.body.image || Users.image, req.body.phone || Users.phone,
          req.body.email || Users.email, req.body.last_name || Users.last_name, id], (error, results) => {
            if (error) throw error;
            res.status(200).send({ message: `User updated successfully` });
          })
      }
      pool.end;
    })
  }
})

exports.deleteUser = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    const userExist = await pool.query(getUserByIdQuery, [id])
    if (userExist.rows.length) {
       await pool.query(deleteUserQuery, [id])
        res.status(200).send({ message: `User deleted successfully` });
    }else{
      res.status(404).send({
        message: "This User does not exist"
      })
    }
  } catch (error) {
    if (error) throw error;
    
    /*
    await pool.query(getUserByIdQuery, [id], (error, results) => {
      //const numusers= results.rows.length;
      if (error || !results.rows.length) {
        res.status(404).send({ message: "This User does not exist" })
      }
      else if (results.rows.length) {
        pool.query(deleteTokenQuery, [id], () => {
          pool.query(deleteSocialQuery, [id], () => {
            pool.query(deleteAddressQuery, [id], () => {
              // console.log(err);
              pool.query(deleteUserQuery, [id], (error, results) => {
                if (error) throw error;
                res.status(200).send({ message: `User deleted successfully` });
              })
  
            })
          })
        })
      }
      pool.end;
    })
    */
  }

})

//adress section
//add address
exports.addAddress = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const { address1, address2, address3, address4, address5, address6, address7, address8, address9, address10, postcode, city, suburb, country } = req.body;
  if (!address1) {
    res.status(404).send({ message: "address1 field is empty" })
  } else if (!city) {
    res.status(404).send({ message: "city field is empty" })
  } else if (!suburb) {
    res.status(404).send({ message: "suburb field is empty" })
  } else if (!country) {
    res.status(404).send({ message: "country field is empty" })
  } else {
    await pool.query(getUserByIdQuery, [id], (error, results) => {
      //const numusers= results.rows.length;
      if (error || !results.rows.length) {
        res.status(404).send({ message: "This User does not exist" })
      }
      else if (results.rows.length) {
        pool.query(addAddressQuery, [id, address1, address2, address3, address4, address5, address6, address7, address8, address9, address10, postcode, city, suburb, country], (err, results) => {
          console.log(err);
          if (err) {
            res.status(400).send({ message: "No Address saved" })
          } else {
            res.status(200).send({
              message: `Address saved successfully`
            });
          }
        })
      }
      pool.end;
    })
  }
})

exports.getMyAddress = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  //console.log(id);
  await pool.query(getUserByIdQuery, [id], (error, results) => {
    //const numusers= results.rows.length;
    if (error || !results.rows.length) {
      res.status(404).send({ message: "This User does not exist" })
    }
    else if (results.rows.length) {
      pool.query(getAddressByUserIdQuery, [id], (err, results) => {
        if (err || !results.rows.length) {
          res.status(404).send({ message: "No Address Found" })
        } else if (results.rows.length) {
          res.status(200).send({
            message: `Address loaded successfully`,
            address: results.rows
          });
        }
      })
    }
    pool.end;
  })
})

exports.getAddress = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const id2 = req.params.id2;
  //console.log(req.params);
  //console.log(id);
  await pool.query(getUserByIdQuery, [id], (error, results) => {
    //const numusers= results.rows.length;
    if (error || !results.rows.length) {
      res.status(404).send({ message: "This User does not exist" })
    }
    else if (results.rows.length) {
      pool.query(getAddressByIdQuery, [id2], (err, results) => {
        // console.log(err);
        if (err || !results.rows.length) {
          res.status(404).send({ message: "No Address Found" })
        } else if (results.rows.length) {
          res.status(200).send({
            message: `Address loaded successfully`,
            address: results.rows
          });
        }
      })
    }
    pool.end;
  })
})

exports.updateAddress = expressAsyncHandler(async (req, res) => {
  const id = req.params.id;
  const id2 = req.params.id2;
  const { address1, address2, address3, address4, address5, address6, address7, address8, address9, address10, postcode, city, suburb, country, status, is_default } = req.body;
  //console.log(req.params);
  //console.log(id);
  await pool.query(getUserByIdQuery, [id], (error, results) => {
    //const numusers= results.rows.length;
    if (error || !results.rows.length) {
      res.status(404).send({ message: "This User does not exist" })
    }
    else if (results.rows.length) {

      pool.query(getAddressByIdQuery, [id2], (err, results) => {
        // console.log(err);
        if (err || !results.rows.length) {
          res.status(404).send({ message: "No Address Found" })
        } else if (results.rows.length) {

          const Users = results.rows[0];
          // console.log(Users);
          pool.query(updateAddressByIdQuery,
            [address1 || Users.address1, address2 || Users.address2, address3 || Users.address3,
            address4 || Users.address4, address5 || Users.address5, address6 || Users.address6,
            address7 || Users.address7, address8 || Users.address8, address9 || Users.address9, address10 || Users.address10,
            postcode || Users.postcode, city || Users.city, suburb || Users.suburb, country || Users.country,
            is_default || Users.is_default, status || Users.status, id2], (error, results) => {
              if (error) {
                throw error
              } else {
                res.status(200).send({ message: `Address updated successfully` });
              }
            });
        }
      })
    }
    pool.end;
  })
})
