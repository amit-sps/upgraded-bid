import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../assets";

interface BidStatistics {
    totalCountBid: number;
    countToday: number;
    countWeek: number;
    lastMonthBidCount: number;
    currentMonthBidCount: number;
    dateStartLastMonth: string;
    dateEndLastMonth: string;
  }

export interface UserData {
    username: string;
    todayBids: number;
    yesturdayBids: number;
    convertedBids: number;
    submittedBids: number;
    totalBids: number;
  }

  interface PortalRecordItem {
    name: string;
    Upwork: number;
    Guru: number;
    PPH: number;
    Linkedin: number;
    Appfutura: number;
    EmailMarketing: number;
  }
  

  interface UserTableResponse {
    userBids: UserData[]
  }

  interface PortalRecordsResponse {
    data: PortalRecordItem[]
  }
  
  interface BidderData {
    totalBidNo: number;
    nameofbidder: string;
  }

  interface BidderDataResponse {
    Bid: BidderData[]
  }
  

  interface QueryInterface {
    bidType?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }
  
  

export const DashboardApis = createApi({
  reducerPath: "DashboardApis",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders(headers) {
      headers.set("x-access-token", `${localStorage.getItem("softprodigy-bidding-token")}`);
      return headers;
    },
  }),
  endpoints(builder) {
    return {
      getBidStatistics: builder.query<BidStatistics, void>({
        query: () => ({
          url: `/bids/biduser`,
        }),
      }),
      getBidTable: builder.query<UserTableResponse, void>({
        query: () => ({
          url: `/bids/getBidTable`,
        }),
      }),
      getBiderData: builder.query<BidderDataResponse, QueryInterface>({
        query: ({bidType, startDate, endDate, status}) =>{

          let queryString = `/bids/countUserBids?`;
  
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
      getPortalRecords: builder.query<PortalRecordsResponse, void>({
        query: () => ({
          url: `/bids/getAllPortalRecords`,
        }),
      }),
    };
  },
});

export const { useGetBidStatisticsQuery, useGetBiderDataQuery, useGetBidTableQuery, useGetPortalRecordsQuery } = DashboardApis;
