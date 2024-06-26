import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../assets";

export interface UserInterface {
    role: string;
    isEmailVerified: boolean;
    isActive: boolean;
    deleted: boolean;
    skills: string[];
    _id: string;
    username: string;
    name: string;
    email: string;
    __v: number;
}

interface UserResponseInterface {
  data: UserInterface[];
}

export const UsersAPIs = createApi({
  reducerPath: "UsersAPIs",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders(headers) {
      headers.set(
        "x-access-token",
        `${localStorage.getItem("softprodigy-bidding-token")}`
      );
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      getAllUsers: builder.query<UserResponseInterface, void>({
        query: () => ({
          url: `/users/`,
        }),
      }),
    };
  },
});

export const { useGetAllUsersQuery } = UsersAPIs;
