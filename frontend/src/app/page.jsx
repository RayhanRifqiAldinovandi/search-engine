"use client"

import { SearchProvider } from "./context/searchContext";
import SearchHome from "./components/Search/SearchHome";

const page = () => {
  return (
    <SearchProvider>
      <SearchHome />
    </SearchProvider>
  );
};

export default page;
