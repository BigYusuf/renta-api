const express = require('express');
const connectDatabase = require('./config/database')
const dotenv = require('dotenv');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
//extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const locationRouter = require('./routers/locationRouter');

const app = express()

app.set('trust proxy', 1);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
//app.use(cors());
app.use(cors({credentials: true, origin: "*"}));
app.use(xss());

//app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//connecting to env file
dotenv.config();

// admin users
app.use('/api/location', locationRouter);

 app.get('/', (req, res) => {
   res.send('Renta API');
 });


 const port = process.env.PORT || 5000;
 app.listen(port, () => {
   console.log(`Serve at http://localhost:${port}`);
 });