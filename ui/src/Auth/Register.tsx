import axios from "../axios";
import React, { useState } from "react";
// import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { registerAuth } from "../Context/apis/index";
interface RegisterProps {
  setLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
}

const Register: React.FC<RegisterProps> = ({ setLoginPage }) => {
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const err = validate(newUser);
    if (Object.keys(err).length) {
      setErrors(err);
      return;
    }
    try {
      await axios.post("/auth/register", newUser);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const validate = (values: any): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.name) {
      errors.name = "Name is required";
    }

    if (!values.username) {
      errors.username = "Username is required";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    if (!values.confirm_password) {
      errors.confirm_password = "Confirm Password is required";
    } else if (values.confirm_password !== values.password) {
      errors.confirm_password = "Passwords do not match";
    }

    return errors;
  };

  return (
    <>
      <ToastContainer />
      <div className="bg-gray-800 min-h-screen flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
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
            Bidding Info Register
          </h3>
          <form
            noValidate
            className="space-y-4"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  onChange={handleChange}
                  className="outline-none block w-full rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
              </div>
              {errors.name && (
                <small className="text-red-500">*{errors?.name}</small>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
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
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  onChange={handleChange}
                  className="outline-none block w-full rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
                {errors.email && (
                  <small className="text-red-500">*{errors?.email}</small>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
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
                  className="outline-none block w-full rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
                {errors.password && (
                  <small className="text-red-500">*{errors?.password}</small>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  required
                  onChange={handleChange}
                  className="outline-none block w-full rounded-md border-0 px-2 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
                {errors.confirm_password && (
                  <small className="text-red-500">
                    *{errors?.confirm_password}
                  </small>
                )}
              </div>
            </div>

            <div className="flex">
              <button
                type="submit"
                className="ml-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-8 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Register
              </button>
            </div>
            <div className="text-center">
              <span className="text-gray-600">Already have an account?</span>{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => setLoginPage(true)}
              >
                Login
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
