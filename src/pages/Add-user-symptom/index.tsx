import React, { useEffect, useState } from 'react';
import { useAuth } from '../../services/AuthContext';
import BackButton from '../../components/BackButton';
import './user.css';
import Select from "react-select";

const AddUserSymptom = () => {
  const { user } = useAuth();
  const [thumbnail, setThumbnail] = useState(null);
  const [message, setMessage] = useState('');
  const [symptomPhoto, setSymptomPhoto] = useState(null);
  const [departmentNames, setDepartmentNames] = useState([]); 
  const [departments, setDepartments] = useState<any>([]);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    description: '',
    thumbnail: ''
  });

  const getDepartmentsName = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/departmentsName`);
      const json = await response.json();
      
      // Extract the array if it's inside an object
      const data = json.data;
      
      if (!Array.isArray(data)) {
        throw new Error('Expected data to be an array');
      }
  
      const formattedDepartments = data.map((department: string) => ({
        value: department.toLowerCase(), 
        label: department                
      }));
      
      setDepartments(formattedDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleThumbnailChange = (e: any) => {
    setThumbnail(e.target.files[0]);
  };

  const imageUpload = async () => {
    if (!thumbnail) return;
    try {
      const thumbnailFormData = new FormData();
      thumbnailFormData.append('file', thumbnail);
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: thumbnailFormData
      });
      const result = await response.json();
      setFormData({ ...formData, thumbnail: result.url });
      setSymptomPhoto(result.url);
    } catch (error) {
      console.error(error);
    }
  };

  const fileUpload = async (e: any) => {
    e.preventDefault();
    await imageUpload();
  };

  const handleDepartmentChange = (option: any) => {
    setFormData({ ...formData, department: option.value });
  };

  useEffect(() => {
    getDepartmentsName();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/symptom`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${user.token}` } : {})
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      setMessage(result.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='contentDiv scrollMiddle userSec'>
      <div className="backIcon">
        <BackButton />
      </div>
      <div>
        <h3>{message}</h3>
        <div className="loginCnr">
          <div className="leftSide"></div>
          <div className="rightSide">
            <div className="wrapper">
              <div className="title">Add a new symptom</div>
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                  <label>Symptom Name</label>
                </div>
                <div className="field">
                  <Select
                    onChange={handleDepartmentChange}
                    options={departments}
                    isSearchable={true}
                    placeholder="Select department"
                  />
                </div>
                {symptomPhoto && <strong style={{ marginTop: '10px', display: 'block', color: 'green' }}>Uploaded Successfully!</strong>}
                <div className="field">
                  <input type="file" id="thumbnail" name="thumbnail" onChange={handleThumbnailChange} />
                  <label>Symptom Photo</label>
                  <button onClick={fileUpload} className="uploadBtn">Click to Upload before submit</button>
                </div>
                <div className="field">
                  <input type="submit" value="Save" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserSymptom;
