import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { UserInterface } from "../redux/interfaces/user-interface";
import { login } from "../redux/slices/auth-slice";
import { Navigate, useNavigate } from "react-router-dom";
import { roleGuard } from "../HOC/RoleGuard";
import { Roles } from "../assets";

interface LoginResponseInterface {
  token: string;
  user: UserInterface;
}

interface LoginProps {
}

const Login: React.FC<LoginProps> = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);

  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const err = loginValidate(loginDetails);
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await axios.post("/auth/login", loginDetails);

      const { token, user }: LoginResponseInterface = response.data;

      localStorage.setItem("softprodigy-bidding-token", token);

      dispatch(login(user));
      toast("Logged in to bidding dashboard.", { autoClose: 1000 });
      navigate("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const responseData = error?.response?.data;
      if (responseData?.errors?.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responseData.errors.forEach((err: any) =>
          toast.error(err.msg, { autoClose: 1000 })
        );
      } else {
        const errorMessage = responseData
          ? responseData?.message
          : "Invalid credentials.";
        toast.error(errorMessage, { autoClose: 1000 });
      }
    }
  };

  const resetPasswordLink = async () => {
    try {
      setErrors({});

      if (!loginDetails.username) {
        return setErrors({
          username:
            "Please enter your username or email to reset your password.",
        });
      }

      const { data } = await axios.post("/auth/forgotPassword", {
        email: loginDetails.username,
      });

      toast(data?.message, { autoClose: 1000 });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      toast.warn(error?.response?.data?.message || "Something went wrong.", {
        autoClose: 1000,
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function loginValidate(initialValues: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err: any = {};
    if (initialValues?.username.length === 0) {
      err.username = "User name required";
    } else if (initialValues?.username.length <= 2) {
      err.username = "Invalid name";
    }
    if (initialValues?.password.length === 0) {
      err.password = "Password required";
    }
    return err;
  }

  const getProfile = async () => {
    try {
      const { data } = await axios.get(`/auth/profile/`, {
        headers: {
          "x-access-token": `${localStorage.getItem(
            "softprodigy-bidding-token"
          )}`,
        },
      });
      dispatch(login(data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("softprodigy-bidding-token")) {
      getProfile();
    }
  }, []);

  if (isLoggedIn && user) {
    return (
      <Navigate
        to={
          roleGuard([Roles.Admin, Roles.AmitOnly, Roles.BidOnly], user.role)
            ? "/dashboard"
            : "/dashboard/resources"
        }
      />
    );
  }

  return (
    <>
      <div className="bg-gray-800 min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[35%]">
          <div className="mb-6">
            <img
              src={
                "https://dm1wsvzj3kcu0.cloudfront.net/wp-content/uploads/2023/06/logo.svg"
              }
              alt="Logo"
              className="h-8 w-[120px]"
            />
          </div>

          <h3 className="text-lg font-bold mb-6 text-center text-gray-800">
            Bidding Info Login
          </h3>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  onChange={handleChange}
                  className="outline-none block w-full rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
                {errors.username && (
                  <small className="text-red-500">*{errors?.username}</small>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  onChange={handleChange}
                  className="block w-full outline-none rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
                {errors.password && (
                  <small className="text-red-500">*{errors?.password}</small>
                )}
              </div>
            </div>
            <div className="text-center text-xs text-bold">
              <span className="text-gray-600">Forgot password?</span>{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={resetPasswordLink}
              >
                Click
              </span>
            </div>

            <div className="flex">
              <button
                type="submit"
                className="ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-8 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Login
              </button>
            </div>
            {/* <div className="text-center">
              <span className="text-gray-600">Don't have an account?</span>{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setLoginPage(false)}
              >
                Register
              </span>
            </div> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
