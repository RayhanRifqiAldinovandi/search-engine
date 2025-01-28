import { useContext, useEffect } from "react";
import { useState } from "react";
import Image from "next/image";

import { decodeToken } from "@/lib/auth";
import { SearchContext } from "@/app/context/searchContext";

import { Search } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Header = () => {
  const { inputRef, query, setQuery, handleSearch, handleDelete, result } = useContext(SearchContext);

  const [role, setRole] = useState("");

  const [showSearch, setShowSearch] = useState(true);
  const [showResult, setShowResult] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedRole = decodeToken(token);
      setRole(decodedRole);
    }
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center w-full">
          <Image src="/synapse.png" alt="synapse" width={75} height={75} />

          <button onClick={() => setShowSearch(true)} className={` ${showSearch ? "hidden" : "w-1/2 border pl-4 py-2 rounded-full shadow-lg ml-4"}`}>
            <Search className="text-gray-400" />
          </button>

          <div className={`rounded-full ${showSearch ? "w-full md:w-1/2 bg-white border ml-4 drop-shadow-lg hover:drop-shadow-xl duration-200" : "hidden"}`}>
            <div className="relative px-4">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={() => setShowResult(true)}
                className="w-full pl-10 pr-10 py-3 outline-none rounded-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {query && (
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" onClick={handleDelete}>
                  x
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mr-5">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-auto h-10 bg-gray-700 text-white px-2 rounded-xl">{role}</DropdownMenuTrigger>
            <DropdownMenuContent>
              {role === "admin" && (
                <>
                  <Link href="/admin">
                    <DropdownMenuItem>
                      <Button variant="ghost">Admin Panel</Button>
                    </DropdownMenuItem>
                  </Link>
                </>
              )}
              <DropdownMenuItem>
                <Button variant="ghost" onClick={handleLogout}>
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Kode di bawah ini untuk menampilkan pencarian sama seperti google ketika di cari maka menampilkan dulu di inputnya yang kemudian dapat diklik */}

        {/* <div className={`${showSearch ? "w-full md:w-1/2 bg-white border ml-4 drop-shadow-lg" : "hidden"} ${showResult ? "rounded-t-3xl" : "rounded-3xl"}`}>
          <div className="relative px-4">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClick={() => setShowResult(true)}
              className="w-full pl-10 pr-10 py-3 outline-none rounded-full"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            {query && (
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" onClick={handleDelete}>
                x
              </span>
            )}
          </div> */}

        <hr />

        {/* Result */}
        {/* <div className={`${showResult ? "absolute bg-white px-4 py-2 w-full rounded-b-3xl" : "hidden"}`}>
            {results.length > 0 ? (
              <ul className="space-y-4 pb-4">
                {results.map((result) => (
                  <li key={result.id} className="flex items-center">
                    <Search className="text-gray-400" />
                    <Link href={`/search?q=${encodeURIComponent(query)}`} className="pl-4">{result.title}</Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Tidak ada hasil untuk {query}</p>
            )}
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Header;
