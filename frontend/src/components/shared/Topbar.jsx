import { Link } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import { Button } from "../ui/button";
import { CgProfile } from "react-icons/cg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const Topbar = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["authUser"],
  });
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
  const handleLogout = () => {
    LogoutUser();
  };
  return (
    <div className="lg:hidden flex items-center justify-between h-[4rem] bg-black border-b-[1px] border-zinc-800 sticky top-0 z-50 px-6">
      <Link to="/">
        <h1 className="font-logo text-[2.2rem]">
          Thre<span className="text-purple-700">ads</span>
        </h1>
      </Link>
      <div className="flex items-center">
        <Button onClick={handleLogout} className="bg-black hover:bg-black">
          <IoIosLogOut className="size-7" />
        </Button>
        {data ? (
          <Link to={`/profile/${data.username}`}>
            <img
              src={data.profileImg}
              alt="profile"
              className="w-7 h-7 rounded-full object-cover"
            />  
          </Link>
        ) : (
          <>
            <Link to={`/profile/${data.username}`}>
              <CgProfile className="size-7" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Topbar;
