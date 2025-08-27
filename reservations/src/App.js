import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // npm install react-router-dom
import './App.css';
import Navbar from './components/Navbar';
import CreateReservation from './components/CreateReservation';
import ManageReservation from './components/ManageReservation';
import ReservationList from './components/ReservationList';
 
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path={"/"} element={<ReservationList />} />
          <Route path={"/create-reservation"} element={<CreateReservation/>} />
          <Route path={"/reservation/:resID"} element={<ManageReservation />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
 
export default App;