import { SearchContext } from "@/app/context/searchContext";
import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";

const SearchVideo = () => {
  const { query, loading, results } = useContext(SearchContext);

  // Function to sort results by score in descending order
  const sortedResults = results.filter((result) => result.type === "video").sort((a, b) => a.score - b.score); // Sorting by score in descending order

  return (
    <div className="container mt-5 sm:px-36">
      {loading ? (
        <p>Loading hasil...</p>
      ) : sortedResults.length > 0 ? (
        <div className="space-y-4">
          {sortedResults.map((result) => {
            // Extract video ID from video_link if available
            const videoId = result.video_link?.match(/vi\/(.+?)\//)?.[1];

            // Generate the thumbnail URL if videoId exists
            // const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` || `https://drive.google.com/thumbnail?id=${videoId}` : null;

            // Extract domain and first path segment
            const url = new URL(result.url);
            const domain = url.origin;
            const firstPathSegment = url.pathname.split("/").filter(Boolean)[0];

            return (
              <div key={result.id} className="p-4">
                <h2 className="text-2xl font-semibold">
                  <Link href={result.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {result.title}
                  </Link>
                </h2>
                <p className="text-gray-500 mb-2">
                  {domain} {firstPathSegment ? `> ${firstPathSegment}` : ""}
                </p>
                <div className="inline-flex">
                  {result.image ? (
                    <Image src={`data:image/jpeg;base64,${result.image}`} alt={result.title} width={200} height={150} />
                  ) : result.video_link ? (
                    <Image src={`${result.video_link}`} alt={result.title} width={200} height={150} />
                  ) : (
                    <></>
                  )}
                  <span className="ml-4">{result.description}</span>
                </div>
                <p className="text-gray-600">
                  <span className="font-semibold">author:</span> {result.author} . <span className="font-semibold">departemen:</span> {result.department}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <p>Tidak ada hasil untuk {query}.</p>
      )}
    </div>
  );
};

export default SearchVideo;
