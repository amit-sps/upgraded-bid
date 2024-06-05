import { FaBars } from "react-icons/fa6";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "../../redux/slices/auth-slice";
import { setSidebar } from "../../redux/slices/app-slice";
import { Link } from "react-router-dom";
import Confirmation from "../Dialog/Confirmation";
import { RiLogoutCircleRLine } from "react-icons/ri";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { isSidebarMinimize } = useAppSelector((state) => state.app);
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);

  return (
    <nav className="py-4 container-bg">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-6">
          {!isSidebarMinimize && (
            <div>
              <img
                src={
                  "https://dm1wsvzj3kcu0.cloudfront.net/wp-content/uploads/2023/06/logo.svg"
                }
                alt="Logo"
                className="h-8 w-[120px]"
              />
            </div>
          )}

          <FaBars
            size={20}
            className={`cursor-pointer ${isSidebarMinimize && "ml-12"}`}
            onClick={() => dispatch(setSidebar(!isSidebarMinimize))}
          />
        </div>
        {/* Menu List Section */}
        <div>
          <ul className="flex items-center gap-10 space-x-4 text-black">
            <li className="cursor-pointer">
              <Link to={"/dashboard"}> Dashboard </Link>
            </li>
            <li className="cursor-pointer">
              <Link to={"/dashboard/bids"}> Bids</Link>
            </li>
            {isLoggedIn && user && user.isAdmin && (
              <li className="cursor-pointer">
                <Link to={"/dashboard/userids"}> User IDs</Link>
              </li>
            )}
          </ul>
        </div>
        {/* End Menu List Section */}
        <div className="block md:hidden">
          <FaBars className="text-black cursor-pointer" />
        </div>
        <div className="hidden md:block">
          <ul className="flex items-center space-x-4 gap-6">
            <li className="relative">
              <span
                className="text-red-600 cursor-pointer flex items-center gap-1"
                onClick={() => {
                  Confirmation(
                    {
                      onConfirmation: () => dispatch(logout()),
                      message: "User logged out.",
                      textMessage: "Do you want to end the session.",
                    },
                    () => {}
                  );
                }}
              >
                Logout <RiLogoutCircleRLine />
              </span>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
