import { FaHome, FaMoneyBillWave, FaUsers } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { Role, Roles } from "../../assets";
import { roleGuard } from "../../HOC/RoleGuard";
import { FaUserSecret } from "react-icons/fa6";

interface SideBarMenuItem {
  icon: React.ComponentType | any;
  text: string;
  link: string;
  canAccess: Role[];
}

const sideBarMenus:SideBarMenuItem[] = [
  {
    icon: FaHome,
    text: "Dashboard",
    link: "/dashboard",
    canAccess: [Roles.Admin, Roles.AmitOnly],
  },
  {
    icon: FaMoneyBillWave,
    text: "Bids",
    link: "/dashboard/bids",
    canAccess: [Roles.Admin, Roles.AmitOnly, Roles.BidOnly],
  },
  {
    icon: FaUserSecret,
    text: "Teams",
    link: "/dashboard/teams",
    canAccess: [Roles.Admin, Roles.AmitOnly],
  },
  {
    icon: FaUsers,
    text: "Users",
    link: "/dashboard/users",
    canAccess: [Roles.Admin, Roles.AmitOnly],
  },
  {
    icon: GrResources,
    text: "Resources",
    link: "/dashboard/resources",
    canAccess: [Roles.ForAll],
  },
];

const Sidebar = () => {
  const { isSidebarMinimize } = useAppSelector((state) => state.app);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="bg-gray-800 flex flex-col pt-10 h-full">
      <div className="flex flex-col space-y-4">
      {sideBarMenus.map((menu) => {
          if ((menu.canAccess && user && roleGuard(menu.canAccess,user.role)) || menu.canAccess.includes(Roles?.ForAll)) {
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
