import { configureStore } from "@reduxjs/toolkit";
import appSlice from "./slices/app-slice";
import { authApi } from "./apis/auth-apis-slice";
import authSlice from "./slices/auth-slice";
import { DashboardApis } from "./apis/dashboard-api-slice";
import { BidAPIs } from "./apis/bid-apis-slice";
import { UserIdsAPIs } from "./apis/userid-apis-slice";

export const store = configureStore({
  reducer: {
    app: appSlice,
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [DashboardApis.reducerPath]: DashboardApis.reducer,
    [BidAPIs.reducerPath]: BidAPIs.reducer,
    [UserIdsAPIs.reducerPath]: UserIdsAPIs.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(DashboardApis.middleware)
      .concat(BidAPIs.middleware)
      .concat(UserIdsAPIs.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
