// src/App.js

import CityTable from './components/CityTable';
import Citydemo from './components/Citydemo';
import City from './components/City';
import WeatherApp from './components/WeatherApp';
import { Router,Route, Routes } from "react-router-dom";

// import React from 'react';
// import { BrowserRouter as Router, Route } from 'react-router-dom';
// import CityTable from './CityTable';
// import WeatherApp from './WeatherApp';
 {/* <City/> */}
{/* <WeatherApp/> */}

//  


      {/* <Citydemo/>  CityTable*/}
const App = () => {
  return (
  
    <div>
      <Routes>
        <Route path="/" exact element={<CityTable/>} />
        <Route path="/weather/:city" element={<WeatherApp />} />
      </Routes>
    </div>
  

    
  );
};

export default App;
