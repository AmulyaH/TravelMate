var zomatoAPI = "44f2ef10b109462372c1dadf31aadc51";

var OpenweatherAPI = "06d6ba56c4f8e2f08f38c52fd8224fb6";

var travelAPIKey = "re1hisqd696bhfquhxpifv5uzzr2agih";

var travelAccountId = "5SZH7AXJ"

var city = document.getElementById("city");
var show = false;
var cityID = 0;
var cityLat =0;
var cityLong = 0;
var country;

function saveForm(){

    city = document.getElementById("city");
    var requiredCity = document.getElementById("requiredCity")

    if(!city.value)
    {
        requiredCity.style.display = "block";
        show = false; 
    }
    else{
        requiredCity.style.display = "none";
        show = true;
    }
    
}



function openPage(pageName,elmnt,color) 
{
    if(show)
    {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) 
        {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("anibutton");
        for (i = 0; i < tablinks.length; i++) 
        {
            tablinks[i].style.backgroundColor = "";
        }
        document.getElementById(pageName).style.display = "block";
        elmnt.style.backgroundColor = color;
    }
    else
    {
        document.getElementById(pageName).style.display = "none";
    }
   
}

function openPageNav(pageName,elmnt,color) 
{
    //if(city.value)
    {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) 
        {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("anibutton");
        for (i = 0; i < tablinks.length; i++) 
        {
            tablinks[i].style.backgroundColor = "";
        }
        document.getElementById(pageName).style.display = "block";
        elmnt.style.backgroundColor = color;
    }
   
}

document.getElementById("defaultOpen").click();
    
function myFunction() 
{
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") 
    {
        x.className += " responsive";
    } 
    else 
    {
    x.className = "topnav";
    }
}   

// -- On load --
$(document).ready(function(){
    // If geolocation is not supported, hide the geolocaion icon
    if (!navigator.geolocation){
        $('#geolocation').hide();
    }
    // Get default city
    city;
    if (document.location.hash){
        // Get city from hash
        city = document.location.hash.substr(1);
    }
    else {
        // Default city
        city = "London";
    }
    // Get and display current date
    date = moment();
    for (var i = 0; i < 3; i++){
        // Display date
        day = $("#meteo-day-" + (i+1));
        day.find(".name").text(date.format("dddd"));
        day.find(".date").text(date.format("DD/MM"));
        // Go to the next day
        date = date.add(1, 'days')
    }
    // Loading...
    loading = $('#search-loading');
    loading.attr('class', 'loading inload');
    // Get and update meteo

    getMeteoByCity(city, function (data, error) {
        if (error == null) {
            cityLat = data.city.coord.lat;
            cityLong = data.city.coord.lon;
            city = data.city.name;
            country = data.city.country
            displayMeteo(data);
        }
        else {
            meteoTitle = $('#meteo-title span');
            meteoTitle.html('City <span class="text-muted">' + city + '</span> not found');
        }
    });

    getRestCityId(city, function (data, error) {
        if (error == null) {
            cityID = cityID = data.location_suggestions[0].id;
        }
        else {
            restTitle = $('#rest-title span');
            restTitle.html('City <span class="text-muted">' + city + '</span> not found');
        }
    });

    getTop5Rest(cityID, function (data, error) {
        if (error == null) {
            displayRest(data);;
        }
        else {
            restTitle = $('#rest-title span');
            restTitle.html('CityID <span class="text-muted">' + city + '</span> not found');
        }
    });

    getPlacesByCity(city, function (traveldata, error){
        if (error == null) {
            displayPlacesData(traveldata);
        }
        else {
            meteoTitle = $('#meteo-title span');
            meteoTitle.html('City <span class="text-muted">' + city + '</span> not found');
        }
    });
});

function getMeteoByCity(city, callback)
{
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=" + OpenweatherAPI,
        success: function(data){
            callback(data, null);
        },
        error: function(req, status, error){
            callback(null, error);
        }
    });
}

