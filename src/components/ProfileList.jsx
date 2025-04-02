// src/components/ProfileList.jsx
import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProfilesContext } from '../context/ProfilesContext';
import ProfileCard from './ProfileCard';
import LoadingSpinner from './UI/LoadingSpinner';
import { FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import React from 'react';
const ProfileList = ({ darkMode }) => {
  const { profiles, loading, error } = useContext(ProfilesContext);

  if (loading) return <LoadingSpinner darkMode={darkMode} />;
  
  if (error) return (
    <motion.div 
      className={`text-center p-8 rounded-xl shadow-lg ${darkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-50 text-red-500'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-center mb-4">
        <motion.div 
          className={`${darkMode ? 'bg-red-800/30' : 'bg-red-100'} p-4 rounded-full`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        >
          <FaExclamationTriangle className="w-8 h-8" />
        </motion.div>
      </div>
      <h3 className="text-lg font-medium mb-2">Error Loading Profiles</h3>
      <p>{error}</p>
    </motion.div>
  );
  
  if (profiles.length === 0) {
    return (
      <motion.div 
        className={`text-center p-12 rounded-xl shadow-lg ${
          darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border border-gray-100'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div 
          className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
            darkMode ? 'bg-gray-700/50' : 'bg-blue-50'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        >
          <FaSearch className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
        </motion.div>
        <h3 className={`text-xl font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          No profiles found
        </h3>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Try adjusting your search criteria or add some profiles from the admin panel.
        </p>
      </motion.div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence mode="popLayout">
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.4,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ y: -5 }}
            className={`${darkMode ? 'hover:shadow-blue-500/20' : 'hover:shadow-xl'} transition-shadow`}
          >
            <ProfileCard profile={profile} darkMode={darkMode} index={index} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProfileList;