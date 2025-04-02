// src/pages/ProfileDetails.jsx
import React,{ useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { ProfilesContext } from '../context/ProfilesContext';
import LoadingSpinner from '../components/UI/LoadingSpinner';

// Custom map marker icon
const customIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ProfileDetails = () => {
  const { id } = useParams();
  const { profiles, loading } = useContext(ProfilesContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (profiles.length > 0) {
      const foundProfile = profiles.find(p => p.id === id);
      if (foundProfile) {
        setProfile(foundProfile);
      } else {
        setError("Profile not found");
      }
    }
  }, [id, profiles]);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => navigate('/')} 
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Back to Profiles
        </button>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        to="/" 
        className="inline-flex items-center text-blue-500 hover:text-blue-700 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Back to all profiles
      </Link>

      <motion.div 
        className="bg-white rounded-lg shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="md:flex">
          <div className="md:w-1/3">
            <img 
              src={profile.image} 
              alt={profile.name}
              className="w-full h-64 object-cover md:h-full"
            />
          </div>

          <div className="p-6 md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{profile.name}</h1>
            
            <div className="mb-6">
              <p className="text-gray-700 text-lg mb-4">{profile.description}</p>
              
              <div className="flex items-center text-gray-600 mb-2">
                <FaMapMarkerAlt className="mr-2" />
                <span>{profile.address}</span>
              </div>
              
              {profile.email && (
                <div className="flex items-center text-gray-600 mb-2">
                  <FaEnvelope className="mr-2" />
                  <a href={`mailto:${profile.email}`} className="hover:text-blue-500">
                    {profile.email}
                  </a>
                </div>
              )}
              
              {profile.phone && (
                <div className="flex items-center text-gray-600 mb-2">
                  <FaPhone className="mr-2" />
                  <a href={`tel:${profile.phone}`} className="hover:text-blue-500">
                    {profile.phone}
                  </a>
                </div>
              )}
            </div>
            
            {profile.skills && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Location</h2>
          <div className="h-[400px] w-full rounded-lg overflow-hidden shadow-md">
            <MapContainer 
              center={[profile.latitude, profile.longitude]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker 
                position={[profile.latitude, profile.longitude]}
                icon={customIcon}
              >
                <Popup>
                  <div>
                    <h3 className="font-bold">{profile.name}</h3>
                    <p>{profile.address}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileDetails;