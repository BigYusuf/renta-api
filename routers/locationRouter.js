const express = require('express');
const { isAuth, isAdmin } = require('../middleware/Auth');
const { getAutoComplete, getSearch } = require('../controllers/locationController');

const locationRouter = express.Router();

// get all autocomplete
locationRouter.get('/autocomplete', getAutoComplete);
locationRouter.get('/search', getSearch);

  
module.exports = locationRouter;