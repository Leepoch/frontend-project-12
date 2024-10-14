import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useSignupUserMutation } from '../services/chatApi.jsx';
import iconLogin from '../assets/iconLogin.jpeg';

const SingupForm = () => {
  const [signupUser] = useSignupUserMutation();
  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'incorrect length')
        .max(15, 'incorrect length')
        .required('required'),
      password: Yup.string()
        .min(6, 'incorrect length')
        .required('required'),
      confirmPassword: Yup.string()
        .min(6, 'incorrect length')
        .oneOf([Yup.ref('password')], 'passwords must match')
        .required('required'),
    }),
    onSubmit: async () => {
      const response = await signupUser({
        username: formik.values.username,
        password: formik.values.password,
      });
      if (response.error?.status === 409) {
        setUserExists(true);
      } else if (!response.error) {
        navigate('/login');
      }
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
                  <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
                    <div>
                      <img
                        src={iconLogin}
                        className="rounded-circle"
                        alt="Регистрация"
                      />
                    </div>
                    <form className="w-50" onSubmit={formik.handleSubmit}>
                      <h1 className="text-center mb-4">{t('registration')}</h1>
                      <div className="form-floating mb-3">
                        <input
                          placeholder="От 3 до 20 символов"
                          name="username"
                          autoComplete="username"
                          required=""
                          id="username"
                          className="form-control"
                          value={formik.values.username}
                          onChange={formik.handleChange}
                        />
                        <label className="form-label" htmlFor="username">
                          {t('signupForm.username')}
                        </label>
                        {
                          (formik.errors.username === 'required')
                          && formik.touched.username
                            ? <div>{t('signupForm.requiredField')}</div> : null
                        }
                        {
                          (formik.errors.username === 'incorrect length')
                          && formik.touched.username
                            ? <div>{t('signupForm.wrongLength')}</div> : null
                        }
                        {userExists ? <div>{t('signupForm.userAlreadyExists')}</div> : null}
                      </div>
                      <div className="form-floating mb-3">
                        <input
                          placeholder="Не менее 6 символов"
                          name="password"
                          aria-describedby="passwordHelpBlock"
                          required=""
                          autoComplete="new-password"
                          type="password"
                          id="password"
                          className="form-control"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                        />
                        <div className="invalid-tooltip">{t('signupForm.requiredField')}</div>
                        <label className="form-label" htmlFor="password">
                          {t('password')}
                        </label>
                        {
                          (formik.errors.password === 'required')
                          && formik.touched.password
                            ? <div>{t('signupForm.requiredField')}</div> : null
                        }
                        {
                          (formik.errors.password === 'incorrect length')
                          && formik.touched.password
                            ? <div>{t('signupForm.sixSymbols')}</div> : null
                        }
                      </div>
                      <div className="form-floating mb-4">
                        <input
                          placeholder="Пароли должны совпадать"
                          name="confirmPassword"
                          required=""
                          autoComplete="new-password"
                          type="password"
                          id="confirmPassword"
                          className="form-control"
                          value={formik.values.confirmPassword}
                          onChange={formik.handleChange}
                        />
                        <div className="invalid-tooltip" />
                        <label className="form-label" htmlFor="confirmPassword">
                          {t('signupForm.confirmPassword')}
                        </label>
                        {
                          (formik.errors.confirmPassword === 'passwords must match')
                          && formik.touched.confirmPassword
                            ? <div>{t('signupForm.passwordsDontMatch')}</div> : null
                        }
                      </div>
                      <button
                        type="submit"
                        className="w-100 btn btn-outline-primary"
                      >
                        {t('signupForm.register')}
                      </button>
                    </form>
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

export default SingupForm;
