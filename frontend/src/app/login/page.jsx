"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Bounce, toast } from "react-toastify";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/");
      setLoading(false);
    } else {
      setLoading(false)
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("token", token);

        // Decode the token
        const [header, payload, signature] = token.split(".");
        const decodedPayload = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
        // console.log(decodedPayload.role);

        toast.success("Login sukses", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });

        // Optionally, navigate to another page
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else if (username === "" || password === "") {
        setErrorMessage("username atau password tidak boleh kosong");
        setTimeout(() => {
          setErrorMessage(false);
        }, 2000);
      } else {
        toast.error("Login gagal", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeButton: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      {loading ? (
        <>Loading...</>
      ) : (
        <>
          <section className="bg-gray-100">
            <div className="flex">
              {/* Left Block */}
              <div className="hidden w-full h-screen bg-white lg:flex items-center justify-center">
                <Image src="/login-vector.jpg" alt="login vector" width={700} height={700}></Image>
              </div>

              {/* Right Block */}
              <div className="container h-screen flex items-center justify-center">
                <main>
                  <Image src="/synapse.png" alt="synapse" width={100} height={100} className="mx-auto"></Image>
                  <form onSubmit={handleLogin} className="w-[400px] mt-10">
                    <div className="my-2">
                      <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-4">
                      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {/* <p className="flex justify-between items-center text-sm mt-2 mb-4">
                  <span>Don&apos;t have an account?</span>
                  <Link href="/register">
                    <span className="text-blue-500 font-semibold hover:underline">Register Now</span>
                  </Link>
                </p> */}

                    <Button type="submit" className="w-full">
                      Log in
                    </Button>
                  </form>
                  {errorMessage && <p className="text-red-500 text-center mt-2">{errorMessage}</p>}
                </main>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default Page;
