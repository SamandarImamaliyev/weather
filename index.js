const myInput = document.getElementById("myInput");
const myButton = document.getElementById("myButton");

const info = document.querySelector(".info");
const myLocation = document.querySelector(".location");
const image = document.querySelector(".image");
const myDate = document.querySelector(".myDate");
const extra_info = document.querySelector(".extra-info");
const sun_rise = document.querySelector(".sun_rise");
const sun_set = document.querySelector(".sun_set");

let scaleButton = document.querySelector(".scaleButton");
let scale = document.querySelector(".scale");
let changeScale = false;
let city;

const forecastForHours = document.getElementById("forecastForHours");

function search() {
    if (myInput.value.trim().length > 0) {
        city = myInput.value;
        getInfo(city);
    }
    myInput.value = "";
}


document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        search();
    }
})

myButton.addEventListener("click", () => {
    search();
})

window.onload = () => {
    scaleButton.innerHTML = "&degF";
    changeScale = true;
    if (changeScale) {
        scale.innerHTML = "&degC";
    }
    const getLocation = async () =>
        new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });

    // (async () => {
    //     const data = await getLocation();
    //     var lat = data.coords.latitude;
    //     var lng = data.coords.longitude;
    //     const request = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=4246fd938c2a4b73be58616285d057eb&language=en`);
    //     const response = await request.json();
    //     console.log(response)
    //     city = response.results[0].components.city.split(" ")[0];
    //     console.log(city)
    //     getInfo(city);
    // })();

    (async () => {
        const data = await getLocation();
        var lat = data.coords.latitude;
        var lng = data.coords.longitude;
        const request = await fetch(`https://api.weatherapi.com/v1/forecast.json?q=${lat}+${lng}&key=bad2aa2bc01b4a32b81204352242804`);
        const response = await request.json();
        city = response.location.name;
        getInfo(city);

        scale.addEventListener("click", () => {
            if (changeScale) {
                changeScale = false;
                scaleButton.innerHTML = "&degC";
                scale.innerHTML = "&degF";
                getInfo(city);
            } else {
                changeScale = true;
                scaleButton.innerHTML = "&degF";
                scale.innerHTML = "&degC";
                getInfo(city);
            }
        })
    })();

}

let request;
let response;
let degree;

const getInfo = async (city) => {
    forecastForHours.innerHTML = "";

    try {
        request = await fetch(`https://api.weatherapi.com/v1/forecast.json?q=${city}&key=bad2aa2bc01b4a32b81204352242804`);
        response = await request.json();
    } catch (error) {
        console.log({ error })
    }

    const time = response.location.localtime;

    myLocation.innerHTML = response.location.name + ", " + response.location.country;
    if (changeScale) {
        info.innerHTML = response.current.temp_f + "&deg;";
    } else {
        info.innerHTML = response.current.temp_c + "&deg;";
    }

    image.src = response.current.condition.icon;
    myDate.innerHTML = time;
    extra_info.innerHTML = response.current.condition.text + ", Feels like " + response.current.feelslike_c + ", Winds " + response.current.wind_kph + " km/h" + ", Humidity " + response.current.humidity + "%";
    sun_rise.innerHTML = response.forecast.forecastday[0].astro.sunrise;
    sun_set.innerHTML = response.forecast.forecastday[0].astro.sunset;

    const currentTime = time.split(" ")[1].split(":")[0];
    const timelength = response.forecast.forecastday[0].hour.length;

    for (let i = (parseInt(currentTime) + 1); i <= timelength; i++) {
        if (changeScale) {
            degree = response.forecast.forecastday[0].hour[i].temp_f;
        } else {
            degree = response.forecast.forecastday[0].hour[i].temp_c;
        }
        forecastForHours.innerHTML += `<div class="d-flex align-items-center justify-content-around row ps-3">
        <div class="col-3 extra">${response.forecast.forecastday[0].hour[i].time}</div>
        <div class="col-2 col-md-3" id="tempForHours">${degree}&deg;</div>
        <div class="col-2 col-md-3" id="weatherImage">
        <img src="${response.forecast.forecastday[0].hour[i].condition.icon}"></img>
        </div>
        <div class="col-3 extra">${response.forecast.forecastday[0].hour[i].condition.text}</div>
        </div>
        <div class="my-2 border"></div>`;
    }
}

