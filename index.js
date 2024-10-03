const fetch = require('node-fetch');
const express = require('express');
const { get } = require('http');
const datastore = require('nedb');
require('dotenv').config();
const app = express();
const database = new datastore('geolocale.db');

////////////////////////////////////////////////////////////////////////////////////////////////////

const logger = require('./logger');
logger.info('text info');
logger.warn('text warn');
logger.error('text error');



//////////////////////////////////////////////////

app.use(express.static('public'));
app.use(express.json({limit:'1mb'}));
app.listen(3000, () => console.log('Listening on 3000'));
database.loadDatabase();

////////////////////////////////////////////////////
app.use('/', (req, res, next)=>{
    console.log(req.method, req.url, 'HTTP/' + req.httpVersion);
    for(var name in req.headers)
    console.log(name + ':', req.headers[name]);
    next();

})



//use express to POST the json data to /api /////////////////////////////////////////

app.post('/api', (request, response) => {
    console.dir(request.ip);
    const info = request.body;
    const timestamp = Date.now();

    console.log("Received Information...");
    console.log(request.body);

    info.timestamp = timestamp;
    database.insert(info);

    //send response to client /api in json format
    //send back to the client lat and long 
    response.json({
        status:'success',
        timestamp: timestamp,
        latitude:info.lat,
        longitude:info.long
    });
});


///////////////////////////////////////////////////////////////

app.get('/api', (request, response)=>{
    database.find({}, (err, info)=>{
        if (err){
            console.log(err);
            response.end();
            return;

        } else {
            response.json(info);
        }
    });
});


//////////////////////////////////////////////////////////////////

app.get('/LAPI/:latlong', async (req, res) => {

    const API_KEY = process.env.API_KEY
    const latlong = req.params.latlong.split(',');
    console.log(req.params);
    console.log(latlong);
    const lat = latlong[0];
    const long = latlong[1];

    const weatherAPI_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${API_KEY}&units=imperial`
    const weather_response = await fetch(weatherAPI_url);
    const weatherdata = await weather_response.json();
    //res.json(weatherdata);

    const aqAPI_url = `https://api.openaq.org/v2/latest?coordinates=${lat},${long}`;
    const aq_response = await fetch(aqAPI_url);
    const aq_data = await aq_response.json();
    //console.log(aq_data);



    

    const aq_weather_data = {
        weather: weatherdata,
        aq: aq_data,
    };

    res.json(aq_weather_data);
});

//////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////
app.get('/issLocation', async(req, res) =>{

    const issCoord = req.latitude
    //console.log(req.params);

   
try{
    const issAPI = `https://api.wheretheiss.at/v1/satellites/25544&units=miles`
    const iss_Res = await fetch(issAPI);
    const iss_data = await iss_Res.json();
    //console.log(iss_data);
    res.json(iss_data);
}
catch(error){
    console.error(error);
}
    
   



});

////////////////////////////////////////////////////////////////////////////////

