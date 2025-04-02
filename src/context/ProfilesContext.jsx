// src/context/ProfilesContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ProfilesContext = createContext();

export const ProfilesProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('');

  // Load initial profiles from localStorage or API
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        // Check if we have data in localStorage first
        const savedProfiles = localStorage.getItem('profiles');
        
        if (savedProfiles) {
          // Use saved profiles if available
          setProfiles(JSON.parse(savedProfiles));
          setLoading(false);
        } else {
          // Otherwise fetch from API/mock data
          const response = await axios.get('/mock-data/profiles.json');
          const profileData = Array.isArray(response.data) ? response.data : [];
          setProfiles(profileData);
          
          // Save to localStorage for persistence
          localStorage.setItem('profiles', JSON.stringify(profileData));
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching profiles:", err);
        setError('Failed to load profiles');
        setLoading(false);
      }
    };
    
    fetchProfiles();
  }, []);

  // Update localStorage whenever profiles change
  useEffect(() => {
    if (!loading && profiles.length > 0) {
      localStorage.setItem('profiles', JSON.stringify(profiles));
    }
  }, [profiles, loading]);

  // CRUD operations for admin
  const addProfile = (profile) => {
    const newProfile = { 
      id: Date.now().toString(),
      ...profile 
    };
    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
  };

  const updateProfile = (updatedProfile) => {
    const updatedProfiles = profiles.map(p => 
      p.id === updatedProfile.id ? updatedProfile : p
    );
    setProfiles(updatedProfiles);
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
  };

  const deleteProfile = (profileId) => {
    const updatedProfiles = profiles.filter(p => p.id !== profileId);
    setProfiles(updatedProfiles);
    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
  };

  // Search and filter functionality
  const filteredProfiles = Array.isArray(profiles) ? profiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !filterLocation || 
                           profile.address.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesLocation;
  }) : [];

  return (
    <ProfilesContext.Provider value={{
      profiles: filteredProfiles,
      loading,
      error,
      selectedProfile,
      setSelectedProfile,
      searchTerm,
      setSearchTerm,
      filterLocation,
      setFilterLocation,
      addProfile,
      updateProfile,
      deleteProfile
    }}>
      {children}
    </ProfilesContext.Provider>
  );
};