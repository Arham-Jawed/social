import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const SuggestedUser = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div
      to={`/profile/${data.username}`}
      className="h-[10rem] w-[40%] bg-black border-[1px] border-gray-500 flex flex-col items-center justify-center px-2 rounded-xl"
    >
      <img
        src={data.profileImg || "/assets/profile.webp"}
        alt="profile"
        className="w-20 h-20 rounded-full"
      />
      <h3 className="text-[0.9rem] tracking-tighter">{data.name}</h3>
      <Button
        onClick={() => navigate(`/profile/${data.username}`)}
        className="bg-purple-700 hover:bg-purple-800 w-full h-[2rem]"
      >
        Profile
      </Button>
    </div>
  );
};

export default SuggestedUser;
