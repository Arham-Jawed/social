import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { MdDelete } from "react-icons/md";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const { data: Notifications, isLoading } = useQuery({
    queryKey: ["getNotification"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/v1/notifications");
        if (!res.data.success) {
          return null;
        }
        return res.data.notifications;
      } catch (e) {
        console.log(e);
        return null;
      }
    },
  });

  const { mutateAsync: Delete } = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await axios.delete(`/api/v1/notifications/${id}`);
        console.log(res);
        if (!res.data.success) {
          return null;
        }
        return true;
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getNotification"],
      });
    },
  });
  const { mutateAsync: DeleteAll } = useMutation({
    mutationFn: async () => {
      try {
        const res = await axios.delete(`/api/v1/notifications`);
        console.log(res);
        if (!res.data.success) {
          return null;
        }
        return true;
      } catch (e) {
        console.log(e);
        toast.error(e.response.data.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["getNotification"],
      });
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="mr-3 animate-spin" />
        <h1>Loading Notifications...</h1>
      </div>
    );
  }

  const handleDeleteAll = async () => {
    await DeleteAll();
  };

  return (
    <div className="p-4 bg-black min-h-screen w-full flex flex-col items-center justify-start">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-[2.5rem] tracking-tighter">
          All <span className="text-purple-700">Notifications</span>
        </h1>
        {Notifications.length !== 0 && (
          <Button
            onClick={handleDeleteAll}
            className="bg-red-600 hover:bg-red-700"
          >
            Delete All
          </Button>
        )}
      </div>
      <div className="w-full flex flex-col gap-3 mt-3">
        {Notifications.length === 0 && (
          <p className="text-[1.5rem] tracking-tight">No Notifications</p>
        )}
        {Notifications.map((notifi) => (
          <div
            key={notifi._id}
            className="h-[8rem] w-full bg-black border-[1px] border-gray-900 flex flex-col items-start justify-center px-4 rounded-xl cursor-default"
          >
            <div className="flex gap-3 items-center">
              <img
                src={notifi.from.profileImg}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h1>@{notifi.from.username}</h1>
            </div>
            <div className="px-12 flex justify-between items-center w-full">
              {notifi.type === "follow" && (
                <p>
                  {notifi.from.username.toUpperCase()} Has Followed You On
                  Threads.❤️
                </p>
              )}
              {notifi.type === "like" && (
                <p>
                  {notifi.from.username.toUpperCase()} Has Liked Your Post On
                  Threads.❤️
                </p>
              )}
              <div>
                <MdDelete
                  onClick={() => {
                    Delete(notifi._id);
                  }}
                  className="text-red-600 w-7 h-7 cursor-pointer"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;
