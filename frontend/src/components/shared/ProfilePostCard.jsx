import React from "react";
import { useNavigate } from "react-router-dom";

const ProfilePostCard = ({ post }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/post/${post._id}`)}
      className="w-full lg:w-[32%] h-[30rem] lg:h-[20rem] bg-black rounded-xl overflow-hidden cursor-pointer"
    >
      <img
        src={post?.img}
        alt="postImg"
        className="h-full w-full object-fit relative"
      />
    </div>
  );
};

export default ProfilePostCard;
