import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../assets";

export interface Bid {
  _id: string;
  username: string;
  nameofbidder: string;
  status: string;
  connect: number;
  idUsedForBid: string;
  JobTitle: string;
  URL: string;
  bidderId: string;
  department: string;
  portal: string;
  jobLink: string;
  technology: string;
  bidType: string;
  createdAt: string;
  updatedAt: string;
  IdUsed: string;
}
interface BidsResponseInterface {
  bids: Bid[];
  count: number;
}
interface QueryInterface {
  pageCount?: number;
  search?: string | null | undefined;
  bidType?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const BidAPIs = createApi({
  reducerPath: "BidAPIs",
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
      getBidList: builder.query<BidsResponseInterface, QueryInterface>({
        query: ({ pageCount, search, bidType, status, startDate, endDate }) => {
          let queryString = `/bids/getBid`;
  
          if (pageCount) {
            queryString += `?pageCount=${pageCount}`;
          }
  
          if (search) {
            queryString += `&search=${search}`;
          }
  
          if (bidType) {
            queryString += `&bidType=${bidType}`;
          }
  
          if (status) {
            queryString += `&status=${status}`;
          }
          if (startDate) {
            queryString += `&startDate=${startDate}`;
          }
          if (endDate) {
            queryString += `&endDate=${endDate}`;
          }

  
          return { url: queryString };
        },
      }),
    };
  },
  
});

export const { useGetBidListQuery } = BidAPIs;
