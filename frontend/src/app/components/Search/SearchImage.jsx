import { SearchContext } from "@/app/context/searchContext";
import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";

const SearchImage = () => {
  const { query, loading, results } = useContext(SearchContext);

  const truncateTitle = (title, limit) => {
    return title.length > limit ? `${title.slice(0, limit)}...` : title;
  };

  return (
    <div className="mt-5 sm:px-2">
      {loading ? (
        <p>Loading hasil...</p>
      ) : results.length > 0 ? (
        <div className="flex flex-wrap">
          {results.map((result) => (
            <div key={result.id} className="p-4 cursor-pointer">
              <Link href={`${result.url}`} target="_blank">
                <div className="relative w-[200px] h-[200px] overflow-hidden hover:drop-shadow-2xl">
                  {result.image ? (
                    <Image src={`data:image/jpeg;base64,${result.image}`} alt={result.title} width={200} height={150} />
                  ) : result.video_link ? (
                    <Image src={`${result.video_link}`} alt={result.title} width={200} height={150} />
                  ) : (
                    <></>
                  )}
                </div>
                <p className="text-gray-500 hover:underline">{truncateTitle(result.title, 20)}</p>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Tidak ada hasil untuk {query}.</p>
      )}
    </div>
  );
};

export default SearchImage;
