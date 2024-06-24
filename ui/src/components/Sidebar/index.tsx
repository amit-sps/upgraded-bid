import { FaHome, FaMoneyBillWave, FaUser } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

const sideBarMenus = [
  {
    icon: FaHome,
    text: "Dashboard",
    link: "/dashboard",
    isAdmin: false,
  },
  {
    icon: FaMoneyBillWave,
    text: "Bids",
    link: "/dashboard/bids",
    isAdmin: false,
  },
  {
    icon: FaUser,
    text: "Teams",
    link: "/dashboard/teams",
    isAdmin: true,
  },
  {
    icon: GrResources,
    text: "Resources",
    link: "/dashboard/resources",
    isAdmin: false,
  },
];

const Sidebar = () => {
  const { isSidebarMinimize } = useAppSelector((state) => state.app);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="bg-gray-800 flex flex-col pt-10 h-full">
      <div className="flex flex-col space-y-4">
      {sideBarMenus.map((menu) => {
          if ((menu.isAdmin && user && user.isAdmin) || !menu.isAdmin) {
            return (
              <Link
                key={menu.link}
                to={menu.link}
                className="flex items-center p-4 pl-6 pr-6 text-white hover:bg-gray-700 cursor-pointer"
              >
                <menu.icon size={20} className="mr-8" />
                {!isSidebarMinimize && <span className="mr-4">{menu.text}</span>}
              </Link>
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

export default Sidebar;
