import { createContext, useEffect, useState, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const router = useRouter();

  const [query, setQuery] = useState(searchQuery || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const pathname = usePathname();

  // Load search data from localStorage when the component mounts
  useEffect(() => {
    const savedQuery = localStorage.getItem("searchQuery");
    const savedResults = localStorage.getItem("searchResults");

    if (savedQuery && savedResults) {
      setQuery(savedQuery);
      setResults(JSON.parse(savedResults));
    }
  }, []);

  // Save search data to localStorage whenever the query or results change
  useEffect(() => {
    if (query && results.length > 0) {
      localStorage.setItem("searchQuery", query);
      localStorage.setItem("searchResults", JSON.stringify(results));
    }
  }, [query, results]);

  const handleSearch = async () => {
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setLoading(true);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search?term=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDelete = () => {
    setQuery("");
    setResults([]);
    localStorage.removeItem("searchQuery");
    localStorage.removeItem("searchResults");
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  const value = { query, setQuery, results, setResults, loading, setLoading, inputRef, handleSearch, handleDelete };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
