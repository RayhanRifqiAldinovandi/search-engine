import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loading from "../loading";

export const metadata = {
  title: "Search Engine - Login Page",
  description: "Search Engine - Login Page",
};

export default function LoginLayout({ children }) {
  return (
    <>
      <ToastContainer />
      <main>
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </>
  );
}
