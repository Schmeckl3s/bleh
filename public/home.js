
let lat, long, city, weather, temperature, aq;
let iss_Lat, iss_long;

const issIcon = L.icon({
    iconUrl: 'iss-icon.png',
    iconSize: [38, 95],
    iconAnchor: [22, 94],
    popupAnchor: [-3, -76],

});

const iss_marker = L.marker([0, 0],{icon: issIcon});
const iss_popup = L.popup()
iss_marker.bindPopup(iss_popup)

try{

iss_popup.setContent(`<iframe src="https://ustream.tv/embed/17074538?autoplay=1"  allow="autoplay" allowfullscreen="true"></iframe>`);
}
catch(error){
console.error(error);
}

/////////////////////////////////////////////////////////////////////////////////////////////







/////////////////////////////////////////////////////////////////////////////////////////
const corner1 = L.latLng(90, 180), 
      corner2 = L.latLng(-90, -180), 
      bounds = L.latLngBounds(corner1, corner2);

//https://earth.google.com/web/@0,-3.6645,0a,22251752.77375655d,35y,0h,0t,0r

const Thunderforest_Pioneer = L.tileLayer('https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '<your apikey>',
	maxZoom: 22
});

const openStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom:1,
    maxZoom: 19,
    maxBounds: bounds,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

const OpenTopoMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    minZoom:1,
	maxZoom: 17,
    maxBounds: bounds,
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});
const USGS_USImageryTopo = L.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}', {
    minZoom:1,
	maxZoom: 15,
    maxBounds: bounds,
	attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
});

const baseMaps = {
    "Open Street Map": openStreetMap,
    "Open Topo Map": OpenTopoMap,
    "USGS Topo": USGS_USImageryTopo,
    "Thunder Pioneer": Thunderforest_Pioneer
};

const map = L.map('map',{
    layers: [openStreetMap],
    maxBounds: bounds,
    minZoom:3,
    maxZoom:19
    
}).setView([0, 0], 3);

var layerControl = L.control.layers(baseMaps).addTo(map);


/////////////////////////////////////////////////////////////////////////////////

const terminator = L.terminator().addTo(map);
console.log(terminator)



////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
fetchISS();

async function fetchISS(){
    const issData = '/issLocation';
    const iss_response = await fetch(issData);
    const iss_json = await iss_response.json();

    iss_Lat = iss_json.latitude;
    iss_long = iss_json.longitude;

    //console.log(iss_lat)

    
    
    
    
    
    if(iss_Lat && iss_long){  //if there is a value in iss_Lat and iss_long
        iss_marker.setLatLng([iss_Lat, iss_long]) //set the marker to the position of iss_Lat andiss_long
        iss_marker.addTo(map)   // set iss_marker with L.marker at iss_Lat and iss_Long

        iss_popup.setLatLng([iss_Lat, iss_long])
        
        
    }
       
}       
          
    
    

console.log(iss_Lat)
setInterval(fetchISS, 1000);      // call fetchISS() every second



////////////////////////////////////////////////

    
        





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



if ('geolocation' in navigator){
    console.log('Geolocation is available!');
    

    navigator.geolocation.getCurrentPosition(async position =>{

    

        lat = position.coords.latitude.toFixed(3);
        long = position.coords.longitude.toFixed(3);
        
        const latlong = `${lat},${long}`;
        console.log(latlong);

        //document.getElementById('latitude').textContent = lat;
        //document.getElementById('longitude').textContent = long;
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        const localAPI = `LAPI/${lat},${long}`;
        const response = await fetch(localAPI);
        const jsondata = await response.json();
        
        city = jsondata.weather.name;
        weather = jsondata.weather.weather[0].description;
        temperature = jsondata.weather.main.temp.toFixed();
       
        console.log(jsondata);

        //document.getElementById('name').textContent = jsondata.weather.name;
        //document.getElementById('weather').textContent = jsondata.weather.weather[0].description;
        //document.getElementById('temperature').textContent = jsondata.weather.main.temp.toFixed();

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
try{
        console.log(jsondata.aq.results[0].measurements[0].value);
        aq = jsondata.aq.results[0].measurements[0].value + jsondata.aq.results[0].measurements[0].unit;
        aq_date = jsondata.aq.results[0].measurements[0].lastUpdated;
        //document.getElementById('aq').textContent = jsondata.aq.results[0].measurements[0].value + jsondata.aq.results[0].measurements[0].unit;
        //document.getElementById('aq_date').textContent = jsondata.aq.results[0].measurements[0].lastUpdated;
    } catch(error){
        console.error(error);
        aq = "No Data Available";
        aq_date = "";
        //document.getElementById('aq').textContent = "No Data Available";


    }
        
///////////////////////////////////////////////////////////////////////////////////////

    const popup = L.popup()
    .setLatLng([lat, long])
    .setContent('<h1>Tracking your location was way too easy...</h1>'
    +`<p>Latitude: ${lat}<span id="latitude">&deg;<br /></span>Longitude: ${long}<span id="longitude">&deg;</span></p>`
    +`<p>
    The weather here in ${city}<span id="name"></span>
    is ${weather}<span id="weather"></span> 
    with a temperature of ${temperature}<span id="temperature"></span>&deg;F
    Amount of particulate matter in the air around you: ${aq}<span id="aq"></span><span id="aq_param"></span>
    Last read on: ${aq_date}<span id="aq_date"></span>
    </p>`
    +'<button id="submit">Submit</button>')
    
    
    
    
    
    
    const marker = L.marker([lat, long],{})
    .addTo(map)
    .bindPopup(popup)
    .on('popupopen',function(){
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
        const button = document.getElementById('submit');
        button.addEventListener('click', async event => {
    
        
        
        lat = lat;
        long = long;
        console.log('button clicked');
        const data = {lat, long};
        const options = {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        
        
        
        };
        
        const response = await fetch('/api', options);
        const jsondata = await response.json();
        console.log(jsondata);
        // history.go(0);
        
        });
        
})
    
    
    });






}else{
    
    console.log('Hmm... it appears geolocation is unavailable, you probably did something wrong.');
}


