// src/components/MapboxAutocomplete.jsx
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const API_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

const MapboxAutocomplete = ({ value = '', onChange, onCoordinatesChange }) => {
  const [address, setAddress] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef(null);
  const wrapperRef = useRef(null);

  // Update internal state when prop changes
  useEffect(() => {
    setAddress(value);
  }, [value]);

  // Handle clicks outside to close suggestions dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions when address input changes
  const fetchSuggestions = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/${encodeURIComponent(query)}.json`, {
          params: {
            access_token: MAPBOX_TOKEN,
            autocomplete: true,
            types: 'address,place',
            limit: 5
          }
        }
      );
      
      setSuggestions(response.data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setAddress(value);
    
    // Update parent component
    if (onChange) {
      onChange(value);
    }
    
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set a new timeout to fetch suggestions
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    const placeName = suggestion.place_name;
    const [longitude, latitude] = suggestion.center;
    
    setAddress(placeName);
    setShowSuggestions(false);
    
    // Update parent component with address
    if (onChange) {
      onChange(placeName);
    }
    
    // Update coordinates
    if (onCoordinatesChange) {
      onCoordinatesChange(latitude, longitude);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">Address</label>
      <div ref={wrapperRef} className="relative w-full">
        <div className="relative">
          <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={address}
            onChange={handleInputChange}
            onFocus={() => address.length >= 3 && setShowSuggestions(true)}
            placeholder="Enter an address"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {isLoading && (
            <FaSpinner className="absolute right-3 top-3 text-gray-400 animate-spin" />
          )}
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-50"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-3 h-5 w-5 text-gray-400" />
                  <span className="block truncate">{suggestion.place_name}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MapboxAutocomplete;