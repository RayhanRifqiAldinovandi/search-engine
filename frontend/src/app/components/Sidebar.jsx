import { Search } from "lucide-react";
import Link from "next/link";

import { IoMdHome } from "react-icons/io";
import { IoPersonAdd } from "react-icons/io5";

const Sidebar = () => {
  return (
    <>
      <div className="bg-black min-h-screen rounded-r-xl">
        <div className="p-5">
          <h1 className="text-white text-xl font-semibold text-center">Admin Panel</h1>
        </div>

        <div className="w-full">
          <ul className="mt-10 ml-5">
            <Link href="/admin">
              <li className="text-white flex items-center mb-2 hover:text-blue-500 duration-200">
                <IoMdHome className="w-6 h-6" />
                <span className="ml-2">Home</span>
              </li>
            </Link>
            <Link href="/">
              <li className="text-white flex items-center mb-2 hover:text-blue-500 duration-200">
                <Search />
                <span className="ml-2">Search</span>
              </li>
            </Link>
            <Link href="/admin/add-user">
              <li className="text-white flex items-center hover:text-blue-500 duration-200">
                <IoPersonAdd className="w-6 h-6" />
                <p className="ml-2">Add User</p>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
