"use client";

import { useState } from "react";

import { Bounce, toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  const departments = [
    { value: "quality assurance", label: "Quality Assurance" },
    { value: "quality system", label: "Quality System" },
    { value: "quality control", label: "Quality Control" },
    { value: "warehouse", label: "Warehouse" },
    { value: "produksi", label: "Produksi" },
    { value: "teknik", label: "Teknik" },
    { value: "general affair", label: "General Affair" },
    { value: "manufacturing development", label: "Manufacturing Development" },
    { value: "analytical development", label: "Analytical Development" },
    { value: "packaging development", label: "Packaging Development" },
    { value: "formula development", label: "Formula Development" },
  ];

  const roles = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, role, email, department }),
      });

      if (response.ok) {
        toast.success("Register sukses", {
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

        setUsername("");
        setPassword("");
        setRole("");
        setEmail("");
        setDepartment("");
      } else {
        const errorMessage = await response.text();
        console.log(errorMessage);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const pathname = usePathname();
  console.log(pathname);

  return (
    <section>
      <div className="block md:flex">
        {/* Left block */}
        {/* <div className="hidden md:w-1/2 md:flex items-center">
          <img src="/register-vector.jpg" alt="register vector" className="w-full object-cover"></img>
        </div> */}

        {/* Right block */}
        {/* <div className="bg-slate-100 w-full md:w-1/2 h-screen">
          <div className="container w-full h-screen py-5 flex items-center">
            <div className="bg-slate-50 w-full xl:w-1/2 mx-auto p-5 xl:p-10 rounded-lg shadow-xl">
              <h1 className="text-lg text-center font-semibold mb-5">Create an account</h1>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}></Input>
                </div>
                <div className="mb-4">
                  <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></Input>
                </div>
                <div className="mb-4">
                  <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></Input>
                </div>
                <div className="mb-4">
                  <select value={department} onChange={(e) => setDepartment(e.target.value)} className="w-full border p-2 rounded-md">
                    <option value="" disabled>
                      Select a department
                    </option>
                    {departments.map((department) => (
                      <option key={department.value} value={department.value}>
                        {department.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Register
                </Button>
              </form>

              <p className="text-center mt-5">
                Already have an account?{" "}
                <Link href="/login">
                  <span className="text-blue-500 font-semibold hover:underline">Sign In</span>
                </Link>
              </p>
            </div>
          </div>
        </div> */}

        <div className="w-full h-screen">
          <div className="container w-full h-screen py-5 flex items-center">
            <div className="bg-white w-full xl:w-1/2 mx-auto p-5 xl:p-10 border rounded-lg shadow-xl">
              <h1 className="text-lg text-center font-semibold mb-5">Add User</h1>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="bg-gray-100"></Input>
                </div>
                <div className="mb-4">
                  <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-gray-100"></Input>
                </div>
                <div className="mb-4">
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="bg-gray-100 w-full border p-2 rounded-md">
                    <option value="" disabled>
                      Choose Role
                    </option>
                    {roles.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-gray-100"></Input>
                </div>
                <div className="mb-4">
                  <select value={department} onChange={(e) => setDepartment(e.target.value)} className="bg-gray-100 w-full border p-2 rounded-md">
                    <option value="" disabled>
                      Select a department
                    </option>
                    {departments.map((department) => (
                      <option key={department.value} value={department.value}>
                        {department.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  Add User
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
