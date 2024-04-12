
import CityTable from './components/CityTable';

import WeatherApp from './components/WeatherApp';
import { Route, Routes } from "react-router-dom";
const App = () => {
  return (
  
    <div>
      <Routes>
        <Route path="/" element={<CityTable/>} />
    
        <Route path="/weather/:city" element={<WeatherApp />} />
      </Routes>
    </div>
  

    
  );
};

export default App;
