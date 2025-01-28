import { SearchContext } from "@/app/context/searchContext";
import { useContext } from "react";
import Image from "next/image";
import Link from "next/link";

import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const SearchAll = () => {
  const { query, loading, results } = useContext(SearchContext);

  return (
    <div className="container mt-5 sm:px-36">
      {loading ? (
        <p>Loading hasil...</p>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result) => {
            // Pisahkan domain dan bagian pertama dari path URL
            const url = new URL(result.url);
            const domain = url.origin; // Mendapatkan domain (misalnya, https://tokopedia.com)
            const firstPathSegment = url.pathname.split("/").filter(Boolean)[0]; // Mendapatkan bagian pertama dari path

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
                {/* Tampilkan domain dan bagian pertama dari path */}
                <p className="inline-flex">
                  <Link href={result.url} target="_blank">
                    {result.image ? (
                      <Image src={`data:image/jpeg;base64,${result.image}`} alt={result.title} width={200} height={150} />
                    ) : result.video_link ? (
                      <Image src={`${result.video_link}`} alt={result.title} width={200} height={150} />
                    ) : result.type === "dokumen" ? (
                      <Image src="/dokumen-vector.jpg" alt="dokumen vector" width={200} height={200}></Image>
                    ) : result.type === "web" ? (
                      <Image src="/web.jpg" alt="web" width={200} height={200}></Image>
                    ) : (
                      <>...</>
                    )}
                  </Link>
                  <span className="ml-4">{result.description}</span>
                </p>
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

      {/* <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}
    </div>
  );
};

export default SearchAll;
