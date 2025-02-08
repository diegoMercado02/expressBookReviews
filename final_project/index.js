const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    const auth = req.headers.authorization;

	if (!auth) {
		return res.status(403).send('A token is required for authentication');
	}

    const token = auth.split(' ')[1];

	try {
		const decoded = jwt.verify(token, "fingerprint_customer");
		req.user = decoded;
	} catch (err) {
		return res.status(401).send('Invalid Token');
	}
	return next();
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
