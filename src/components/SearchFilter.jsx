// src/components/SearchFilter.jsx
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
import { ProfilesContext } from '../context/ProfilesContext';
import React from 'react';
const SearchFilter = () => {
  const { searchTerm, setSearchTerm, filterLocation, setFilterLocation } = useContext(ProfilesContext);

  return (
    <motion.div 
      className="bg-white p-4 rounded-lg shadow-md mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search profiles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="relative flex-1">
          <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by location..."
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SearchFilter;