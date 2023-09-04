const nodemailer = require('nodemailer');
const { resetPasswordTemplate, EmailTemplate3, verifyEmailTemplate } = require('../utils/emailTemplates');
//const { EmailTemplate, EmailTemplate2, EmailTemplate3 } = require('./emailTemplate/Template');

async function sendMail1(req, email, first_name, token){
    try{
      const transport = nodemailer.createTransport({
        service: "hotmail",
        secure: false,
        auth:{
        user: process.env.MASTER_EMAIL,
        pass: process.env.MASTER_PASS
        },
          tls:{
            rejectUnauthorized: false
          }
        });
        const mailOptions ={
          from: `Renta <${process.env.MASTER_EMAIL}>`,
          to: ` ${first_name} <${email}>`,
          
          subject: `New Registration ${first_name}`,
          html: verifyEmailTemplate(first_name, req, token),
         }
        const result = await transport.sendMail(mailOptions)
        return result
  
    }catch(error){
      return error
    }
  }
  async function sendResetMail( first_name, email, token){
    try{
      const transport = nodemailer.createTransport({
        service: "hotmail",
        secure: false,
        auth:{
        user: process.env.MASTER_EMAIL,
        pass: process.env.MASTER_PASS
        },
          tls:{
            rejectUnauthorized: false
          }
        });
        const mailOptions ={
          from: `Renta <${process.env.MASTER_EMAIL}>`,
          to: `${email}`,
          
          subject: `Reset Password`,
          html: resetPasswordTemplate(first_name, token),
         }
        const result = await transport.sendMail(mailOptions)
        return result
  
    }catch(error){
      return error
    }
  }
  
async function sendMail3(){
    try{
      const transport = nodemailer.createTransport({
        service: "hotmail",
        secure: false,
        auth:{
        user: process.env.MASTER_EMAIL4,
        pass: process.env.MASTER_PASS4
        },
          tls:{
            rejectUnauthorized: false
          }
        });
        const mailOptions ={
          from: `${process.env.MASTER_EMAIL4}`,
          to: `${process.env.MASTER_EMAIL}`,
          
          subject: `Testing case2`,
          html: EmailTemplate3(),
         }
        const result = await transport.sendMail(mailOptions)
        return result
  
    }catch(error){
      return error
    }
  }
  
module.exports = { sendMail1, sendResetMail, sendMail3 }