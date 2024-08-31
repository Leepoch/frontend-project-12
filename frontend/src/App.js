import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login.jsx';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);

export default App;
