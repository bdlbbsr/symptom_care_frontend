import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { debounce } from "../../services/debounce"; // Adjust the import path as necessary

const Home: FC = () => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [search, setSearch] = useState("");

  // Debounce search input change
  const handleChange = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, 300);

  // Navigate to the search results page on button click or Enter key press
  const handleSearch = () => {
    if (search.trim()) {
      const searchKeyword = search.trim().replace(/\s+/g, '-').toLowerCase();
      navigate(`/symptoms/${searchKeyword}`);
    } else {
      alert("Please enter search keywords");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="searchDiv">
    <div className="search-box">
      <button
        onClick={handleSearch}
        className={`btn-search ${isFocused ? 'focusRemoved' : 'focusAdded'}`}
        aria-label="Search for symptoms"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="bi bi-search iconClr"
          viewBox="0 0 16 16"
          role="img" // Ensure the icon is treated as an image
          aria-labelledby="searchIconTitle" // Links title to SVG
        >
          <title id="searchIconTitle">Search Icon</title> 
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </button>
      <input
        type="text"
        className="input-search"
        placeholder="Search symptom... for ex. pain"
        onChange={handleChange}
        onKeyDown={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label="Enter symptom keywords to search"
      />
    </div>
  </div>
  
  );
};

export default Home;
