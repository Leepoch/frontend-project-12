import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Formik, Form } from "formik";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSignupUserMutation } from "../services/chatApi.js";
// import iconSignup from '../assets/iconSignup.jpeg';

const SingupForm = () => {
  const [signupUser] = useSignupUserMutation();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Must be greater 3')
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      password: Yup.string()
        .min(6, 'Must be greater than 6')
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      confirmPassword: Yup.string()
        .min(6, 'Must be greater than 6')
        .max(20, 'Must be 20 characters or less')
        .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
        .required("Required")
    }),
    onSubmit: async () => {
      const response = await signupUser({
        username: formik.values.username,
        password: formik.values.password
      })

      if (response.error.status === 409) {
        
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
                Hexlet Chat
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
                        src=""
                        className="rounded-circle"
                        alt="Регистрация"
                      />
                    </div>
                    <form className="w-50" onSubmit={formik.handleSubmit}>
                      <h1 className="text-center mb-4">Регистрация</h1>
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
                          Имя пользователя
                        </label>
                        <div placement="right" className="invalid-tooltip">
                          Обязательное поле
                        </div>
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
                        <div className="invalid-tooltip">Обязательное поле</div>
                        <label className="form-label" htmlFor="password">
                          Пароль
                        </label>
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
                          Подтвердите пароль
                        </label>
                        {formik.touched.confirmPassword
                          && formik.errors.confirmPassword ? null : (
                            <div className="invalid-tooltip">
                              Неверные имя пользователя или пароль
                            </div>
                          )
                        }
                      </div>
                      <button
                        type="submit"
                        className="w-100 btn btn-outline-primary"
                      >
                        Зарегистрироваться
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
