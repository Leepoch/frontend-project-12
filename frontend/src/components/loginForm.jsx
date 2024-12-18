import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useGetTokenMutation } from '../services/chatApi.jsx';
import iconLogin from '../assets/iconLogin.jpeg';

const LoginForm = () => {
  const navigate = useNavigate();

  const { t } = useTranslation();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, []);

  const [valid, setValid] = useState('form-control');
  const [getToken] = useGetTokenMutation();

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
      localStorage.setItem('username', formik.values.username);
      setValid(
        formik.touched.username && formik.errors.username
          ? 'form-control is-invalid'
          : 'form-control',
      );
      getToken({
        username: formik.values.username,
        password: formik.values.password,
      }).unwrap().then((fulfilled) => {
        localStorage.setItem('token', fulfilled.token);
        navigate('/');
      }).catch(() => setValid('form-control is-invalid'));
    },
  });

  return (
    <div className="h-100">
      <div className="h-100" id="chat">
        <div className="d-flex flex-column h-100">
          <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
            <div className="container">
              <a className="navbar-brand" href="/">
                {t('hexletTextLogo')}
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
                      <h1 className="text-center mb-4">{t('loginForm.login')}</h1>
                      <div className="form-floating mb-3">
                        <input
                          name="username"
                          autoComplete="username"
                          required=""
                          placeholder="Ваш ник"
                          id="username"
                          className={valid}
                          onChange={formik.handleChange}
                          value={formik.values.username}
                        />
                        <label htmlFor="username">{t('loginForm.yourNick')}</label>
                      </div>
                      <div className="form-floating mb-4">
                        <input
                          name="password"
                          autoComplete="current-password"
                          required=""
                          placeholder="Пароль"
                          type="password"
                          id="password"
                          className={valid}
                          onChange={formik.handleChange}
                          value={formik.values.password}
                        />
                        <label className="form-label" htmlFor="password">
                          {t('password')}
                        </label>
                        {formik.touched.username
                          && formik.errors.username ? null : (
                            <div className="invalid-tooltip">
                              {t('loginForm.wrongNameOrPassword')}
                            </div>
                          )}
                      </div>
                      <button
                        type="submit"
                        className="w-100 mb-3 btn btn-outline-primary"
                      >
                        {t('loginForm.login')}
                      </button>
                    </form>
                  </div>
                  <div className="card-footer p-4">
                    <div className="text-center">
                      <span>{`${t('loginForm.haveAccount')} `}</span>
                      <a href="/signup">
                        {t('registration')}
                      </a>
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
