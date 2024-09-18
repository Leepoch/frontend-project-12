import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './loginForm.js';
import SingupForm from './signupForm.js';
import NotFoundPage from './notFoundPage.js';
import MainPage from './mainPage.js';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="login" element={<LoginForm />} />
      <Route path="/" element={<MainPage />} />
      <Route path="signup" element={<SingupForm />} />
    </Routes>
  </BrowserRouter>
);

export default App;