function getRestCityId(city, callback){
    $.ajax({
        headers: {'user-key' : zomatoAPI},
        url: "https://developers.zomato.com/api/v2.1/cities?q=" + city,
        success: function(data){
            callback(data, null);
        },
        error: function(req, status, error){
            callback(null, error);
        }
    });
}

function getTop5Rest(cityID, callback){
    $.ajax({
        headers: {'user-key' : zomatoAPI},
        url:  'https://developers.zomato.com/api/v2.1/search?entity_id='+cityID+'&entity_type=city&count=5&sort=rating&order=desc',
        success: function(data){
            callback(data, null);
        },
        error: function(req, status, error){
            callback(null, error);
        }
    });
}

function getPlacesByCity(city, callback){
    $.ajax({
        url: "https://www.triposo.com/api/20200405/poi.json?location_id=" + city + "&account=" + travelAccountId + "&&token=" + travelAPIKey,
        success: function(data){
            callback(data, null);
        },
        error: function(req, status, error){
            callback(null, error);
        }
    });
}

// -- Core --
$("#meteo-form").submit(function (event) {
    // Loading...
    loading = $('#search-loading');
    loading.attr('class', 'loading inload');
    // Get and update meteo
    city = event.currentTarget[0].value;
    getMeteoByCity(city, function (data, error){
        if (error == null) {
            cityLat = data.city.coord.lat;
            cityLong = data.city.coord.lon;
            city = data.city.name;
            country = data.city.country;
            displayMeteo(data);
        }
        else {
            meteoTitle = $('#meteo-title span');
            meteoTitle.html('City <span class="text-muted">' + city + '</span> not found');
        }
    });

    getRestCityId(city, function (data, error) {
        if (error == null) {
            cityID = cityID = data.location_suggestions[0].id;
        }
        else {
            restTitle = $('#rest-title span');
            restTitle.html('CityID <span class="text-muted">' + city + '</span> not found');
        }
    });

    getTop5Rest(cityID, function (data, error) {
        if (error == null) {
            displayRest(data);
        }
        else {
            restTitle = $('#rest-title span');
            restTitle.html('City <span class="text-muted">' + city + '</span> not found');
        }
    });
    
    getPlacesByCity(city, function (traveldata, error){
        if (error == null) {
            displayPlacesData(traveldata);
        }
        else {
            meteoTitle = $('#meteo-title span');
            meteoTitle.html('City <span class="text-muted">' + city + '</span> not found');
        }
    });

    // Don't refresh the page
    return false;
});

$("#geolocation").click(function (event) {
    show = true;
    navigator.geolocation.getCurrentPosition(function (position) {
        // Loading...
        loading = $('#search-loading');
        loading.attr('class', 'loading inload');
        // Get latitude and longitude
        var lat = position.coords.latitude
        var lon = position.coords.longitude
        // Get and update meteo
        getMeteoByCoordinates(lat, lon, function (data, error) {
            if (error == null) {
                displayMeteo(data);
            }
            else {
                meteoTitle = $('#meteo-title span');
                meteoTitle.html('Can\'t  get meteo for your position');
            }
            // Stop loader
            setTimeout(function () {
                loading.attr('class', 'loading')
            }, 500);
        });

        getPlacesByCity(city, function (traveldata, error){
            if (error == null) {
                displayPlacesData(traveldata);
            }
            else {
                meteoTitle = $('#meteo-title span');
                meteoTitle.html('City <span class="text-muted">' + city + '</span> not found');
            }
        });
    });
});

function getMeteoByCoordinates(lat, lon, callback){
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&APPID=" + OpenweatherAPI,
        success: function(data){
            callback(data, null);
        },
        error: function(req, status, error){
            callback(null, error);
        }
    });
}

