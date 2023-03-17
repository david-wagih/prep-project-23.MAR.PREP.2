import { useEffect, useState } from "react";
import "./App.css";
import logo from "./mlh-prep.png";
import MapComponent from "./map";

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [city, setCity] = useState("New York City");
  const [results, setResults] = useState(null);
  const [searchedLocation, setSearchedLocation] = useState(null);

  const handleCitySubmit = (event) => {
    event.preventDefault();
    setIsLoaded(false);
    setResults(null);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result["cod"] !== 200) {
            setIsLoaded(false);
          } else {
            setIsLoaded(true);
            setResults(result);
            setSearchedLocation([result.coord.lat, result.coord.lon]); // Set the coordinates of the searched location
          }
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  };

  if (error) {
    console.log(error);
  } else {
    return (
      <>
        <img className="logo" src={logo} alt="MLH Prep Logo"></img>
        <div>
          <h2>Enter a city below 👇</h2>
          <form onSubmit={handleCitySubmit}>
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
          <div className="Results">
            {!isLoaded && <h2>Loading...</h2>}
            {console.log(results)}
            {isLoaded && results && (
              <>
                <h3>{results.weather[0].main}</h3>
                <p>Feels like {results.main.feels_like}°C</p>
                <i>
                  <p>
                    {results.name}, {results.sys.country}
                  </p>
                </i>
              </>
            )}
          </div>
        </div>
        <MapComponent searchedLocation={searchedLocation} />
      </>
    );
  }
}

export default App;
