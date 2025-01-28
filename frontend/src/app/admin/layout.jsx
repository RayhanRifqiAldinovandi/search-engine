"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../components/Sidebar";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { decodeToken } from "@/lib/auth";
import Loading from "../loading";

// export const metadata = {
//   title: "Search Engine - Admin Panel",
//   description: "Admin Panel",
// };

export default function AdminLayout({ children }) {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedRole = decodeToken(token);
      setRole(decodedRole);
      // console.log(decodedRole)

      if (decodedRole != "admin") {
        router.back();
        setLoading(false);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }

    if (!token) {
      router.back();
    }
  }, [router]);

  return (
    <>
      {loading ? (
        <>
          <Loading />
        </>
      ) : (
        <>
          <ToastContainer />
          <div className="w-full flex">
            <aside className="fixed w-[12%]">
              <Sidebar />
            </aside>

            <main className="w-[86%] ml-56">
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </main>
          </div>
        </>
      )}
    </>
  );
}
