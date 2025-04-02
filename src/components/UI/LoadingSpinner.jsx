import React from 'react'
import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12">
      <motion.div
        className="w-16 h-16 mb-3"
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="h-full w-full border-4 border-gray-200 border-t-blue-500 rounded-full"></div>
      </motion.div>
      
      <motion.p
        className="text-gray-600 font-medium text-lg mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Loading profiles...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;