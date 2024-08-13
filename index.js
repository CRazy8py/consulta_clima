document.getElementById("weatherForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const searchType = document.querySelector('input[name="searchType"]:checked').value;
    let city;
    if (searchType === "city") {
        city = document.getElementById("cityInput").value;
        const countryCode = document.getElementById("countryCodeInput").value;
        city = `q=${city},${countryCode}`;
    } else {
        const lat = parseFloat(document.getElementById("latInput").value);
        const lon = parseFloat(document.getElementById("lonInput").value);
        if (isNaN(lat) || isNaN(lon)) {
            alert("Por favor ingrese valores numéricos para la latitud y la longitud.");
            return;
        }
        city = `lat=${lat}&lon=${lon}`;
    }
    const units = document.getElementById("unitsSelect").value;
    const lang = document.getElementById("langSelect").value;
    getWeather(city, units, lang);
});

document.getElementById("clearTableBtn").addEventListener("click", function () {
    clearTable();
});

document.getElementById("clearStorageBtn").addEventListener("click", function () {
    clearLocalStorage();
});

async function getWeather(query, units, lang) {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/weather?${query}&appid=38ce0c4bff518a76b6f3b8551e781488&units=${units}&lang=${lang}`);
        const data = await response.json();
        displayWeather(data);
        saveToLocalStorage(data);
    } catch (error) {
        console.error("Error al consultar el clima:", error);
    }
}

function displayWeather(weatherData) {
    const weatherInfoContainer = document.getElementById("weatherInfoContainer");
    const iconUrl = `https://api.openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    const weatherInfoContent = `
        <h2>${weatherData.name}, ${weatherData.sys.country}</h2>
        <p>Latitud: ${weatherData.coord.lat}</p>
        <p>Longitud: ${weatherData.coord.lon}</p>
        <p>Clima Principal: ${weatherData.weather[0].main}</p>
        <p>Descripción del Clima: ${weatherData.weather[0].description}</p>
        <p>Humedad (%): ${weatherData.main.humidity}</p>
        <img src="${iconUrl}" alt="Icono del Clima">
    `;
    weatherInfoContainer.innerHTML = weatherInfoContent;

    const tableBody = document.getElementById("weatherTableBody");
    const newRow = tableBody.insertRow();
    newRow.innerHTML = `
        <td>${weatherData.name}</td>
        <td>${weatherData.sys.country}</td>
        <td>${weatherData.coord.lat}</td>
        <td>${weatherData.coord.lon}</td>
        <td>${weatherData.weather[0].main}</td>
        <td>${weatherData.weather[0].description}</td>
        <td>${weatherData.main.humidity}</td>
        <td><img src="${iconUrl}" alt="Icono del Clima"></td>
    `;
}


function saveToLocalStorage(data) {

    let storedWeatherData = JSON.parse(localStorage.getItem('weatherData')) || [];
    storedWeatherData.push(data);
    localStorage.setItem('weatherData', JSON.stringify(storedWeatherData));
}

function clearLocalStorage() {
    const confirmation = confirm("¿Estás seguro de que deseas borrar todos los datos del clima almacenados?, ¡Al actualizar la pagina no se veran nuevamente!");
    if (confirmation) {
        localStorage.removeItem('weatherData');
        alert("¡Los datos del clima almacenados han sido eliminados!");
    } else {
        alert("Operación cancelada. Los datos del clima almacenados no han sido eliminados.");
    }
}
function clearForm() {
    const countryInput = document.getElementById("countryCodeInput");
    const cityInput = document.getElementById("cityInput");
    const latInput = document.getElementById("latInput");
    const lonInput = document.getElementById("lonInput");

    countryInput.value = ""; 
    cityInput.value = ""; 
    latInput.value = ""; 
    lonInput.value = "";
}



window.onload = function() {
    const storedWeatherData = JSON.parse(localStorage.getItem('weatherData')) || [];
    if (storedWeatherData.length > 0) {
        const container = document.getElementById("weatherContainer");
        storedWeatherData.forEach(weatherData => {
            displayWeather(weatherData);
        });
    }
}

function clearTable() {
    const tableBody = document.getElementById("weatherTableBody");
    tableBody.innerHTML = ""; // Elimina todo el contenido dentro del tbody
    const info = document.getElementById("weatherInfoContainer");
    info.innerHTML = ""; // Elimina todo el contenido dentro del tbody
 
}



document.getElementById("cityRadio").addEventListener("change", function () {
    document.getElementById("cityInputContainer").style.display = "block";
    document.getElementById("coordInputsContainer").style.display = "none";
});

document.getElementById("coordRadio").addEventListener("change", function () {
    document.getElementById("cityInputContainer").style.display = "none";
    document.getElementById("coordInputsContainer").style.display = "block";
});