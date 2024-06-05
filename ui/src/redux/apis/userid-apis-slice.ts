import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../assets";

export interface UserIdInterface {
  _id: string;
  portal: string;
  id: string;
}

interface UserIdResponseInterface {
  userId: UserIdInterface[];
}

export const UserIdsAPIs = createApi({
  reducerPath: "UserIdsAPIs",
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
      getUserIdList: builder.query<UserIdResponseInterface, void>({
        query: () => ({
          url: `/userId/getUserId`,
        }),
      }),
    };
  },
});

export const { useGetUserIdListQuery } = UserIdsAPIs;
