import React, { useEffect, useState, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor 
} from 'ckeditor5';
import BackButton from '../../components/BackButton';
import { useAuth } from '../../services/AuthContext';
import './doctor.css';
import Select from "react-select";
import DOMPurify from 'dompurify';

interface SymptomDetails {
  _id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  department?: string;
}

const AddDoctorSymptom: React.FC = () => {
  const { user } = useAuth();
  const [userSymptomDetails, setUserSymptomsDetails] = useState<SymptomDetails | null>(null);
  const [userSymptoms, setUserSymptoms] = useState<SymptomDetails[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [showFrm, setShowFrm] = useState<boolean>(false);
  const [selectedDepart, setSelectedDepart] = useState<any>(null);
  const [departments, setDepartments] = useState<any>([]);
  const [formData, setFormData] = useState<any>({
    description: '',
    department: '',
  });

  // const departmentNames: any[] = useMemo(() => [], []);

  // const getDepartmentsName = async () => {
  //   try {
  //     const response = await fetch("${process.env.REACT_APP_API_BASE_URL}/api/departmentsName");
  //     const data = await response.json();
  //     const formattedDepartments = data.map((department: any) => ({
  //       value: department.toLowerCase(),
  //       label: department,
  //     }));
  //     departmentNames.push(...formattedDepartments);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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

  const handleEditorChange = (event:any, editor:any) => {
    const data = editor.getData();
    const sanitizedData = DOMPurify.sanitize(data);
    setFormData({
      ...formData,
      description: sanitizedData
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/postSymptomById/${userSymptomDetails?._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(user ? { Authorization: `Bearer ${user.token}` } : {}),
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      setShowFrm(false);
      setMessage(result.message);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getUserSymptoms = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/userSymptoms`);
      const result = await response.json();
      setUserSymptoms(result.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    getUserSymptoms();
    getDepartmentsName();
  }, [showFrm]);

  const detailView = async (id: string) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/symptom/${id}`);
      const result = await response.json();
      setUserSymptomsDetails(result.data);
      setSelectedDepart({ value: result.data.department, label: result.data.department });
      setShowFrm(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleChangeUser = (option: any) => {
    setSelectedDepart(option);
    setFormData((prevData: any) => ({
      ...prevData,
      department: option.value,
    }));
  };

  const editorConfig = useMemo(
    () => ({
      toolbar: [
        'undo', 'redo', '|',
        'heading', '|', 'bold', 'italic', '|',
        'link', 'insertTable', 'mediaEmbed', '|',
        'bulletedList', 'numberedList', 'indent', 'outdent',
      ],
      initialData: 'Write description here. To start a new paragraph just hit enter.',
    }),
    []
  );

  return (
    <div className='contentDiv scrollMiddle doctorSec' style={{ display: 'block' }}>
      <div className="backIcon">
        <BackButton />
      </div>
      <div className='userQuestion'>
        <h3>List of user asked symptoms</h3>
        {userSymptoms.map((item: SymptomDetails) => (
          <p key={item._id} onClick={() => detailView(item._id)}>{item.name}</p>
        ))}
      </div>

      <div className='userQuestionDetails'>
        {userSymptomDetails && (
          <>
            <h3>{userSymptomDetails.name}</h3>
            {userSymptomDetails.thumbnail && (
              <img
                src={`${process.env.REACT_APP_API_BASE_URL}/${userSymptomDetails.thumbnail}`}
                alt={userSymptomDetails.name}
              />
            )}
          </>
        )}
        <h3>{message}</h3>
        {showFrm && (
          <div className="wrapper">
            <div className="title">
              Add above symptom details
            </div>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <input type="text" id="name" name="name" value={userSymptomDetails?.name} readOnly />
              </div>
              <div>
                <span>
                  Patient selected department - <strong>{userSymptomDetails?.department}</strong>,
                  if wrong then choose right one below
                </span>
              </div>
              <div className="field">
                <Select
                  options={departments}
                  defaultValue={selectedDepart}
                  onChange={handleChangeUser}
                  isSearchable
                  placeholder="Select department"
                />
              </div>

              <div className="field editorFieldHeight">
                <CKEditor
                  editor={ClassicEditor}
                  config={editorConfig}
                  onChange={handleEditorChange}
                />
              </div>

              <div className="field">
                <input type="submit" value="Save" />
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDoctorSymptom;
