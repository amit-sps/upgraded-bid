import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../assets";

export interface Resource {
    _id: string;
  title: string;
  link: string;
  coverImage: string;
  description: string;
  postedBy: {
    _id: string;
    name: string;
  };
}

interface ResourceResponseInterface {
  data: Resource[];
}

export const ResourceAPIs = createApi({
  reducerPath: "ResourceAPIs",
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
      getResourceList: builder.query<ResourceResponseInterface, void>({
        query: () => ({
          url: `/resource/`,
        }),
      }),
      getMyAllResourceList: builder.query<ResourceResponseInterface, void>({
        query: () => ({
          url: `/resource/my/all`,
        }),
      }),
    };
  },
});

export const { useGetResourceListQuery, useGetMyAllResourceListQuery } = ResourceAPIs;
