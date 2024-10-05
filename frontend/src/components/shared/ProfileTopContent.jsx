import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { CiCirclePlus } from "react-icons/ci";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

const ProfileTopContent = ({ user }) => {
  const [image, setImage] = useState("");
  const imgRef = useRef();
  const queryClient = useQueryClient();
  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const { mutateAsync: Upload, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(`/api/v1/users/update`, {
          profileImg: image,
        });
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        toast.success("Profile Image Updated Successfully");
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profileUser"]);
      queryClient.invalidateQueries(["authUser"]);
    },
  });

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const handleUpload = async () => {
    await Upload();
  };
  return (
    <div className="h-full w-full flex items-center justify-between px-4 cursor-default">
      {user.profileImg ? (
        <div className="group flex items-center gap-3">
          <img
            src={user.profileImg}
            alt="profile"
            className="w-16 h-16 rounded-full object-cover relative"
          />
          {authUser._id === user._id && (
            <CiCirclePlus
              onClick={() => imgRef.current.click()}
              className={`w-10 h-10 hidden group-hover:block absolute top-[6.25rem] lg:top-9 left-[3rem] lg:left-[21rem] cursor-pointer ${
                image && "hidden"
              }`}
            />
          )}
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImage}
          />
          {image && (
            <Button
              onClick={handleUpload}
              className="bg-purple-700 hover:bg-purple-800"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-3 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 group">
          <img
            src={`${image || "/assets/profile.webp"}`}
            alt="profile"
            className="w-16 h-16 rounded-full object-cover relative"
          />
          <CiCirclePlus
            onClick={() => imgRef.current.click()}
            className={`w-10 h-10 hidden group-hover:block absolute top-[6.25rem] lg:top-9 left-[3rem] lg:left-[21rem] cursor-pointer ${
              image && "hidden"
            }`}
          />
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImage}
          />
          {image && (
            <Button
              onClick={handleUpload}
              className="bg-purple-700 hover:bg-purple-800"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-3 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          )}
        </div>
      )}
      <div className="flex-center flex-col">
        <h1>{user.posts.length}</h1>
        <p className="text-[0.8rem] tracking-tight">Posts</p>
      </div>
      <div className="flex-center flex-col">
        <h1>{user.followers.length}</h1>
        <p className="text-[0.8rem] tracking-tight">Followers</p>
      </div>
      <div className="flex-center flex-col">
        <h1>{user.following.length}</h1>
        <p className="text-[0.8rem] tracking-tight">followings</p>
      </div>
    </div>
  );
};

export default ProfileTopContent;
