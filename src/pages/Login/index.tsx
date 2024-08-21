import React from "react";
import "./login.css";
import { useForm } from 'react-hook-form';
import { useAuth } from '../../services/AuthContext';
import { Navigate } from "react-router-dom";

function Login() {
  const { login, user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const userLogin = async (data: any) => {
    login(data); // Ensure this method handles the login and state update correctly
  }

  if (user) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="contentDiv scrollMiddle loginSec">
      <div className="loginCnr">
        <div className="leftSide">
          {/* Add any left side content if needed */}
        </div>
        <div className="righttSide">
          <div className="wrapper">
            <div className="title">Login Form</div>
            <form onSubmit={handleSubmit(userLogin)}>
              <div className="field">
                <input
                  type="text"
                  {...register('email', {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Invalid email address"
                    }
                  })}
                />
                <label>Email Address</label>
                {errors.email && <p className="errorClass">Email address required.</p>}
              </div>
              <div className="field">
                <input
                  type="password"
                  {...register('password', {
                    required: "Password is required",
                    pattern: {
                      value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.{6,}).*$/,
                      message: "Must be 6 characters long, with at least 1 special character and 1 number"
                    }
                  })}
                />
                <label>Password</label>
                {errors.password && <p className="errorClass">Must be 6 characters, with 1 special character and 1 number. </p>}
              </div>
              <div className="field">
                <input type="submit" value="Login" />
              </div>
              <div className="signup-link">
                Not a member? <a href="/register">Signup now</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
