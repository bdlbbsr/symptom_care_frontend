import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "../../services/debounce"; // Adjust the import path as necessary

const Home: FC = () => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false); 
  const [search, setSearch] = useState("");

  // Use the custom debounce function
  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, 300);

  const handleClick = () => {
    if (search) {
      const searchKeyword = search.trim().replace(/\s+/g, '-').toLowerCase();
      navigate(`/symptoms/${searchKeyword}`);
    } else {
      alert("Enter search keywords");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  const handleFocus = () => { 
    setIsFocused(true); 
  }; 

  const handleBlur = () => { 
    setIsFocused(false); 
  };

  return (
    <div className="searchDiv">
      <div className="search-box">
        <button
          onClick={handleClick}
          className={`btn-search ${isFocused ? 'focusRemoved' : 'focusAdded'}`}
          title="Search Symptoms">
           <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              fill="currentColor"
              className="bi bi-search iconClr"
              viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
        </button>
        <input
          type="text"
          className="input-search"
          placeholder="Search symptom..."
          onChange={handleChange}
          onKeyDown ={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur} 
        />
      </div>
    </div>
  );
};

export default Home;
