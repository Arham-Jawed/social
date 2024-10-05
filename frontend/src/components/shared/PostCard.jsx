import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import { CiMenuKebab } from "react-icons/ci";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import { FaCommentDots } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const PostCard = ({ data }) => {
  const [text, setText] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });

  const { mutateAsync: DeletePost } = useMutation({
    mutationFn: async () => {
      const res = await axios.delete(`/api/v1/posts/${data._id}`);
      if (!res.data.success) {
        throw new Error(res.data.message);
      }
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });
  const handlePostDelete = async () => {
    await DeletePost();
  };

  const { mutateAsync: LikePost } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(`/api/v1/posts/like/${data._id}`);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data;
      } catch (e) {
        console.log(e);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["followingPosts"] });
    },
  });

  const isLiked = data.likes.includes(authUser._id);

  const handleLike = async () => {
    await LikePost();
  };

  const { mutateAsync: Comment, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(`/api/v1/posts/comment/${data._id}`, {
          text,
        });
        console.log(res);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data;
      } catch (e) {
        console.log(e);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });

  const topComments = data.comments.reverse().slice(0, 4);

  const handleComment = async () => {
    await Comment();
    setText("");
  };
  return (
    <div className="w-full min-h-[36rem] bg-black rounded-xl border-[1px] border-gray-900 cursor-default">
      <div className="h-[4rem] w-full border-b-[1px] border-gray-900 flex items-center justify-between px-3">
        <Link
          to={`/profile/${data.user.username}`}
          className="flex items-center gap-2"
        >
          <img
            src={data?.user.profileImg || "/assets/profile.webp"}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h1 className="text-[0.8rem] leading-5">{data?.user?.name}</h1>
            <p className="text-[0.7rem] leading-3">@{data?.user?.username}</p>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <p className="text-[0.8rem] tracking-tighter">
            {moment(data.createdAt).fromNow()}
          </p>
          {authUser?._id === data.user._id && (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <CiMenuKebab className="size-6" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-zinc-900 border-[1px] border-gray-900">
                <DropdownMenuItem className="cursor-pointer">
                  <h1 onClick={handlePostDelete} className="text-red-500">
                    Delete
                  </h1>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div
        onClick={() => navigate(`/post/${data._id}`)}
        className="w-full h-[28rem] overflow-hidden p-1 cursor-pointer"
      >
        <img
          src={data.img}
          alt="postImage"
          className="object-contain object-center h-full w-full"
        />
      </div>
      <div className="px-5 w-full">
        <h1 className="text-[0.9rem] tracking-tighter leading-5">
          {data.text}
        </h1>
      </div>
      <div className="w-full h-[2rem] flex items-center justify-start gap-5 px-5">
        <div className="flex items-center gap-1">
          <FaHeart
            onClick={handleLike}
            className={`size-5 hover:text-red-600 cursor-pointer ${
              isLiked ? "text-red-600" : ""
            }`}
          />
          <h1 className={`${isLiked ? "text-red-600" : ""}`}>
            {data.likes.length}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          <Dialog>
            <DialogTrigger asChild>
              <FaCommentDots className="size-5 hover:text-gray-600 cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-[1px] border-gray-900">
              <DialogHeader>
                <DialogTitle>Comments</DialogTitle>
              </DialogHeader>
              <div className="min-h-[10rem] w-full flex flex-col">
                {topComments.map((comment) => (
                  <div className="h-[5rem] w-full border-b-[1px] border-gray-500 flex flex-col gap-2 items-start justify-center px-3">
                    <h4 className="text-[0.7rem] tracking-tighter">
                      @{comment.user.username}
                    </h4>
                    <p className="text-[0.8rem] tracking-tighter">
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 py-4">
                <div className="flex flex-col items-start gap-3">
                  <Label htmlFor="username" className="text-right">
                    Text
                  </Label>
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    type="text"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose>
                  <Button
                    onClick={handleComment}
                    className="bg-purple-700 hover:bg-purple-800"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-3 animate-spin" />
                        Commenting...
                      </>
                    ) : (
                      "Comment"
                    )}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <h1>{data.comments.length}</h1>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
