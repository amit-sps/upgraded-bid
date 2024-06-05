import React from "react";
import { FaLock } from "react-icons/fa";
import { useAppDispatch } from "../../redux/hooks";
import { logout } from "../../redux/slices/auth-slice";

const NotAuthorized: React.FC = () => {
  const dispatch = useAppDispatch();
  const goToLoginPage = () => {
    localStorage.clear();
    dispatch(logout());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <FaLock className="text-4xl text-gray-600 mb-4" />
      <h1 className="text-3xl font-bold mb-4">Not Authorized</h1>
      <p className="text-lg text-gray-600 mb-8">
        You do not have permission to access this page.
      </p>
      <button
        onClick={goToLoginPage}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Go to Login
      </button>
    </div>
  );
};

export default NotAuthorized;
