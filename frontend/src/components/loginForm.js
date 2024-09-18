import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useGetTokenMutation } from '../services/userApi.js';
import iconLogin from '../assets/iconLogin.jpeg';

const LoginForm = () => {
  const dispatch = useDispatch();
  const [isValid, setValid] = useState('form-control');
  const token = localStorage.getItem('token');
  const [getToken, { error: getTokenError }] = useGetTokenMutation();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Required'),
      password: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
    }),
    onSubmit: () => {
      setValid(
        formik.touched.username && formik.errors.username && !token
          ? 'form-control'
          : 'form-control is-invalid',
      );
      getToken({
        username: formik.values.username,
        password: formik.values.password,
      });
    },
  });
  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                Hexlet Chat
              </a>
            </div>
          </nav>
          <div className="container-fluid h-100">
            <div className="row justify-content-center align-content-center h-100">
              <div className="col-12 col-md-8 col-xxl-6">
                <div className="card shadow-sm">
                  <div className="card-body row p-5">
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                      <img
                        src={iconLogin}
                        className="rounded-circle"
                        alt="Войти"
                      />
                    </div>
                    <form
                      className="col-12 col-md-6 mt-3 mt-md-0"
                      onSubmit={formik.handleSubmit}
                    >
                      <h1 className="text-center mb-4">Войти</h1>
                      <div className="form-floating mb-3">
                        <input
                          name="username"
                          autoComplete="username"
                          required=""
                          placeholder="Ваш ник"
                          id="username"
                          className={isValid}
                          onChange={formik.handleChange}
                          value={formik.values.username}
                        />
                        <label htmlFor="username">Ваш ник</label>
                      </div>
                      <div className="form-floating mb-4">
                        <input
                          name="password"
                          autoComplete="current-password"
                          required=""
                          placeholder="Пароль"
                          type="password"
                          id="password"
                          className={isValid}
                          onChange={formik.handleChange}
                          value={formik.values.password}
                        />
                        <label className="form-label" htmlFor="password">
                          Пароль
                        </label>
                        {formik.touched.username
                        && formik.errors.username ? null : (
                          <div className="invalid-tooltip">
                            Неверные имя пользователя или пароль
                          </div>
                          )}
                      </div>
                      <button
                        type="submit"
                        className="w-100 mb-3 btn btn-outline-primary"
                      >
                        Войти
                      </button>
                    </form>
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>Нет аккаунта?</span>
                      <a href="/signup">Регистрация</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="Toastify" />
      </div>
    </div>
  );
};

export default LoginForm;
