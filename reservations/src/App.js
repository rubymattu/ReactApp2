import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import './App.css';
import Navbar from './components/Navbar';
import CreateReservation from './components/CreateReservation';
import ManageReservation from './components/ManageReservation';
import ReservationList from './components/ReservationList';
import Register from './components/Register';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
 
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path={"/"} element={<ProtectedRoute><ReservationList /></ProtectedRoute>} />
          <Route path={"/create-reservation"} element={<ProtectedRoute><CreateReservation/></ProtectedRoute>} />
          <Route path={"/reservation/:resID"} element={<ProtectedRoute><ManageReservation /></ProtectedRoute>} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}
 
export default App;