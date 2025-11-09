import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Register from './pages/Register';
import Login from './pages/Login';
import PublicProfile from './pages/PublicProfile';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Agenda from './pages/Agenda';
import Patients from './pages/Patients';
import Pricing from './pages/Pricing';
import { Toaster } from './components/ui/sonner';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('therapycare_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/praticien/:id" element={<PublicProfile />} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/agenda" replace />} />
            <Route path="agenda" element={<Agenda />} />
            <Route path="profil" element={<Profile />} />
            <Route path="patients" element={<Patients />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;