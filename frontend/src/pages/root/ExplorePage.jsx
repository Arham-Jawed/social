import PostCard from "@/components/shared/PostCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

const ExplorePage = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["followingPosts"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/v1/posts/following");
        if (!res.data.success) {
          return null;
        }
        return res.data.posts;
      } catch (e) {
        return null;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex-center">
        <Loader2 className="size-7 animate-spin mr-3" />
        <h1>Loading....</h1>
      </div>
    );
  }
  return (
    <div className="p-4 bg-black min-h-screen w-full flex flex-col items-center justify-start">
      <h1 className="hidden lg:block text-[2.8rem] tracking-tighter cursor-default mb-7">
        All <span className="text-purple-700">Posts</span>
      </h1>
      <div className="w-full lg:w-2/3 flex flex-col gap-3 items-center">
        {posts.length === 0 && (
          <p className="text-[2rem] tracking-tight">
            No Posts Are Created Yet By Your Followings. 🥲
          </p>
        )}
        {posts.map((post) => (
          <PostCard key={post._id} data={post} />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;
