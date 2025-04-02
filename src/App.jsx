// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProfilesProvider } from './context/ProfilesContext';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProfileDetails from './pages/ProfileDetails';
import React from 'react';

const App = () => {
  return (
    <ProfilesProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/profile/:id" element={<ProfileDetails />} />
        </Routes>
      </Router>
    </ProfilesProvider>
  );
};

export default App;