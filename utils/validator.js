
const validateRegister = (res, {first_name, last_name, email, password}) => {
    
    //RegEx	Description for password
        //^	The password string will start this way
        //(?=.*[a-z])	The string must contain at least 1 lowercase alphabetical character
        //(?=.*[A-Z])	The string must contain at least 1 uppercase alphabetical character
        //(?=.*[0-9])	The string must contain at least 1 numeric character
        //(?=.*[!@#$%^&*])	The string must contain at least one special character, but we are escaping reserved RegEx characters to avoid conflict
        //(?=.{8,})	The string must be eight characters or longer
        
        let emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        var passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    if (!email || !password){
        return res.status(400).send({
          message: "Email or password missing."
        })
    }
    if (!first_name || !last_name){
        return res.status(400).send({
          message: "first_name or last_name missing."
        })
    }if(emailRegex.test(email)===false){
          return res.status(400).send({
            message: "email invalid."
        })
    }if(passwordRegex.test(password)===false){
          return res.status(400).send({
            message: "password must be at least 8 characters, contain at least 1 lowercase, uppercase, numeric and special character."
        })
    }
}
module.exports = { validateRegister}