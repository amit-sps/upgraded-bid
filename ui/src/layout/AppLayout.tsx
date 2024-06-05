import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div className="flex flex-1">
        <div className="min-h-full overflow-hidden">
          <Sidebar />
        </div>
        <div className="flex-1 wrapper-bg overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
