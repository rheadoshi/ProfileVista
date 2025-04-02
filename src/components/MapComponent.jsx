// src/components/MapComponent.jsx
import React ,{ useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { Icon } from 'leaflet';
import { useContext } from 'react';
import { ProfilesContext } from '../context/ProfilesContext';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import { FaMapMarkerAlt, FaUser, FaSpinner } from 'react-icons/fa';

// Custom marker icons
const createCustomIcon = (color) => {
  return new Icon({
    iconUrl: `https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const defaultIcon = createCustomIcon('blue');
const selectedIcon = createCustomIcon('red');

const MapComponent = ({ darkMode }) => {
  const { selectedProfile, profiles } = useContext(ProfilesContext);
  const [mapKey, setMapKey] = useState(Date.now());
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapContainerRef = useRef(null);
  
  // Default center if no profile is selected
  const defaultPosition = [40.7128, -74.0060]; // New York
  const zoom = selectedProfile ? 13 : 3;
  
  const mapCenter = selectedProfile 
    ? [selectedProfile.latitude, selectedProfile.longitude]
    : defaultPosition;

  // Force map re-initialization when selectedProfile changes
  useEffect(() => {
    setMapKey(Date.now());
    setMapLoaded(false);
  }, [selectedProfile]);

  // Map style based on dark mode
  const mapStyle = darkMode 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const mapAttribution = darkMode
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <motion.div 
      ref={mapContainerRef}
      className={`relative h-[500px] w-full rounded-xl overflow-hidden shadow-lg ${
        darkMode ? 'shadow-blue-500/10' : 'shadow-lg'
      }`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-opacity-75 bg-gray-900">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <FaSpinner className={`animate-spin h-10 w-10 mx-auto mb-2 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
            <p className={`${darkMode ? 'text-gray-300' : 'text-white'} font-medium`}>Loading map...</p>
          </motion.div>
        </div>
      )}

      <MapContainer 
        key={mapKey}
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        whenCreated={() => setMapLoaded(true)}
      >
        <TileLayer
          url={mapStyle}
          attribution={mapAttribution}
        />
        <ZoomControl position="bottomright" />
        
        {selectedProfile ? (
          <Marker 
            position={[selectedProfile.latitude, selectedProfile.longitude]} 
            icon={selectedIcon}
            key={selectedProfile.id}
          >
            <Popup className={`${darkMode ? 'dark-popup' : ''}`}>
              <div className="text-center p-1">
                <img 
                  src={selectedProfile.image} 
                  alt={selectedProfile.name}
                  className="w-16 h-16 rounded-full mx-auto mb-2 object-cover border-2 border-blue-500"
                />
                <h3 className="font-bold text-blue-700">{selectedProfile.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{selectedProfile.address}</p>
              </div>
            </Popup>
          </Marker>
        ) : (
          profiles.map(profile => (
            <Marker 
              key={profile.id} 
              position={[profile.latitude, profile.longitude]}
              icon={defaultIcon}
            >
              <Popup className={`${darkMode ? 'dark-popup' : ''}`}>
                <div className="text-center p-1">
                  <img 
                    src={profile.image} 
                    alt={profile.name}
                    className="w-12 h-12 rounded-full mx-auto mb-2 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=Profile';
                    }}
                  />
                  <h3 className="font-bold">{profile.name}</h3>
                  <p className="text-gray-600 text-sm">{profile.address}</p>
                </div>
              </Popup>
            </Marker>
          ))
        )}
      </MapContainer>

      {/* Map legend */}
      <div className={`absolute bottom-4 left-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-3 rounded-lg shadow-lg z-[1000]`}>
        <div className={`text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {selectedProfile ? 'Selected Profile' : 'All Profiles'}
        </div>
        <div className="flex items-center">
          <FaMapMarkerAlt className={selectedProfile ? 'text-red-500' : 'text-blue-500'} />
          <span className={`ml-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {profiles.length} {profiles.length === 1 ? 'profile' : 'profiles'} on map
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MapComponent;