import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserInterface } from "../interfaces/user-interface";
import { LoginInterface } from "../interfaces/auth-interface";
import { baseURL } from "../../assets";

interface AuthResponse {
  token: string;
  user: UserInterface;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseURL}/auth/login`,
    prepareHeaders(headers) {
      headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`);
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      login: builder.mutation<AuthResponse, LoginInterface>({
        query: ({ username, password }) => ({
          url: `/auth/login`,
          method: "POST",
          body: { username, password },
        }),
      }),
    };
  },
});

export const { useLoginMutation } = authApi;
