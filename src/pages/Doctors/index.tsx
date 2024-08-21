import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import BackButton from "../../components/BackButton";
import Select from "react-select";
import noImage from "../../assets/no-image.svg";

const Doctors = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [userLoc, setUserLoc] = useState<any>();
  const getUserLocal = localStorage.getItem("area");
  const userArea = getUserLocal ? JSON.parse(getUserLocal) : null;
  const [selectedDepart, setSelectedDepart] = useState<any>(null);
  const [departmentOptions, setDepartmentOptions] = useState<any[]>([]);

  const getGeoInfo = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      setUserLoc(data);
    } catch (error) {
      console.log("Error fetching geo info:", error);
    }
  };

  const getDepartmentsName = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/departmentsName`);
      const data = await response.json();
      const formattedDepartments = data.data.map((department: any) => ({
        value: department.toLowerCase(),
        label: department,
      }));
      setDepartmentOptions(formattedDepartments);
    } catch (error) {
      console.log("Error fetching departments:", error);
    }
  };

  const getDoctors = async () => {
    try {
      const searchData = {
        country: userLoc?.country_name || "",
        state: userArea?.state || "",
        city: userArea?.city || "",
        postalCode: userArea?.postalCode || 0,
        department: selectedDepart?.value || "",
        experienceyrs: userArea?.experienceyrs || 0,
      };

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      });
      const result = await response.json();
      setDoctors(result);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  useEffect(() => {
    getGeoInfo();
    getDepartmentsName();
  }, []);

  useEffect(() => {
    if (userLoc || selectedDepart) {
      getDoctors();
    }
  }, [selectedDepart, userLoc]);

  const handleChangeUser = (option: any) => {
    setSelectedDepart(option);
  };

  return (
    <div className="contentDiv scrollMiddle" style={{ display: "block" }}>
      <div className="backIcon">
        <BackButton />
      </div>
      <div className="loginCnr">
        <div className="leftSide">
          <h1>List of Doctors</h1>
          <div>
            <Select
              value={selectedDepart}
              onChange={handleChangeUser}
              options={departmentOptions}
              isSearchable
              placeholder="Select department"
            />
          </div>
          <div>
            {Array.isArray(doctors) && doctors.length > 0 ? (
              doctors.map((doctor: any) => (
                <div className="doctorLst" key={doctor._id}>
                  <div>
                    <img
                      src={
                        doctor.photo
                          ? `${process.env.REACT_APP_API_BASE_URL}/${doctor.photo}`
                          : noImage
                      }
                      alt={doctor.fname}
                      className="doctorThumb"
                    />
                  </div>
                  <div>
                    <h2>
                      {doctor.title} {doctor.fname} {doctor.lname}
                    </h2>
                    <div>
                      {doctor.department} - {doctor.experienceyrs} years
                    </div>
                    <div>{doctor.degrees}</div>
                    <div>{doctor.experiences}</div>
                    <div>{doctor.location}, {doctor.city}</div>
                  </div>
                </div>
              ))
            ) : (
              <p>No doctors found.</p>
            )}
          </div>
        </div>
        <div className="righttSide">
          <a
            href="departments"
            className="uploadBtn"
            style={{ marginTop: "3rem" }}>
            Check out all the Departments
          </a>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
