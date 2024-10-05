import React from "react";
import { GoHomeFill } from "react-icons/go";
import { FaBell } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { IoCreate } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <div className="lg:hidden flex items-center justify-evenly h-[4rem] bg-black border-t-[1px] border-zinc-800 sticky bottom-0 z-50 px-6">
      <Link
        to="/"
        className={`${
          pathname === "/" && "bg-purple-700 hover:bg-purple-800"
        } flex flex-col items-center px-4 rounded-xl`}
      >
        <GoHomeFill className="size-7" />
        <h1>Home</h1>
      </Link>
      <Link
        to="/notifications"
        className={`${
          pathname === "/notifications" && "bg-purple-700 hover:bg-purple-800"
        } flex flex-col items-center px-4 rounded-xl`}
      >
        <FaBell className="size-7" />
        <h1 className="text-[0.9rem] tracking-tight">Notification</h1>
      </Link>
      <Link
        to="/explore"
        className={`${
          pathname === "/explore" && "bg-purple-700 hover:bg-purple-800"
        } flex flex-col items-center px-4 rounded-xl`}
      >
        <MdExplore className="size-7" />
        <h1>Explore</h1>
      </Link>
      <Link
        to="/create-post"
        className={`${
          pathname === "/create-post" && "bg-purple-700 hover:bg-purple-800"
        } flex flex-col items-center px-4 rounded-xl`}
      >
        <IoCreate className="size-7" />
        <h1>Create</h1>
      </Link>
    </div>
  );
};

export default Bottombar;
