import React, { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useLocation,
  useMatch,
  Link,
} from "react-router-dom";

interface infoFields {
  _id: number;
  title: string;
  description: string;
  // Add other fields if needed
}

function Info() {
  //const navigate = useNavigate();
  //const params = useParams();
  const { id } = useParams();
  const [result, setResult] = useState<any>({});

  async function searchRes() {
    const rawResponse = await fetch(`http://localhost:8080/api/symptom/${id}`, {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await rawResponse.json();
    setResult(data.data);
    return data.data;
  }

  console.log("first", result);

  ///symptom/:id
  useEffect(() => {
    searchRes();
  }, []);

  return (
    <div className="searchResultDiv">

      <div className="backIcon">
        <Link to="/search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            className="bi bi-arrow-left-square-fill"
            viewBox="0 0 16 16">
            <path d="M16 14a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2zm-4.5-6.5H5.707l2.147-2.146a.5.5 0 1 0-.708-.708l-3 3a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .708-.708L5.707 8.5H11.5a.5.5 0 0 0 0-1" />
          </svg>
        </Link>
      </div>
<div className="scrollMiddle">
      <h1>{result.title}</h1>
      <article><p>{result.description}</p></article>
</div>  
    </div>
  );
}

export default Info;
