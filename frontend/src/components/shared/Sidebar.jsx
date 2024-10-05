import { Link, NavLink, useLocation } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import { FaBell } from "react-icons/fa";
import { MdExplore } from "react-icons/md";
import { IoCreate } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { Button } from "../ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const Sidebar = () => {
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const { mutate: LogoutUser } = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/v1/auth/logout");
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return (
    <nav className="hidden w-[18rem] h-screen sticky top-0 left-0 bg-black border-r-[1px] border-zinc-800 lg:flex flex-col items-center py-4 justify-between">
      <Link to="/" className="font-logo text-[3.5rem] leading-tight">
        Thre<span className="text-purple-700">ads</span>
      </Link>
      <div className="w-full h-[25rem] mt-10">
        <ul className="flex h-full flex-col justify-evenly px-3 gap-2 py-3">
          <li>
            <NavLink
              to="/"
              className={`${
                pathname === "/" && "bg-purple-700 hover:bg-purple-800"
              } h-[3rem] w-full bg-black rounded-xl gap-3 flex items-center justify-start px-4`}
            >
              <GoHomeFill className="size-7" />
              <h1>Home</h1>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/notifications"
              className={`${
                pathname === "/notifications" &&
                "bg-purple-700 hover:bg-purple-800"
              } h-[3rem] w-full bg-black rounded-xl gap-3 flex items-center justify-start px-4`}
            >
              <FaBell className="size-7" />
              <h1>Notification</h1>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/explore"
              className={`${
                pathname === "/explore" && "bg-purple-700 hover:bg-purple-800"
              } h-[3rem] w-full bg-black rounded-xl gap-3 flex items-center justify-start px-4`}
            >
              <MdExplore className="size-7" />
              <h1>Explore</h1>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/create-post"
              className={`${
                pathname === "/create-post" &&
                "bg-purple-700 hover:bg-purple-800"
              } h-[3rem] w-full bg-black rounded-xl gap-3 flex items-center justify-start px-4`}
            >
              <IoCreate className="size-7" />
              <h1>Create</h1>
            </NavLink>
          </li>
          {authUser && (
            <li>
              <NavLink
                to={`/profile/${authUser.username}`}
                className={`${
                  pathname === `/profile/${authUser.username}` &&
                  "bg-purple-700 hover:bg-purple-800"
                } h-[3rem] w-full bg-black rounded-xl gap-3 flex items-center justify-start px-4`}
              >
                <img
                  src={authUser?.profileImg || "/assets/profile.webp"}
                  alt="profile"
                  className="w-7 h-7 rounded-full"
                />
                <h1>Profile</h1>
              </NavLink>
            </li>
          )}
        </ul>
      </div>
      <div className="px-4 w-full h-[5rem] mt-8 flex-center">
        <Button
          onClick={() => LogoutUser()}
          className="h-[3rem] w-full bg-black hover:bg-purple-700 flex items-center gap-2 justify-start"
        >
          <IoIosLogOut className="size-7" />
          <h1>Logout</h1>
        </Button>
      </div>
    </nav>
  );
};

export default Sidebar;