function displaySunriseSunset(lat, long){
    date = moment();
    for (var i = 0; i < 3; i++) {
        // Get sunrise and sunset
        var times = SunCalc.getTimes(date, lat, long);
        var sunrise = pad(times.sunrise.getHours(), 2) + ':' + pad(times.sunrise.getMinutes(), 2);
        var sunset = pad(times.sunset.getHours(), 2) + ':' + pad(times.sunset.getMinutes(), 2);
        // Display sunrise and sunset
        day = $("#meteo-day-" + (i + 1));
        day.find('.meteo-sunrise .meteo-block-data').text(sunrise);
        day.find('.meteo-sunset .meteo-block-data').text(sunset);
        // Go to the next day
        date = date.add(1, 'days')
    }

}

function displayMeteo(data){
    // Update Google Map URL
    googleMapCity = "https://www.google.fr/maps/place/" + cityLat + "," + cityLong;
    $('#meteo-title span').html('Weather in <a href="' + googleMapCity + '" class="text-muted meteo-city" target="_blank">' + city + ', ' + country + '</a>');
    // Update meteo for each day
    var tempMoyenne = 0;
    //city = data.city.name;
    for (var i = 0; i < 3; i++){
        // Get meteo
        meteo = data.list[i*8];
        // Get DOM elements
        day = $("#meteo-day-" + (i + 1));
        icon = day.find(".wi");
        weatherDescription = day.find(".weatherDescription");
        temperature = day.find(".Temp");
        feelstemperature = day.find(".feelsTemp");
        mintemperature = day.find(".minTemp");
        maxtemperature = day.find(".maxTemp");
        humidity = day.find(".meteo-humidity .meteo-block-data");
        wind = day.find(".meteo-wind .meteo-block-data");
        sunrise = day.find(".meteo-sunrise .meteo-block-data");
        sunset = day.find(".meteo-sunset .meteo-block-data");

        // Update DOM
        code = meteo.weather[0].id;

        icon.attr('class', 'wi wi-owm-' + code);
        weatherDescription.text(meteo.weather[0].description);
        temperature.text(meteo.main.temp+ "°F");
        feelstemperature.text(meteo.main.feels_like+ "°F");
        mintemperature.text(meteo.main.temp_min+ "°F");
        maxtemperature.text(meteo.main.temp_max+ "°F");
        humidity.text(meteo.main.humidity + "%");
        wind.text(meteo.wind.speed + " km/h");
        sunrise
        tempMoyenne += meteo.main.temp;
    }
    displaySunriseSunset(data.city.coord.lat, data.city.coord.lon);
    // Get custom gradient according to the temperature
   /*  tempMoyenne = toCelsius(tempMoyenne / 3);
    var hue1 = 30 + 240 * (30 - tempMoyenne) / 60;
    var hue2 = hue1 + 30;
    rgb1 = 'rgb(' + hslToRgb(hue1 / 360, 0.6, 0.5).join(',') + ')';
    rgb2 = 'rgb(' + hslToRgb(hue2 / 360, 0.6, 0.5).join(',') + ')';
    $('body').css('background', 'linear-gradient(' + rgb1 + ',' + rgb2 + ')'); */
}

function displayRest(data){
    googleMapCity = "https://www.google.fr/maps/place/" + cityLat + "," + cityLong;
    $('#rest-title span').html('Restaurants in <a href="' + googleMapCity + '" class="text-muted meteo-city" target="_blank">' + city + ', ' + country + '</a>');
    console.log("Restaurant#1 Name:",data.restaurants[0].restaurant.name);
    console.log("Restaurant#1 URL:",data.restaurants[0].restaurant.url);
    console.log("Restaurant#1 Adress:",data.restaurants[0].restaurant.location.address);
    console.log("Restaurant#1 Cuisine:",data.restaurants[0].restaurant.cuisines);
    console.log("Restaurant#1 Rating:",data.restaurants[0].restaurant.user_rating.aggregate_rating);
}

function displayPlacesData(data){
     // Update Google Map URL
     googleMapCity = "https://www.google.fr/maps/place/" + cityLat + "," + cityLong;
     $('#places-title span').html('Top 10 Point Of Attractions in<a href="' + googleMapCity + '" class="text-muted meteo-city" target="_blank">' + city + ', ' + country + '</a>');


}




