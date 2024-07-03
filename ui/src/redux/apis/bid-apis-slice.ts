import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseURL } from "../../assets";
import { UserInterface } from "../interfaces/user-interface";


interface Team {
  _id: string;
  name: string;
  username: string;
  email: string;
  skills: string[];
}

interface Bidder {
  _id: string;
  name: string;
  username: string;
  email: string;
}

export interface Bid {
  _id: string;
  connect: number;
  title: string;
  team: Team;
  bidder: Bidder;
  portal: string;
  bidStatus: string;
  technology: string[];
  createdAt: string;
  updatedAt: string;
  bidLink: string;
  proposalLink: string;
}

interface BidsResponseInterface {
  bids: Bid[];
  count: number;
}

interface SkillsResponseInterface {
  data: String[];
}

interface TeamsResponseInterface {
  data: UserInterface[];
}

interface TeamQueryInterface {
  skills?: string[];
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

      getSkillLists: builder.query<SkillsResponseInterface, void>({
        query: () => ({
          url: `/bids/skills`,
        }),
      }),

      getTeamListBySkills: builder.query<
        TeamsResponseInterface,
        TeamQueryInterface
      >({
        query: ({ skills }) => {
          let queryString = `/bids/teams`;

          if (skills && skills.length > 0) {
            queryString += `?skills=${skills.join(",")}`;
          }

          return { url: queryString };
        },
      }),
    };
  },
});

export const {
  useGetBidListQuery,
  useGetSkillListsQuery,
  useGetTeamListBySkillsQuery,
} = BidAPIs;
