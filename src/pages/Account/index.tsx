import React, { FC, useEffect, useState } from "react";
import { useAuth } from "../../services/AuthContext";
import { Navigate, NavLink } from "react-router-dom";
import { useForm } from 'react-hook-form';
import BackButton from "../../components/BackButton";
import './account.css';

interface UserDetails {
  _id: string;
  title: string;
  fname: string;
  lname: string;
  email: string;
  country: string;
  location: string;
  gender: string;
  state: string;
  city: string;
  street: string;
  postalCode: string;
  mobile: string;
  department: string;
  experienceyrs: string;
  degrees: string;
  experiences: string;
  password: string;
  role: string;
}

interface FormData {
  title: string;
  state: string;
  city: string;
  postalCode: string;
  location: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  department: string;
  experienceyrs: string;
  degrees: string;
  experiences: string;
}

const Acount: FC = () => {
  const { user } = useAuth();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);

  const userId = user?.userId;
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
  const password = watch('password');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(user ? { Authorization: `Bearer ${user.token}` } : {})
          }
        });
        const result = await response.json();
        setUserDetails(result);
        localStorage.setItem("area", JSON.stringify(result));
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (userId) fetchUserDetails();
  }, [userId, user]);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setThumbnail(e.target.files[0]);
  };

  const imageUpload = async () => {
    if (thumbnail) {
      const formData = new FormData();
      formData.append('file', thumbnail);

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        });
        const result = await response.json();
        setUserPhoto(result.url);
      } catch (error) {
        console.error('Image upload error:', error);
      }
    }
  };

  const updateUserDetails = async (data: FormData) => {
    const updatedData = { ...data, photo: userPhoto };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/updateUser/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify(updatedData),
      });

      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error('Error updating user details:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      <Navigate to="/login" replace={true} />;
    }
  }, [user]);

  return (
    <div className="contentDiv scrollMiddle accountSec">
      <div className="backIcon">
        <BackButton />
      </div>

      <div className="loginCnr">
        <div className="leftSide">
          <h1>Action</h1>
          {user && user.role === 'admin' && <NavLink to="/add-symptom">Add Symptom</NavLink>}
          {user && user.role === 'user' && <NavLink to="/add-symptom-name">Add Symptom</NavLink>}
          {user && user.role === 'doctor' && <NavLink to="/add-symptom-description">Add Symptom</NavLink>}
          <h3>Account details</h3>
          {userDetails && (
            <>
              Role - {userDetails.role} <br />
              Title - {userDetails.title} <br />
              First Name - {userDetails.fname} <br />
              Last Name - {userDetails.lname} <br />
              Email - {userDetails.email} <br />
              Country - {userDetails.country} <br />
              State - {userDetails.state} <br />
              City - {userDetails.city} <br />
              Postal Code - {userDetails.postalCode} <br />
              Location - {userDetails.location} <br />
              Mobile - {userDetails.mobile} <br />
              Department of Study - {userDetails.department} <br />
              Total Experience - {userDetails.experienceyrs} <br />
              Degrees - {userDetails.degrees} <br />
              Experiences - {userDetails.experiences} <br />
            </>
          )}
        </div>

        <div className="rightSide">
          <div className="wrapper">
            <div className="title">Update your profile</div>
            <form onSubmit={handleSubmit(updateUserDetails)}>
              <div className="twoColnFld">
                <div className="field">
                  <input {...register('title')} placeholder=" " />
                  <label>Title</label>
                </div>
                <div className="field">
                  <input {...register('state')} placeholder=" " />
                  <label>State</label>
                </div>
              </div>

              <div className="twoColnFld">
                <div className="field">
                  <input {...register('city')} placeholder=" " />
                  <label>City</label>
                </div>
                <div className="field">
                  <input {...register('postalCode')} placeholder=" " />
                  <label>Postal Code</label>
                </div>
              </div>

              {user && user.role === 'doctor' && (
                <>
                  <div className="twoColnFld">
                    <div className="field">
                      <input {...register('mobile')} placeholder=" " />
                      <label>Phone</label>
                    </div>
                    <div className="field">
                      <input {...register('department')} placeholder=" " />
                      <label>Department of Study</label>
                    </div>
                  </div>

                  <div className="twoColnFld">
                    <div className="field">
                      <input {...register('experienceyrs')} placeholder=" " />
                      <label>Total Years of Experience</label>
                    </div>
                    <div className="field">
                      <input {...register('degrees')} placeholder="e.g., MD - Internal Medicine" />
                      <label>Degree with Specialisation</label>
                    </div>
                  </div>

                  <div className="field">
                    <input {...register('experiences')} placeholder="e.g., Asst Prof in AIIMS, Delhi" />
                    <label>Past Experiences</label>
                  </div>
                  <div className="field">
                    <input {...register('location')} placeholder="Where people can go for consultation" />
                    <label>Current Location</label>
                  </div>
                </>
              )}

              {userPhoto && (
                <strong style={{ marginTop: '10px', display: 'block', color: 'green' }}>
                  Uploaded Successfully!
                </strong>
              )}

              <div className="field">
                <input type="file" id="thumbnail" name="thumbnail" onChange={handleThumbnailChange} />
                <label>Your Photo</label>
                <button onClick={(e) => { e.preventDefault(); imageUpload(); }} className="uploadBtn">
                  Click to Upload before submit
                </button>
              </div>

              <div className="twoColnFld">
                <div className="field">
                  <input
                    {...register('password', {
                      pattern: {
                        value: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.{6,}).*$/,
                        message: 'Password must be at least 6 characters long, include one special character and one number.'
                      }
                    })}
                    type="password"
                    placeholder=" "
                  />
                  {errors.password && <p className="errorMsg">{errors.password.message}</p>}
                  <label>Password</label>
                </div>

                <div className="field">
                  {password && (
                    <>
                      <input
                        {...register('confirmPassword', {
                          required: 'Confirm password is required',
                          validate: value => value === password || 'Passwords do not match'
                        })}
                        type="password"
                        placeholder=" "
                      />
                      {errors.confirmPassword && <p className="errorMsg">{errors.confirmPassword.message}</p>}
                      <label>Confirm Password</label>
                    </>
                  )}
                </div>
              </div>

              <div className="field btn">
                <div className="btn-layer"></div>
                <input type="submit" value="Update" />
              </div>
              {message && <p>{message}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Acount;
