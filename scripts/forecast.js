// =====================================================
// GET WEATHER AND CITY DETAILS
// =====================================================
const key = "u0wFIfTKJLcUqKUHRFuIuPRnmiLTRCYC";
const form = document.querySelector("#input-form");

const getCity = async (city) => {
  const base = "http://dataservice.accuweather.com/locations/v1/cities/search";
  const query = `?apikey=${key}&q=${city}`;

  try {
    const response = await fetch(base + query);

    if (!response.ok) {
      throw new Error("Location request failed");
    }
    const locationData = await response.json();
    return locationData[0];
  } catch (error) {
    console.log(error);
  }
};

const getWeather = async (id) => {
  const base = "http://dataservice.accuweather.com/currentconditions/v1/";
  const query = `${id}?apikey=${key}`;

  try {
    const response = await fetch(base + query);
    if (!response.ok) {
      throw new Error("Weather details request failed");
    }
    const weatherData = await response.json();
    return weatherData;
  } catch (error) {
    console.log(error);
  }
};

// =====================================================
// DISPLAY DETAILS TO DOM
// =====================================================
const updateCity = async (userInput) => {
  const cityDetails = await getCity(userInput);
  const weatherDetails = await getWeather(cityDetails.Key);

  return {
    cityDetails,
    weatherDetails,
  };
};

const updateUI = (data) => {
  const results = document.querySelector(".results");
  const image = document.querySelector("img");

  const city = data.cityDetails;
  const weather = data.weatherDetails[0];
  console.log(city, weather);

  results.innerHTML = `<p id="city"><span>city</span>${city.EnglishName}</p>
      <p id="weather"><span>weather</span>${weather.WeatherText}</p>
      <p id="temperature"><span>temperature</span>${weather.Temperature.Metric.Value}&deg;C</p>`;

  //removing display none after first search
  if (
    results.classList.contains("d-none") &&
    image.classList.contains("d-none")
  ) {
    results.classList.remove("d-none");
    image.classList.remove("d-none");
  }

  //displaying day or night img
  timeSrc = null;
  if (weather.IsDayTime === false) {
    timeSrc = "assets/isnight.jpg";
  } else {
    timeSrc = "assets/isday.jpg";
  }
  image.setAttribute("src", timeSrc);
};

//event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const userInput = form.userinput.value.trim();
  form.reset();
  updateCity(userInput)
    .then((data) => updateUI(data))
    .catch((error) => {
      const resultsText = document.querySelector(".results");
      resultsText.innerHTML = `<p>${error}</p>`;
    });
});
