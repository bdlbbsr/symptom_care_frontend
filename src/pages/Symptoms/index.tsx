import React, { FC, useEffect, useRef, useState, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import noImage from "../../assets/no-image.svg";
import BackButton from "../../components/BackButton";
import Select from "react-select";
import { useAuth } from "../../services/AuthContext";

interface InfoArray {
  _id: number;
  name: string;
  description: string;
  thumbnail: string;
  department: string;
}

interface ApiResponse {
  message: string;
  data: InfoArray[];
}

interface SearchProps {
  searchState: {
    result: InfoArray[];
    search: string;
    suggestions: InfoArray[];
  };
  setSearchState: React.Dispatch<
    React.SetStateAction<{
      result: InfoArray[];
      search: string;
      suggestions: InfoArray[];
    }>
  >;
}

const Symptoms: FC<SearchProps> = ({ searchState, setSearchState }) => {
  const { user } = useAuth();
  const [userLoc, setUserLoc] = useState<Record<string, any> | null>(null);
  const [selectedDepart, setSelectedDepart] = useState<{ value: string; label: string } | null>(null);
  const [doctors, setDoctors] = useState<InfoArray[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departmentNames, setDepartmentNames] = useState<{ value: string; label: string }[]>([]);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const userArea = JSON.parse(localStorage.getItem("area") || "null");

  const { search, suggestions } = searchState;

  useEffect(() => {
    const fetchGeoInfo = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        setUserLoc(data);
      } catch (error) {
        console.error("Failed to fetch geo info:", error);
      }
    };

    const fetchDepartmentsName = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/departmentsName`);
        const data = await response.json();
        setDepartmentNames(
          data.data.map((department: string) => ({
            value: department.toLowerCase(),
            label: department,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch department names:", error);
      }
    };

    fetchGeoInfo();
    fetchDepartmentsName();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/doctors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: userLoc?.country_name,
          state: userArea?.state,
          city: userArea?.city,
          postalCode: userArea?.postalCode,
          department: selectedDepart?.value,
        }),
      });
      const result = await response.json();
      setDoctors(result);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  useEffect(() => {
    
      

      fetchDoctors();
    
  }, [selectedDepart]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    if (id) {
      const searchValue = id.replace(/-/g, " ");
      setSearchState(prevState => ({
        ...prevState,
        search: searchValue,
      }));
      handleSearch(searchValue);
    }
  }, [id, setSearchState]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/search`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data: ApiResponse = await response.json();
      setSearchState(prevState => ({
        ...prevState,
        result: data.data,
        suggestions: data.data,
      }));
      if (!data.data) {
        setError(data.message);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchState(prevState => ({
      ...prevState,
      search: e.target.value,
    }));
  };

  const handleSearchClick = () => {
    if (search) {
      handleSearch(search);
      navigate(`/symptoms/${search.replace(/\s+/g, "-")}`);
    } else {
      alert("Enter search keyword");
    }
  };

  const handleDepartmentChange = (option: { value: string; label: string } | null) => {
    setSelectedDepart(option);
  };

  const highlightText = (text: string, highlights: string[]): JSX.Element => {
    if (!text || !highlights.length) return <span>{text}</span>;

    try {
      const regex = new RegExp(
        `\\b(${highlights.flatMap(h => [h, h.endsWith("s") ? h.slice(0, -1) : h + "s"]).join("|")})\\b`,
        "gi"
      );
      const parts = text.split(regex);

      return (
        <span>
          {parts.map((part, index) =>
            highlights.some(highlight => new RegExp(`\\b${highlight}\\b`, "i").test(part)) ? (
              <mark key={index}>{part}</mark>
            ) : (
              part
            )
          )}
        </span>
      );
    } catch (error) {
      console.error("Error in highlightText:", error);
      return <span>{text}</span>;
    }
  };

  const handleItemClick = (item: InfoArray) => {
    const itemTitle = item.name.replace(/\s+/g, "-");
    navigate(`/symptom/${itemTitle}`);
  };

  const truncateHtmlString = (htmlString: string, maxLength: number): string => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    const plainText = tempDiv.textContent || tempDiv.innerText || "";
    return plainText.length <= maxLength ? plainText : `${plainText.slice(0, maxLength)}...`;
  };

  const postNewSymptom = () => {
    if (user) {
    navigate(`/add-symptom-name`);
    } else {
      navigate(`/login`);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <div className="searchInputTop">
        <div className="backIcon">
          <BackButton />
        </div>
        <div className="search-box">
          <button
            onClick={handleSearchClick}
            className="btn-search searchPageIcon"
            title="Search Symptoms"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </button>
          <input
            type="text"
            className="inner-input-search"
            placeholder="Search symptom..."
            onChange={handleInputChange}
            value={search || ""}
            ref={searchInputRef}
            required
          />
        </div>
      </div>

      <div className="searchCnr">
        <div className="leftColumn">
          <div className="searchResult scrollMiddle" id="search-node">
            {suggestions?.length ? (
              suggestions.map(item => (
                <article key={item._id} className="articleListCnr" onClick={() => handleItemClick(item)} role="button">
                  <figure>
                    <img
                      src={item.thumbnail ? `${process.env.REACT_APP_API_BASE_URL}/${item.thumbnail}` : noImage}
                      alt={item.name}
                    />
                  </figure>
                  <span>
                    <h2>{highlightText(item.name, search.split(" "))}</h2>
                    {truncateHtmlString(item.description, 350)}
                  </span>
                </article>
              ))
            ) : (
              <Fragment>
                <h2>{error}</h2>
                <button className="postBtn" onClick={()=>postNewSymptom()}>Post your symptom</button>
              </Fragment>
            )}
          </div>
        </div>
        <div className="rightColumn doctorsColumn scrollMiddle">
          <h3 style={{ marginTop: 0 }}>Nearby top doctors</h3>
          <Select
            defaultValue={selectedDepart}
            onChange={handleDepartmentChange}
            options={departmentNames}
            isSearchable
            placeholder="Select department"
          />

{doctors?.length ? doctors.map((doctor: any) => (
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
: "Not found any doctors nearby"}
    </div>
  </div>
</Fragment>
  );
};

export default Symptoms;
