import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const MainPage = () => {
  const [token, setToken] = useState(false);
  console.log(localStorage.getItem('token') ?? false);
  // useEffect(() => {
  //   setToken(localStorage.getItem("token") ?? false);

  // }, []);

  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" />;
  }
  return <div>Some text</div>;
};

export default MainPage;
