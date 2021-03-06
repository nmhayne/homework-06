// BASE URL TO ADD CITY NAME AND API KEY
// var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&apikey=" + APIKey;
// var forecastURL= "https://api.openweathermap.org/data/2.5/forecast?q="+cityName +"&appid="+APIKey
/*
The 5-Day Forecast actually breaks down each day's forecast into hour blocks of 3, which will be 
really hard to parse. The function below will solve the problem: 
1) Create a global variable called forecastArray

2) After you make your 5-Day Forecast API call, call this function and pass in the list of weather objects
(response.list)
3. Once this function is done, your global forecast array will be populated.
4. Then loop through that array to create the 5 blue blocks at the bottom
5. You're welcome.  :)
// */ 

// MY API KEY
var APIKey  = "166a433c57516f51dfab1f7edaed8413"
// CITY NAME GOTTEN FROM SEARCH 
var cityName="springfield";




// // AJAX CALL FOR 5 DAY FORECAST
// function getFiveDayForecast(){
//   var listResponse;
//   $.ajax({
//     // URL WITH MY KEY  
//     url: forecastURL,
//     // METHOD IS JUST "GET" INFORMATION FROM API 
//     method: "GET",

//   }).then(function(response){  
//     // GET THE RESPONSE AND GET THE LIST ARRAY 
//     listResponse=response.list;
//     // TAKE THE LIST ARRAY AND PUT IT INTO GARYS FUNCTION TO GET 5 DAY 
//     getForecastForEachDay(listResponse);
//   });
//   console.log(forecastArray);
// }




// ARRAY TO BE SAVED TO LOCAL STORAGE 
var storedCities=[];



// SEARCH BUTTON CLICK HANDLER
$("#searchButton").on("click", function(){
    
    // PREVENTS THE PAGE FROM RELOADING 
    event.preventDefault();
    
    // SET SEARCHED CITY TO THE VALUE OF THE FORM INPUT
    var searchedCity=$("#searchedCity").val();
    
    // MAKE SURE THE FORM IS POPULATED AND THE SEARCHED CITY IS NOT IN STORED CITIES
    if(searchedCity!="" && storedCities.indexOf(searchedCity)===-1){
        
        // CONSOLE LOGS SEARCHED CITY
        console.log(searchedCity);
        
        // SETS THE FORM INPUT BACK TO ""
        $("#searchedCity").val("");
        
        // ADDS THE SEARCHED CITY TO THE STORED CITIES
        storedCities.push(searchedCity);
        
        
        // SAVE TO LOCAL STORAGE
        saveToLocal();
        
        // GET CITIES FROM STORAGE AND DISPLAY 
        getFromLocal();
    }
})

// SAVES STORED CITIES AND CURRENT CITY TO LOCAL STORAGE 
function saveToLocal(){
    localStorage.setItem("storedCities",JSON.stringify(storedCities));
    
}

// GET ARRAY AND CURRENT CITY FROM LOCAL STORAGE
function getFromLocal(){
    
    // GET THE STORED STRING FROM LOCAL STORAGE
    storedString=localStorage.getItem("storedCities");
    
    // PARSE THE STRING TO TURN IT BACK INTO AN OBJECT
    storedCities=JSON.parse(storedString);
    
    // CREATE BUTTONS FOR EACH ITEM  
    renderButtons();
    
    
    
    
}

// FUNTION TO RENDER THE BUTTONS FROM THE LOCALLY STORED ARRAY
function renderButtons(){
    // CLEAR THE SAVED CITY BUTTONS
    $("#savedCities").empty();
    // FOR EACH ITEM IN THE STORE CITIES ARRAY
    for (var i = 0; i < storedCities.length; i++) {  
        // CREATE A NEW BUTTON
        newbutton=$("<button>");
        // SET THE BUTTON TEXT TO THE CITY NAME
        newbutton.text(storedCities[i]);
        newbutton.attr("cityName",storedCities[i])
        // APPEND THE BUTTON TO THE SAVED CITIES BUTTON DIV
        $("#savedCities").append(newbutton);
    }
}



// FORCAST SYMBOL
// forecast.symbol
// forecast.symbol.number Weather condition id
// forecast.symbol.name Weather condition
// forecast.symbol.var Weather icon id



