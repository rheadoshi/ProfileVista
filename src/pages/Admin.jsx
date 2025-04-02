// src/pages/Admin.jsx
import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { ProfilesContext } from '../context/ProfilesContext';
import MapboxAutocomplete from '../components/MapboxAutocomplete';

const Admin = () => {
  const { profiles, addProfile, updateProfile, deleteProfile } = useContext(ProfilesContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    image: '',
    email: '',
    phone: '',
    skills: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!currentProfile.latitude || !currentProfile.longitude) {
      alert('Please select a valid address with coordinates');
      return;
    }
    
    if (isEditing) {
      updateProfile(currentProfile);
    } else {
      addProfile(currentProfile);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setIsModalOpen(false);
    setCurrentProfile({
      name: '',
      description: '',
      address: '',
      latitude: '',
      longitude: '',
      image: '',
      email: '',
      phone: '',
      skills: []
    });
    setSkillInput('');
    setIsEditing(false);
  };

  const handleEdit = (profile) => {
    setCurrentProfile({
      ...profile,
      skills: profile.skills || []
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      deleteProfile(id);
    }
  };

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    
    setCurrentProfile({
      ...currentProfile,
      skills: [...(currentProfile.skills || []), skillInput.trim()]
    });
    
    setSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setCurrentProfile({
      ...currentProfile,
      skills: currentProfile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleCoordinatesChange = (lat, lng) => {
    setCurrentProfile({
      ...currentProfile,
      latitude: lat,
      longitude: lng
    });
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Profile Management</h1>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="mr-2" />
            Add Profile
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Image</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left hidden md:table-cell">Address</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-500">
                    No profiles available. Add your first profile!
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <motion.tr 
                    key={profile.id} 
                    className="border-t"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <td className="py-3 px-4">
                      <img 
                        src={profile.image} 
                        alt={profile.name} 
                        className="h-10 w-10 rounded-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                        }}
                      />
                    </td>
                    <td className="py-3 px-4">{profile.name}</td>
                    <td className="py-3 px-4 hidden md:table-cell max-w-xs truncate">{profile.address}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                          onClick={() => handleEdit(profile)}
                        >
                          <FaEdit />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                          onClick={() => handleDelete(profile.id)}
                        >
                          <FaTrash />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal for adding/editing profiles */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <h2 className="text-xl font-bold">
                  {isEditing ? 'Edit Profile' : 'Add New Profile'}
                </h2>
                <button 
                  onClick={resetForm}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={currentProfile.name}
                      onChange={(e) => setCurrentProfile({...currentProfile, name: e.target.value})}
                      className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Image URL</label>
                    <input
                      type="text"
                      value={currentProfile.image}
                      onChange={(e) => setCurrentProfile({...currentProfile, image: e.target.value})}
                      className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    value={currentProfile.description}
                    onChange={(e) => setCurrentProfile({...currentProfile, description: e.target.value})}
                    className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                  />
                </div>
                
                <MapboxAutocomplete 
                  value={currentProfile.address}
                  onChange={(address) => setCurrentProfile({...currentProfile, address})}
                  onCoordinatesChange={handleCoordinatesChange}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={currentProfile.email || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, email: e.target.value})}
                      className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      value={currentProfile.phone || ''}
                      onChange={(e) => setCurrentProfile({...currentProfile, phone: e.target.value})}
                      className="w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Skills</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      className="w-full border rounded-l-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter a skill"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentProfile.skills && currentProfile.skills.map((skill, index) => (
                      <motion.span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 text-blue-800 hover:text-blue-900"
                        >
                          ×
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </div>

                {currentProfile.latitude && currentProfile.longitude && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">
                    ✓ Coordinates set: {currentProfile.latitude.toFixed(6)}, {currentProfile.longitude.toFixed(6)}
                  </div>
                )}
                
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <motion.button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
                    onClick={resetForm}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaTimes className="inline mr-2" />
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaSave className="inline mr-2" />
                    {isEditing ? 'Save Changes' : 'Add Profile'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Admin;