import React, { FC, useEffect, useState } from "react";
import parse from "html-react-parser";
import BackButton from "../../components/BackButton";

const Departments: FC  = () => {
    const [departments, setDepartments] = useState<any>([]);
    const getDepartmentsName = async () => {
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/departments`)
          .then((data) => data.json())
          .then((response: any) => {
            setDepartments(response.data)
          })
          .catch((error) => {
            console.log("Error fetching departments:", error);
          });
      };
    
      useEffect(() => {
        getDepartmentsName()
      }, []);
  return (
    <div
      className="contentDiv scrollMiddle"
      style={{ display: "block" }}>
      <div className="backIcon">
        <BackButton />
      </div>
      <div>
        <h1>List of Departments</h1>
        {departments &&
          departments.map((item: any) => (
            <article key={item._id}>
              <h2>{item.name}</h2>
              {parse(item.description)}
            </article>
          ))}
      </div>
    </div>
  )
}

export default Departments