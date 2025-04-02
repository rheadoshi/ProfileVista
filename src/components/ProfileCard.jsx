// src/components/ProfileCard.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { ProfilesContext } from '../context/ProfilesContext';

const ProfileCard = ({ profile }) => {
  const { setSelectedProfile } = useContext(ProfilesContext);

  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <img 
        src={profile.image} 
        alt={profile.name} 
        className="w-full h-48 object-cover"
      />
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{profile.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{profile.description}</p>
        
        <div className="flex justify-between items-center">
          <button 
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => setSelectedProfile(profile)}
            aria-label="Show on map"
          >
            <FaMapMarkerAlt className="mr-2" />
            Summary
          </button>
          
          <Link 
            to={`/profile/${profile.id}`}
            className="text-blue-500 hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;