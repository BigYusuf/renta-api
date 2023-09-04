
const expressAsyncHandler = require('express-async-handler');
//const { default: axios } = require('axios');
const axios = require('axios');

exports.getAutoComplete = expressAsyncHandler(async (req, res) => {
     const limit = parseInt(req.query.limit) || 10;
    const location = req.query.location || "";
    let apiKey = process.env.LOCATION_TOKEN
    
    let url =`http://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${location}&limit=${limit}`
    axios({
      method: 'get',
      url: url
    }).then(function (result) {
     res.status(200).json( result.data); 
    //  return res.data
    }).catch(err => console.log(err));
})

exports.getSearch = expressAsyncHandler(async (req, res) => {
     const limit = parseInt(req.query.limit) || 10;
    const query = req.query.query || "";
    const address = req.query.address || "";
    const countrycode = req.query.countrycode || "";
    let apiKey = process.env.LOCATION_TOKEN
    
    let url =`http://api.locationiq.com/v1/autocomplete?key=${apiKey}&q=${query}&format=json`
    axios({
      method: 'get',
      url: url
    }).then(function (result) {
     res.status(200).json( result.data ); 
     //  return res.data
    }).catch(err => 
        res.status(400).json({message: err.message, data: err})
    );
})

const sourceData = (url) => {
      axios({
        method: 'get',
        url: url
    }).then(function (res) {
       // console.log(res.data)
        return res.data
    }).catch(err => console.log(err));
 }
