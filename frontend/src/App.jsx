import { Navigate, Route, Routes } from "react-router-dom";
import { AuthLayout, RegisterPage, LoginPage } from "./pages/auth";
import {
  RootLayout,
  HomePage,
  ProfilePage,
  CreatePostPage,
  NotificationPage,
  ExplorePage,
} from "./pages/root";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import PostPage from "./pages/root/PostPage";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/v1/auth/me");
        if (res.data.error) {
          return null;
        }
        return res.data.user;
      } catch (e) {
        return null;
      }
    },
    retry: false,
  });
  if (isLoading) {
    return (
      <main className="min-h-screen w-full flex-center">
        <Loader2 className="animate-spin w-16 mr-4" />
        <h1>Loading.....</h1>
      </main>
    );
  }
  return (
    <main className="min-h-screen w-full">
      <Routes>
        <Route element={!authUser ? <AuthLayout /> : <Navigate to="/" />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={authUser ? <RootLayout /> : <Navigate to="/login" />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Route>
      </Routes>
    </main>
  );
};

export default App;
