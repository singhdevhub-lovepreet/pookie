import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Player } from '../../models/Player';

interface LoginScreenProps {
  onLogin: (player: Player) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('US');
  const [countries, setCountries] = useState<{ code: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch list of countries for dropdown
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        // Normally would fetch from API, but using static list for this example
        const countryList = [
          { code: 'US', name: 'United States' },
          { code: 'GB', name: 'United Kingdom' },
          { code: 'CA', name: 'Canada' },
          { code: 'AU', name: 'Australia' },
          { code: 'DE', name: 'Germany' },
          { code: 'FR', name: 'France' },
          { code: 'JP', name: 'Japan' },
          { code: 'CN', name: 'China' },
          { code: 'IN', name: 'India' },
          { code: 'BR', name: 'Brazil' },
        ];
        setCountries(countryList);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to load countries');
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    // Create player and pass to parent component
    const playerId = uuidv4();
    const player = new Player(playerId, name, country);
    
    onLogin(player);
  };

  if (isLoading) {
    return (
      <div className="login-screen">
        <div className="login-container">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="login-screen">
      <div className="login-container">
        <h2>Join the Game Lobby</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              maxLength={20}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <div className="country-selector">
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              <div className="flag-preview">
                <img 
                  src={`https://flagcdn.com/w40/${country.toLowerCase()}.png`} 
                  alt={country} 
                  width="30" 
                  height="20"
                />
              </div>
            </div>
          </div>
          
          <button type="submit" className="login-button">
            Join Game
          </button>
        </form>
      </div>
    </div>
  );
};

// CSS for this component would be in a separate file
// src/components/ui/LoginScreen.css