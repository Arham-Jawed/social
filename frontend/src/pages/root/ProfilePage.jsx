import { ProfilePostCard, ProfileTopContent } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const [bio, setBio] = useState("");
  const navigate = useNavigate();
  const [button, setButton] = useState(false);
  const { username } = useParams();
  const { data: profileUser, isLoading } = useQuery({
    queryKey: ["profileUser"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/users/profile/${username}`);
        if (!res.data.success) {
          return null;
        }
        return res.data.user;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
  });
  const { mutateAsync: Upload, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(`/api/v1/users/update`, {
          bio,
        });
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        toast.success("Bio Updated Successfully");
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profileUser"]);
    },
  });
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });
  const { mutateAsync: FollowUser, isPending: isFollowingUser } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(`/api/v1/users/follow/${profileUser._id}`);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data;
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profileUser"],
      });
      queryClient.invalidateQueries({
        queryKey: ["suggestedUser"],
      });
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
  });

  const handleUpload = async () => {
    if (!bio) {
      toast.error("Bio is required");
      return;
    }
    await Upload();
    setButton(false);
  };

  const isFollowing = authUser.following.includes(profileUser?._id);

  const handleFollow = async () => {
    if (authUser._id === profileUser._id) {
      toast.error("You Cannot Follow Yourself");
      return;
    }
    await FollowUser();
  };

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["profileUser"],
    });
  }, [username]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex-center">
        <Loader2 className="mr-3 animate-spin" />
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-4 bg-black min-h-screen w-full flex flex-col items-center justify-start gap-2">
      <div className="min-h-[15rem] w-full border-[1px] border-gray-800 rounded-xl">
        <div className="h-[5rem] w-full p-1">
          <ProfileTopContent user={profileUser} />
        </div>
        <div className="h-[7rem] w-full flex flex-col items-start justify-start px-4">
          <h1 className="text-[0.9rem] tracking-tight cursor-default">
            {profileUser.name}
          </h1>
          <div className="flex justify-start w-full mt-2">
            {profileUser.bio ? (
              <div className="flex flex-col justify-center gap-1 w-full">
                {!button && <p>{profileUser.bio}</p>}
                {authUser._id === profileUser._id && (
                  <>
                    {button && (
                      <div className="w-full">
                        <Input
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          type="text"
                          placeholder="Enter Your Bio"
                        />
                        <Button
                          onClick={handleUpload}
                          className="w-24 bg-purple-700 hover:bg-purple-800"
                        >
                          {isPending ? (
                            <>
                              <Loader2 className="mr-3 animate-spin" />
                              Updating Bio...
                            </>
                          ) : (
                            "Upload Bio"
                          )}
                        </Button>
                      </div>
                    )}
                    {!button && (
                      <Button
                        onClick={() => setButton((prev) => !prev)}
                        className="w-24 bg-purple-700 hover:bg-purple-800"
                      >
                        Update Bio
                      </Button>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col w-full gap-2">
                <Input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  type="text"
                  placeholder="Enter Your Bio"
                />
                <Button
                  onClick={handleUpload}
                  className="w-24 bg-purple-700 hover:bg-purple-800"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-3 animate-spin" />
                      Updating Bio...
                    </>
                  ) : (
                    "Upload Bio"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full px-4">
          {isFollowing ? (
            <>
              <Button onClick={handleFollow} className="my-4 lg:my-0">
                {isFollowingUser ? (
                  <>
                    <Loader2 className="mr-3 animate-spin" />
                    Unfollowing...
                  </>
                ) : (
                  "Unfollow"
                )}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleFollow} className="my-4 lg:my-0">
                {isFollowingUser ? (
                  <>
                    <Loader2 className="mr-3 animate-spin" />
                    Following...
                  </>
                ) : (
                  "Follow"
                )}
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="w-full min-h-[30rem] border-[1px] border-gray-800 rounded-xl flex flex-wrap p-2 gap-2 justify-around">
        {profileUser.posts.length === 0 && (
          <div className="h-full w-full flex-center flex-col py-10 gap-4">
            <p className="text-[2rem] tracking-tighter">
              No Post Is Created.🥲
            </p>
            <Button
              onClick={() => navigate(`/create-post`)}
              className="bg-purple-700 hover:bg-purple-800"
            >
              Create Post
            </Button>
          </div>
        )}
        {profileUser.posts.map((post) => (
          <ProfilePostCard post={post} />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
