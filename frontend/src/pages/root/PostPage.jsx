import CommentSection from "@/components/shared/CommentSection";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import * as moment from "moment";
import React, { useState } from "react";
import { FaCommentDots, FaHeart } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

const PostPage = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const [text, setText] = useState("");
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
  });
  const { data: post, isLoading } = useQuery({
    queryKey: ["getPost"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/v1/posts/${id}`);
        if (!res.data.success) {
          return null;
        }
        return res.data.post;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
  });
  const { mutateAsync: Comment, isPending } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(`/api/v1/posts/comment/${post._id}`, {
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
      queryClient.invalidateQueries({ queryKey: ["getPost"] });
    },
  });
  const { mutateAsync: LikePost } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.post(`/api/v1/posts/like/${post._id}`);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data;
      } catch (e) {
        console.log(e);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPost"] });
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen w-full flex-center">
        <Loader2 className="mr-3 animate-spin" />
        <h1>Loading....</h1>
      </div>
    );
  }

  const isLiked = post.likes.includes(authUser._id);

  const handleLike = async () => {
    await LikePost();
  };
  const handleComment = async () => {
    await Comment();
    setText("");
  };

  return (
    <div className="p-4 bg-black min-h-screen w-full flex flex-col items-center justify-start gap-3">
      <div className="w-full h-[5rem] bg-black flex items-center justify-between rounded-xl px-5 border-[1px] border-zinc-800 cursor-default">
        <Link
          to={`/profile/${post.user.username}`}
          className="flex items-center gap-4"
        >
          <img
            src={post.user.profileImg}
            alt="profile"
            className="w-14 h-14 rounded-full object-cover"
          />
          <div>
            <h1 className="text-[0.9rem] leading-4 tracking-tight">
              {post.user.name}
            </h1>
            <h1 className="text-[0.7rem] tracking-tight text-gray-500">
              @{post.user.username}
            </h1>
          </div>
        </Link>
        <div>
          <h1 className="text-[0.9rem] tracking-tight">
            {moment(post.createdAt).fromNow()}
          </h1>
        </div>
      </div>
      <div className="h-[30rem] w-full border-[1px] border-zinc-800 rounded-xl">
        <img
          src={post.img}
          alt="postImg"
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex justify-start w-full px-5 gap-4">
        <div className="flex items-center gap-1">
          <FaHeart
            onClick={handleLike}
            className={`size-5 hover:text-red-600 cursor-pointer ${
              isLiked ? "text-red-600" : ""
            }`}
          />
          <h1 className={`${isLiked ? "text-red-600" : ""}`}>
            {post.likes.length}
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
          <h1>{post.comments.length}</h1>
        </div>
      </div>
      <div className="min-h-[3rem] w-full flex items-center justify-start px-5 border-[1px] border-zinc-800 rounded-xl">
        <h1>{post.text}</h1>
      </div>
      <div className="min-h-[10rem] w-full p-3 border-[1px] border-zinc-800 rounded-xl">
        <CommentSection post={post} />
      </div>
    </div>
  );
};

export default PostPage;
