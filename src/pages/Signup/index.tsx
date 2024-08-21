import React, { useMemo, useState } from "react";
import "./signup.css";
import Select from "react-select";
import { useForm } from "react-hook-form";
import { createUser } from "../../services/AuthApi";
import countryList from 'react-select-country-list'

type FormData = {
  role: string;
  fname: string;
  lname: string;
  email: string;
  country: string;
  password: string;
  confirmPassword: string;
};

type OptionType = {
  value: string;
  label: string;
};

// const countryOptions: OptionType[] = [
//   { value: "india", label: "India" },
//   { value: "usa", label: "USA" },
//   { value: "australia", label: "Australia" },
// ];

const roleOptions: OptionType[] = [
  { value: "user", label: "User" },
  { value: "doctor", label: "Doctor" },
];

function Signup() {
  const [message, setMessage] = useState<string | null>(null);
  const [country, setCountry] = useState<any>('')
  const options = useMemo(() => countryList().getData(), [])

  const changeHandler = (value:any) => {
    setCountry(value)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>();

  const handleRoleChange = (option: OptionType | null) => {
    if (option) {
      setValue('role', option.value);
    }
  };

  // const handleCountryChange = (option: OptionType | null) => {
  //   if (option) {
  //     setValue('country', option.value);
  //   }
  // };

  const newUserRegister = async (data: FormData) => {
    try {
      const response = await createUser(data);
      setMessage(response.data);
    } catch (error) {
      console.log(error);
      setMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="contentDiv scrollMiddle signupSec">
      <div className="loginCnr">
        <div className="leftSide"></div>
        <div className="righttSide">
          <div className="wrapper">
            <div className="title">Signup</div>
            <form onSubmit={handleSubmit(newUserRegister)}>
              <div className="field">
                <Select
                  options={roleOptions}
                  onChange={handleRoleChange}
                  placeholder="Select Role"
                />
                {errors.role && <p className="errorClass">User Type is required.</p>}
              </div>

              <div className="twoColnFld">
                <div className="field">
                  <input {...register("fname", { required: true })} />
                  <label>First Name</label>
                  {errors.fname && <p className="errorClass">First Name is required</p>}
                </div>
                <div className="field">
                  <input {...register("lname", { required: true })} />
                  <label>Last Name</label>
                  {errors.lname && <p className="errorClass">Last Name is required</p>}
                </div>
              </div>

              <div className="field">
                <input
                  {...register("email", {
                    required: true,
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  })}
                />
                <label>Email</label>
                {errors.email && <p className="errorClass">Valid Email is required</p>}
              </div>

              <div className="field">
              <Select options={options} value={country} onChange={changeHandler} />

                {/* <Select
                  options={countryOptions}
                  onChange={handleCountryChange}
                  placeholder="Select Country"
                /> */}
                {errors.country && <p className="errorClass">Country is required</p>}
              </div>

              <div className="twoColnFld">
                <div className="field">
                  <input
                    {...register("password", {
                      required: true,
                      pattern: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.{6,}).*$/,
                    })}
                    type="password"
                  />
                  <label>Password</label>
                  {errors.password && <p className="errorClass">Must be 6 characters, with 1 special character and 1 number.</p>}
                </div>
                <div className="field">
                  <input
                    {...register("confirmPassword", {
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === getValues("password") || "Passwords do not match",
                    })}
                    type="password"
                  />
                  <label>Confirm Password</label>
                  {errors.confirmPassword && <p className="errorClass">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="field">
                <input type="submit" value="Signup" />
              </div>
              <div className="signup-link">
                Have an Account? <a href="/login">Login Here</a>
              </div>
            </form>
            {message && <div className="message">{message}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
