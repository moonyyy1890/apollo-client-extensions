import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COUNTRY } from '../graphql/queries';
import type { Country, GetCountryQuery, GetCountryVariables } from '../graphql/types';
import './CountryCard.css';

interface CountryCardProps {
  country: Country;
}

const CountryCard = ({ country }: CountryCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { loading, error, data } = useQuery<GetCountryQuery, GetCountryVariables>(
    GET_COUNTRY,
    {
      variables: { code: country.code },
      skip: !showDetails, // Only fetch when details are requested
    }
  );

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="country-card">
      <div className="country-header">
        <span className="country-emoji">{country.emoji}</span>
        <div>
          <h3>{country.name}</h3>
          <p className="country-code">{country.code}</p>
        </div>
      </div>
      
      <div className="country-info">
        <p><strong>Capital:</strong> {country.capital || 'N/A'}</p>
        <p><strong>Currency:</strong> {country.currency || 'N/A'}</p>
      </div>

      <button 
        className="details-button"
        onClick={handleToggleDetails}
        disabled={loading}
      >
        {loading ? 'Loading...' : showDetails ? 'Hide Details' : 'Show Details'}
      </button>

      {showDetails && (
        <div className="country-details">
          {error && <p className="error">Error: {error.message}</p>}
          {data?.country?.languages && (
            <div className="languages">
              <strong>Languages:</strong>
              <ul>
                {data.country.languages.map((lang) => (
                  <li key={lang.code}>{lang.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CountryCard;
