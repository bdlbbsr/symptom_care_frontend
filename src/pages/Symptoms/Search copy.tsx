import React, { FC, useEffect, useMemo, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Outlet,
  NavLink,
} from "react-router-dom";

interface InfoArray {
  id: number;
  title: string;
  description: string;
  // Add other fields if needed
}

interface ApiResponse {
  data: InfoArray[];
}

const Search: FC = () => {
  const navigate = useNavigate();

  const [result, setResult] = useState<InfoArray[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<InfoArray[]>([]);

  const handleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
    func: F,
    waitFor: number
  ) => {
    let timeout: NodeJS.Timeout;
    const debounced = (...args: Parameters<F>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), waitFor);
    };
    return debounced;
  };

  async function searchRes(value: any) {
    const rawResponse = await fetch("http://localhost:8080/api/search", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: value }),
    });

    const data: ApiResponse = await rawResponse.json();
    setResult(data.data);
    return data.data;
  }

  const debouncedSearch = useMemo(
    () =>
      debounce(() => {
        setLoading(true);
        searchRes(search)
          .then((data: InfoArray[]) => {
            setSuggestions(data);
            setLoading(false);
          })
          .catch((error) => {
            setError(error.message);
            setLoading(false);
          });
      }, 300),
    [search]
  );

  // useEffect(() => {
  //   if (search) {
  //     debouncedSearch();
  //   } else {
  //     setSuggestions([]);
  //   }

  //   return () => {
  //     setSuggestions([]);
  //   };
  // }, [search, debouncedSearch]);

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

  const handleClick = (item: any) => {
    navigate(`/info/${item._id}`);
  };

  // const handleClick = (item:any) => {
  //   //let names = item.name.replace(/\s+/g, '-');
  //   console.log("first", result.map((desc)=> desc.description === item))
  //   const url = `info/${item._id}`
  //   //navigate(url)
  // }

  const searchResult = () => {
    if (search) {
      debouncedSearch();
    } else {
      setSuggestions([]);
    }

    // return () => {
    //   setSuggestions([]);
    // };
  };

  return (
    <div className=" searchDiv">
      <div>
        <div className="search-box">
          <button
            onClick={() => searchResult()}
            className="btn-search"
            title="Search Symptoms">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </button>
          <input
            type="text"
            className="input-search"
            placeholder="Search symptom..."
            onChange={(e) => handleChange(e)}
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
                  role="button">
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
