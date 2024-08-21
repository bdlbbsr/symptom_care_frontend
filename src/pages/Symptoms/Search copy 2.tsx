import React, { FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface InfoArray {
  _id: number;
  title: string;
  description: string;
}

interface ApiResponse {
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

const Search: FC<SearchProps> = ({ searchState, setSearchState }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { result, search, suggestions } = searchState;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    if (id) {
      const searchValue = id.replace(/-/g, ' '); // Replace hyphens with spaces
      setSearchState((prevState) => ({
        ...prevState,
        search: searchValue,
      }));
      searchRes(searchValue);
    }
  }, [id, setSearchState]);

  const handleChange = (e: any) => {
    setSearchState((prevState) => ({
      ...prevState,
      search: e.target.value,
    }));
  };

  async function searchRes(query: string) {
    setLoading(true);
    try {
      const rawResponse = await fetch("http://localhost:8080/api/search", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data: ApiResponse = await rawResponse.json();
      setSearchState((prevState) => ({
        ...prevState,
        result: data.data,
        suggestions: data.data,
      }));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchClick = () => {
    searchRes(search);
    navigate(`/search/${search.replace(/\s+/g, '-')}`);
  };

  const highlightText = (text: string, highlights: string[]): JSX.Element => {
    if (!highlights.length) return <span>{text}</span>;

    const regex = new RegExp(
      `\\b(${highlights
        .flatMap((h) => [h, h.endsWith("s") ? h.slice(0, -1) : h + "s"])
        .join("|")})\\b`,
      "gi"
    );
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          highlights.some(
            (highlight) =>
              new RegExp(`\\b${highlight}\\b`, "i").test(part) ||
              new RegExp(
                `\\b${
                  highlight.endsWith("s")
                    ? highlight.slice(0, -1)
                    : highlight + "s"
                }\\b`,
                "i"
              ).test(part)
          ) ? (
            <mark key={index}>{part}</mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const handleClick = (item: InfoArray) => {
    navigate(`/info/${item._id}`);
  };

  return (
    <div className="searchDiv">
      <div>
        <div className="search-box">
          <button
            onClick={handleSearchClick}
            className="btn-search"
            title="Search Symptoms"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </button>
          <input
            type="text"
            className="input-search"
            placeholder="Search symptom..."
            onChange={(e) => handleChange(e)}
            value={search}
            ref={searchInputRef}
          />
        </div>

        <div className="page">
          <div id="search-node">
            {suggestions.map((item, i) => {
              return (
                <div
                  key={i}
                  className="list"
                  onClick={() => handleClick(item)}
                  role="button"
                >
                  {highlightText(item.title, search.split(" "))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
