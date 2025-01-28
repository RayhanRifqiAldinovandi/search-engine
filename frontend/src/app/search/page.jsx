"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";

import { SearchProvider } from "../context/searchContext";
import Header from "../components/Header/Header";
import SearchAll from "../components/Search/SearchAll";
import SearchImage from "../components/Search/SearchImage";
import SearchVideo from "../components/Search/SearchVideo";
import SearchDokumen from "../components/Search/SearchDokumen";
import SearchWeb from "../components/Search/SearchWeb";

import { Button } from "@/components/ui/button";

const Page = () => {
  const [currentComponent, setCurrentComponent] = useState(null);

  const router = useRouter();

  // Load the component from localStorage when the component mounts
  useEffect(() => {
    const savedComponent = localStorage.getItem("currentComponent");
    if (savedComponent) {
      setCurrentComponent(savedComponent);
    } else {
      setCurrentComponent("search-all"); // Default value
    }
  }, []);

  // Save the current component to localStorage whenever it changes
  useEffect(() => {
    if (currentComponent) {
      localStorage.setItem("currentComponent", currentComponent);
    }
  }, [currentComponent]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  const renderComponent = () => {
    switch (currentComponent) {
      case "search-all":
        return <SearchAll />;
      case "search-image":
        return <SearchImage />;
      case "search-video":
        return <SearchVideo />;
      case "search-dokumen":
        return <SearchDokumen />;
      case "search-web":
        return <SearchWeb />;
      default:
        return <SearchAll />;
    }
  };

  return (
    <SearchProvider>
      <div className="p-4 mt-4">
        <Suspense>
          <Header />
        </Suspense>

        <div className="container mt-10 sm:px-36">
          <Button onClick={() => setCurrentComponent("search-all")} variant="link" className={`text-gray-400 ${currentComponent === "search-all" && "text-black underline"}`}>
            Semua
          </Button>
          <Button onClick={() => setCurrentComponent("search-image")} variant="link" className={`text-gray-400 ${currentComponent === "search-image" && "text-black underline"}`}>
            Gambar
          </Button>
          <Button onClick={() => setCurrentComponent("search-video")} variant="link" className={`text-gray-400 ${currentComponent === "search-video" && "text-black underline"}`}>
            Video
          </Button>
          <Button onClick={() => setCurrentComponent("search-dokumen")} variant="link" className={`text-gray-400 ${currentComponent === "search-dokumen" && "text-black underline"}`}>
            Dokumen
          </Button>
          <Button onClick={() => setCurrentComponent("search-web")} variant="link" className={`text-gray-400 ${currentComponent === "search-web" && "text-black underline"}`}>
            Web
          </Button>
        </div>
        <hr />

        <div>{renderComponent()}</div>
      </div>
    </SearchProvider>
  );
};

export default Page;
