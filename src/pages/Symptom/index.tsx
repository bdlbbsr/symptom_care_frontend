import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import BackButton from "../../components/BackButton";
import noImage from "../../assets/no-image.svg";
import parse from "html-react-parser";

interface InfoDetails {
  _id: number;
  name: string;
  description: string;
  thumbnail: string;
  department?: string;
}

interface Doctor {
  _id: number;
  title: string;
  fname: string;
  lname: string;
  department: string;
  experienceyrs: number;
  degrees: string;
  experiences: string;
  location: string;
  photo?: string;
  city?:string
}

interface GeoInfo {
  country_name: string;
}

const Symptom = () => {
  const { name } = useParams<{ name: string }>();
  const [info, setInfo] = useState<InfoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getUserLocal = localStorage.getItem("area");
  const userArea = getUserLocal ? JSON.parse(getUserLocal) : null;
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [userLoc, setUserLoc] = useState<GeoInfo | null>(null);
  const [department, setDepartment] = useState<string | undefined>(undefined);

  const fetchInfo = async () => {
    if (!name) {
      setError("No symptom name provided");
      setLoading(false);
      return;
    }

    try {
      const searchTitle = name.replace(/-/g, " ");

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/symptomByName`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchTitle }),
      });

      const data = await response.json();

      if (data.data) {
        setInfo(data.data);
        setDepartment(data.data.department);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getGeoInfo = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      setUserLoc(data);
    } catch (error) {
      console.error("Error fetching geo info:", error);
    }
  };

  useEffect(() => {
    fetchInfo();
    getGeoInfo();
  }, [name]);

  useEffect(() => {
    document.title = info ? info.name : 'Check symptoms and consult with nearby top doctors.';
  }, [info]);

  const getDoctors = async () => {
    if (!userLoc || !department) return;

    const searchData = {
      country: userLoc.country_name,
      state: userArea?.state,
      city: userArea?.city,
      postalCode: userArea?.postalCode,
      department: department,
      experienceyrs: userArea?.experienceyrs,
    };

    try {
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
    if (userLoc && department) {
      getDoctors();
    }
  }, [userLoc, department]);

  if (loading) {
    return <div className="searchResult">Loading...</div>;
  }

  if (error) {
    return <div className="searchResult">Error: {error}</div>;
  }

  if (!info) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <div className="detailInfo scrollMiddle">
      <div className="backIcon">
        <BackButton />
      </div>
      <div className="searchCnr">
        <div className="leftColumn">
          <div className="scrollMiddle">
            <article role="button">
              <h1>{info.name}</h1>
              {info.thumbnail && (
                <figure>
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}/${info.thumbnail}`}
                    alt={info.name}
                    className="articleImg"
                  />
                </figure>
              )}
              {parse(info.description)}
            </article>
          </div>
        </div>
        <div className="rightColumn doctorsColumn scrollMiddle">
          <h3>Nearby top doctors</h3>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <div className="doctorLst" key={doctor._id}>
                <div>
                  <img
                    src={doctor.photo ? `${process.env.REACT_APP_API_BASE_URL}/${doctor.photo}` : noImage}
                    alt={doctor.fname}
                    className="doctorThumb"
                  />
                </div>
                <div>
                  <h2>{`${doctor.title} ${doctor.fname} ${doctor.lname}`}</h2>
                  <div>{`${doctor.department} - ${doctor.experienceyrs} years`}</div>
                  <div>{doctor.degrees}</div>
                  <div>{doctor.experiences}</div>
                  <div>{doctor.location}, {doctor.city}</div>
                </div>
              </div>
            ))
          ) : (
            <p>Not found any doctors in your nearby area.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Symptom;
