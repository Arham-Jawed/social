import { Bottombar, RightSidebar, Sidebar, Topbar } from "@/components/shared";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      <Sidebar />
      <Topbar />
      <section className="flex-1">
        <Outlet />
      </section>
      <Bottombar />
      <RightSidebar />
    </div>
  );
};

export default RootLayout;
