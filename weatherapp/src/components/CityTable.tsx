import  { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
interface City {
  name: string;
  population: number;
}
interface City {
  recordid: string;
  fields: {
    timezone: string;
    name: string;
    cou_name_en: string;
  };
}
const CityTable = () => {
  // const [cities, setCities] = useState([]);
  const [cities, setCities] = useState<City[]>([]);

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
  

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      setPage((prevPage: number) => prevPage + 1);
    }
  };

  const handleSearchChange = (_event: React.ChangeEvent<HTMLInputElement>, { newValue }: { newValue: string }) => {
    setSearchTerm(newValue);
  };

  const onSuggestionsFetchRequested = async ({ value }: { value: string }) => {
  try {
    const response = await axios.get<{ records: { fields: { name: string } }[] }>(`https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${value}&rows=5`);
    // Using a type assertion to inform TypeScript that response.data.records.map(...) returns an array of strings
    setSuggestions(response.data.records.map((record) => record.fields.name) as string[]);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  }
};

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const getSuggestionValue = (suggestion: string) => suggestion;

  const renderSuggestion = (suggestion: string) => (
    <div>
      <Link to={`/weather/${encodeURIComponent(suggestion)}`} target="_blank">{suggestion}</Link>
    </div>
  );

  const handleRightClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, suggestion: string) => {
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
      <br />
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
                    onClick={(e) => handleRightClick(e, city.fields.name)}
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