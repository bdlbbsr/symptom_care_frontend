import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  useMatch,
  Link,
} from "react-router-dom";
import BackButton from '../../components/BackButton';

interface InfoDetails {
  _id: number;
  title: string;
  description: string;
  // Add other fields if needed
}

const Info = () => {
  const { id } = useParams<{ id: string }>();
  const [info, setInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/symptom/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch info");
        }
        const data = await response.json();
        setInfo(data.data);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [id]);



  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!info) {
    return <div>No information available</div>;
  }

  return (
    <div className="searchResultDiv">

      <div className="backIcon">
      <BackButton />
      </div>
<div className="scrollMiddle">
      <h2>{info.title}</h2>
      <p>{info.description}</p>
      {/* Render other fields if needed */}
    </div>
    </div>
  );
};

export default Info;
