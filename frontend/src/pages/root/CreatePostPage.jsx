"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { IoCreate } from "react-icons/io5";
import { useRef, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { FaImages } from "react-icons/fa6";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const {
    mutateAsync: CreatePost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (data) => {
      try {
        const res = await axios.post("/api/v1/posts/create", data);
        if (!res.data.success) {
          throw new Error(res.data.message);
        }
        return res.data;
      } catch (e) {
        console.log(e);
        toast.error("An Error Occurred While Creating The Post");
      }
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  const form = useForm({
    defaultValues: {
      text: "",
    },
  });
  const handleImageChange = (e) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const onSubmit = async (values) => {
    const data = {
      text: values.text,
      img,
    };
    if (!data.text || !data.img) {
      toast.error("Please Fill All The Details");
    }
    await CreatePost(data);
  };
  return (
    <div className="p-4 bg-black min-h-screen w-full flex flex-col justify-start">
      <div className="flex items-center justify-center">
        <IoCreate className="size-10 mr-3" />
        <h1 className="text-center text-[2.8rem] tracking-tighter cursor-default">
          Create <span className="text-purple-700">Posts</span>
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caption</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    className="border-[1px] border-gray-900"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {img && (
            <div className="h-[20rem] w-full bg-black border-[1px] border-gray-800 rounded-xl flex-center py-1 relative">
              <RxCross1
                onClick={() => {
                  setImg(null);
                  imgRef.current.value = null;
                }}
                className="absolute z-50 top-0 right-10 lg:right-56 size-8 cursor-pointer"
              />
              <img
                src={img}
                alt="post"
                className="object-contain h-full w-full lg:w-1/2"
              />
            </div>
          )}
          {!img && (
            <div className="h-[20rem] w-full bg-black border-[1px] border-gray-800 rounded-xl flex-center flex-col py-1 relative">
              <FaImages className="size-20" />
              <h1
                onClick={() => imgRef.current.click()}
                className="bg-zinc-900 px-4 py-2 rounded-xl cursor-pointer"
              >
                Browse Your Computer
              </h1>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={imgRef}
                onChange={handleImageChange}
              />
            </div>
          )}
          <Button
            className="w-full bg-purple-700 hover:bg-purple-800"
            type="submit"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin mr-1" />
                Creating...
              </>
            ) : (
              "Create Post"
            )}
          </Button>
          {isError && (
            <div className="text-center">
              <p className="tracking-tight text-red-600">{error.message}</p>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default CreatePostPage;
