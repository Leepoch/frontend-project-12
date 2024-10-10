import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './loginForm.jsx';
import SingupForm from './signupForm.jsx';
import NotFoundPage from './notFoundPage.jsx';
import MainPage from './mainPage.jsx';

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
