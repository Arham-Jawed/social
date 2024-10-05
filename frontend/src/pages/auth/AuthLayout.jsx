import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full flex-center">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
