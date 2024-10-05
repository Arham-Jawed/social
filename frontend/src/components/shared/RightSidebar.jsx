import { DummyData } from "../../../data/dummyData";
import React from "react";
import SuggestedUser from "./SuggestedUser";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";

const RightSidebar = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUser"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/v1/users/suggested");
        if (!res.data.success) {
          return null;
        }
        return res.data.suggestedUsers;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex-center">
        <Loader2 className="mr-2 animate-spin" />
        <h1>Loading.....</h1>
      </div>
    );
  }

  return (
    <div className="hidden w-[18rem] h-screen sticky top-0 right-0 bg-black border-l-[1px] border-zinc-800 lg:flex flex-col items-center py-9 justify-start">
      <h1 className="text-[2rem] tracking-tighter underline mb-8">
        Suggested Users
      </h1>
      <div className="w-full flex flex-wrap gap-2 justify-center">
        {suggestedUsers.map((users) => (
          <SuggestedUser key={Math.random()} data={users} />
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
