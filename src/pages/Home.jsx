// // src/pages/Home.jsx
// import { motion } from 'framer-motion';
// import ProfileList from '../components/ProfileList';
// import MapComponent from '../components/MapComponent';
// import SearchFilter from '../components/SearchFilter';
// import React from 'react';

// const Home = () => {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <motion.h1 
//         className="text-3xl font-bold text-center mb-8"
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         Profile Explorer
//       </motion.h1>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div>
//           <SearchFilter />
//           <ProfileList />
//         </div>
        
//         <div className="sticky top-6">
//           <MapComponent />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;

// src/pages/Home.jsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import ProfileList from '../components/ProfileList';
import MapComponent from '../components/MapComponent';
import SearchFilter from '../components/SearchFilter';
import { FaMoon, FaSun, FaMapMarkedAlt, FaUserFriends } from 'react-icons/fa';
import React from 'react';

const Home = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className={`bg-gradient-to-r ${darkMode ? 'from-purple-600 to-blue-600' : 'from-blue-500 to-indigo-600'} p-3 rounded-full mr-4 shadow-lg`}
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaMapMarkedAlt className="text-white text-2xl" />
            </motion.div>
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Profile Explorer
              </h1>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                Discover people and their locations
              </p>
            </div>
          </motion.div>
          
          <motion.button
            className={`p-3 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-300' : 'bg-white text-gray-800'} shadow-md`}
            onClick={() => setDarkMode(!darkMode)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </motion.button>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <SearchFilter darkMode={darkMode} />
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className={`flex items-center mb-4 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
              <FaUserFriends className="mr-2" />
              <h2 className="text-xl font-semibold">Profiles</h2>
            </div>
            <ProfileList darkMode={darkMode} />
          </motion.div>
          
          <motion.div 
            className="lg:col-span-3 sticky top-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-2xl shadow-lg`}>
              <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-blue-300' : 'text-blue-700'} flex items-center`}>
                <FaMapMarkedAlt className="mr-2" />
                Interactive Map
              </h2>
              <MapComponent darkMode={darkMode} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;