import React from 'react';
import ReactDOM, { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Customer/Homepage';
import LoginPage from './pages/LoginPage';
import HotelierHomepage from './pages/Hotelier/HotelierHomepage';
import AdminLoginPage from './pages/Admin/AdminLoginPage';
import AdminHomepage from './pages/Admin/AdminHomepage';
import HotelierGroups from './pages/Admin/HotelierGroups';
import AdminBookedStays from './pages/Admin/AdminBookedStays';
import AdminHotels from './pages/Admin/AdminHotels';
import HotelierHotels from './pages/Hotelier/HotelierHotels';
import CreateHotel from './pages/Hotelier/CreateHotel';
import CreateRoom from './pages/Hotelier/CreateRoom';
import ViewBookings from './pages/Customer/ViewBookings';
import BookRooms from './pages/Customer/BookRooms';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='/*' element={<Homepage />} />
      <Route path='homepage' element={<Homepage />} />
      <Route path='loginpage' element={<LoginPage />} />
      <Route path='viewBookings' element={<ViewBookings />} />
      <Route path='bookRooms' element={<BookRooms />} />
      <Route path='hotelierHomepage' element={<HotelierHomepage />} />
      <Route path='hotelierHotels' element={<HotelierHotels />} />
      <Route path='createHotel' element={<CreateHotel />} />
      <Route path='createRoom' element={<CreateRoom />} />
      <Route path='adminLogin' element={<AdminLoginPage />} />
      <Route path='adminHomepage' element={<AdminHomepage />} />
      <Route path='hotelierGroups' element={<HotelierGroups />} />
      <Route path='adminBookedStays' element={<AdminBookedStays />} />
      <Route path='adminHotels' element={<AdminHotels />} />
      
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
