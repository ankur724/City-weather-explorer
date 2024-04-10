import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';

const CityTable = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
 
  useEffect(() => {
    
    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${searchTerm}&rows=20&start=${(page - 1) * 20}`);
        setCities(prevCities => [...prevCities, ...response.data.records]);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
      setLoading(false);
    };

    fetchCities();
  }, [page, searchTerm]);



  const handleScroll = (event) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleSearchChange = (event, { newValue }) => {
    

      setSearchTerm(newValue);
    
  };

  const onSuggestionsFetchRequested = async ({ value }) => {
    try {
      const response = await axios.get(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${value}&rows=5`);
      setSuggestions(response.data.records.map(record => record.fields.name));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = suggestion => suggestion;

  const renderSuggestion = suggestion => (
    <div>
      <Link to={`/weather/${encodeURIComponent(suggestion)}`} target="_blank">{suggestion}</Link>
    </div>
  );

  const handleRightClick = (event, suggestion) => {
    event.preventDefault();
    window.open(`/weather/${encodeURIComponent(suggestion)}`, '_blank');
  };

  const inputProps = {
    placeholder: 'Search by City Name',
    value: searchTerm,
    onChange: handleSearchChange
  };
return (
    
    <div className='box'>
      <h1>CityWeatherExplorer</h1>
      <br>
      </br>
      <h4>Search and Click on City name to Get Weather Information</h4>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />

      <div style={{ maxHeight: '500px', overflowY: 'scroll' }} onScroll={handleScroll}>
        <table>
          <thead>
        
            <tr>
              <th>Timezone</th>
              <th>City Name</th>
              <th>Country</th>
            </tr>
          </thead>
          <tbody>
            {cities.map(city => (
              <tr key={city.recordid}>
                <td>{city.fields.timezone}</td>
                <td>
                  <Link
                    to={`/weather/${encodeURIComponent(city.fields.name)}`}
                    target="_blank"
                    onClick={(e) => handleRightClick(e, city.fields.name)} // Code for Right-click handler
                    onContextMenu={(e) => handleRightClick(e, city.fields.name)} 
                  >
                    {city.fields.name}
                  </Link>
                </td>
                <td>{city.fields.cou_name_en}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default CityTable;
