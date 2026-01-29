import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PlacesList from './pages/PlacesList';
import PlaceDetails from './pages/PlaceDetails';
import BusinessLogin from './pages/BusinessLogin';
import BusinessDashboard from './pages/BusinessDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<PlacesList />} />
        <Route path="/place/:id" element={<PlaceDetails />} />
        <Route path="/business" element={<BusinessLogin />} />
        <Route path="/business/dashboard" element={<BusinessDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
