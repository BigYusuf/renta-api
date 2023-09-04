const EmailTemplate = () => {
    return `<h1>Thanks for shopping with us</h1>
    <p>
    Hi Yusuf,</p>
    <h2>Yea it worked.</h2>
    <h4> Please verify your email to continue enjoying our services</h4>
    
    <hr/>
    <p>
    Thanks for using our service with us.
    </p>
    `;
};

const verifyEmailTemplate = (first_name, req, token) => {
    return `<h1>Thanks for shopping with us</h1>
    <p>
    Hi ${first_name},</p>
    <h2>Thanks for registering on our site.</h2>
    <h4> Please verify your email to continue enjoying our services</h4>
    <a href='http://${req.headers.host}/api/users/verify-email?token=${token}'> Verify Email</a>
    <hr/>
    <p>
    Thanks for using our service with us.
    </p>
    `;
  };

  const resetPasswordTemplate = ( first_name, token) => {
   let url ="exp://192.168.43.241:8081/"
    return `<h1>Reset Password</h1>
    <p>
    Hi ${first_name},</p>
    <h2>Thanks for registering on our site.</h2>
    <h4> Please use this code to reset your password</h4>
    <h2> ${token}</h2>
    <hr/>
    <p>
    This link will expire in 15 minutes time.
    </p>
    <p>
    Just ignore this message, If you didn't authorize this.
    </p>
    `;
  };

const EmailTemplate3 = () => {
    return `
    <html>
    <body>
    <h1>Adaptive Cards Example</h1>

	<p>This is just an example.</p>

	<h3>To run:</h3>
	<code>
		<pre>$ npm yusuf</pre>
		<pre>$ npm run lateef</pre>
		<pre>Refresh this page</pre>
	</code>

	<h3>Yeah It worked</h3>
</body>
</html>
    `;
};

  module.exports= {EmailTemplate, resetPasswordTemplate, EmailTemplate3, verifyEmailTemplate}