// CLICK HANDLER FOR THE SAVED CITY BUTTONS
$("#savedCities").on("click", "button",function(){
    
    // SETTING THE CURRENT DISPLAY CITY TO CLICKED TARGET
    buttonClicked=$(this).text();
    console.log(buttonClicked)
    
    // INSERT THE CLICKED CITY NAME INTO THE API CALL
    weatherURL="https:api.openweathermap.org/data/2.5/weather?q="+buttonClicked+"&apikey=166a433c57516f51dfab1f7edaed8413";   
    forecastURL="https://api.openweathermap.org/data/2.5/forecast?q="+buttonClicked +"&appid=166a433c57516f51dfab1f7edaed8413"
    
    // AJAX CALL FOR WEATHER
    $.ajax({
        
        // URL WITH MY KEY  
        url: weatherURL,
        
        // METHOD IS JUST "GET" INFORMATION FROM API 
        method: "GET",
        
    }).then(function(response){
        updateWeather(response);
    })
    // AJAX CALL FOR 5 DAY FORECAST
    $.ajax({
        
        // URL WITH MY KEY  
        url: forecastURL,
        
        // METHOD IS JUST "GET" INFORMATION FROM API 
        method: "GET",
        
    }).then(function(response){
        listResponse=response.list;
        getForecastForEachDay(listResponse);
        updateForecast(forecastArray);
    })
})

// FUNCITON TO UPDATE THE DISPLAY WITH CURRENT CITY
function updateWeather(response){
    
    // CLEAR THE DIV TO DISPLAY NEW INFO
    $("#displayCurrentCity").empty();
    
    console.log(response);
    
    
    // CITY NAME
    displayName=$("<h2>");
    displayName.text("City :" + response.name);
    $("#displayCurrentCity").append(displayName);
    
    // WIND SPEED
    displayWind=$("<h3>");
    displayWind.text("Wind Speed: " + response.wind.speed+"mph");
    $("#displayCurrentCity").append(displayWind);
    
    // HUMIDITY
    displayHumid=$("<h3>");
    displayHumid.text("Humidity: " +response.main.humidity +"%");
    $("#displayCurrentCity").append(displayHumid);
    
    // TEMPERATURE, GET TEMP IN K, CONVERT TO F
    responseK=response.main.temp;
    responseConvert=parseInt((response.main.temp)-273.15)*1.8+32;
    displayTemp=$("<h3>");
    displayTemp.text("Temperature: "+ responseConvert+"\xB0"+"F");
    $("#displayCurrentCity").append(displayTemp);
    
}

function updateForecast(forecastArray){
    for (var i = 0; i < forecastArray.length; i++) {
        console.log(forecastArray[i]);
        createCard(forecastArray[i]);
    }
    // <div class="card" style="width: 18rem;">
    // <div class="card-body">
    // <h5 class="card-title">Card title</h5>
    // <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
    // <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    // </div>
    // </div>
}


var forecastArray=[];
function getForecastForEachDay(listOfForecasts){
    var currentDate = "";
    for(var i=0; i<listOfForecasts.length; i++){
        // We want to capture one weather object for each day in the list. Once we've captured that
        // object, we can ignore all other objects for the same day
        var dateOfListItem = listOfForecasts[i].dt_txt.split(" ")[0];
        if( dateOfListItem !== currentDate ){
            // We need to extract just the date part and ignore the time
            currentDate = dateOfListItem;
            // Push this weather object to the forecasts array
            if( forecastArray.length < 5 ){
                forecastArray.push(listOfForecasts[i]);
            }
        }
    }
}


function createCard(forecastDay) {
    console.log("creating card");
    card=$("<div>").addClass("card");
    cardBody=$("<div>").addClass("card-body");
    // DATE
    cardDate=$("<h5>").addClass("card-title")
    cardDate.text(forecastDay.sys.dt_txt);
    // ICON
    cardIcon=$("<h5>").addClass("card-text")
    cardIcon.text(forecastDay.weather.icon);
    // TEMP
    cardTemp=$("<h5>").addClass("card-text")
    cardTemp.text(forecastDay.main.temp);
    // HUMID
    cardHumid=$("<h5>").addClass("card-text")
    cardHumid.text(forecastDay.main.humidity);

    // APPEND THE FORECAST ELEMENTS TO THE CARD BODY
    cardBody.append(cardDate);
    cardBody.append(cardIcon);
    cardBody.append(cardTemp);
    cardBody.append(cardHumid);
    
    // APPEND THE CARDBODY TO THE CARD
    card.append(cardBody);

    $("#fivedayForecast").append(card);
    console.log("Appending card");
}