"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Search } from "lucide-react";
import { SearchContext } from "@/app/context/searchContext";

import { IoMdInformationCircleOutline } from "react-icons/io";
import Link from "next/link";

const SearchHome = () => {
  const { query, setQuery, loading, setLoading, handleSearch, handleDelete } = useContext(SearchContext);

  const router = useRouter();

  //   const handleSearch = (e) => {
  //     e.preventDefault();
  //     if (query) {
  //       router.push(`/search?q=${encodeURIComponent(query)}`);
  //     }
  //   };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
      setLoading(false);
    } else if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <>
          <section>
            <div className="w-full h-screen">
              <div className="absolute top-4 left-4 flex items-center">
                <div className="dropdown">
                  <IoMdInformationCircleOutline tabIndex={0} role="button" className=" text-red-500 text-2xl" />
                  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-[800px] p-2 shadow">
                    <li>
                      <p>Filosofi:</p>
                      <p className="text-justify">
                        Meaning: The junction between two neurons, where information is transmitted in the brain. Why it fits: &quot;Synapse&quot; represents the connection and transfer of information at lightning speed, similar to how a
                        search engine processes and delivers data. It&apos;s a term rooted in biology but often used metaphorically in tech to describe highly efficient, intelligent systems.
                      </p>
                    </li>
                    <hr></hr>
                    <li>
                      <p className="text-xs text-center">
                        &copy; 2024, Developed by{" "}
                        <Link href="https://bintang7.com" target="_blank">
                          <span className="font-semibold text-[#80BC00]">Bintang Toedjoe</span>
                        </Link>{" "}
                        in collaboration with{" "}
                        <Link href="https://president.ac.id" target="_blank">
                          <span className="font-semibold text-red-500">President</span> <span className="font-bold text-blue-700">University</span>
                        </Link>{" "}
                        (<span className="font-medium italic">Dimas Azizir, Matthew, Rayhan Rifqi</span>)
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="w-full h-screen flex justify-center items-center">
                <div className="w-full flex flex-col justify-center items-center">
                  <Image src="/synapse.png" alt="synapse" width={200} height={200} className="-mt-24" />

                  <form onSubmit={handleSearch} className="relative w-1/2 mt-10">
                    <input type="text" placeholder="Pencarian..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full border pl-14 py-3 rounded-full drop-shadow-lg outline-none" />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    {query && (
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500" onClick={handleDelete}>
                        x
                      </span>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default SearchHome;
