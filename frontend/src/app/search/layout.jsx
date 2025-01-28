import { Suspense } from "react";
import Loading from "../loading";

export const metadata = {
  title: "Search Engine",
  description: "Search Engine PT. Bintang Toedjoe",
};

export default function SearchLayout({ children }) {
  return (
    <main>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </main>
  );
}
