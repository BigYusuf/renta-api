const otpGenerator = require('otp-generator')

 function generateOTP (){
   const OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: true,
    specialChars: false,
   });

   return OTP
  }

  
module.exports = { generateOTP }