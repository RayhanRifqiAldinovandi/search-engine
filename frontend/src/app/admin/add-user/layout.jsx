import Loading from "@/app/loading";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "Add User",
  description: "Register Account",
};

export default function AddUserLayout({ children }) {
  return (
    <>
      <ToastContainer />

      <main>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </>
  );
}
