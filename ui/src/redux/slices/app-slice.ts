import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AppState {
  isSidebarMinimize: boolean,
  appLoading: boolean,
}

const initialState: AppState = {
  isSidebarMinimize: false,
  appLoading: false
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    getApp(state) {
      return state;
    },
    setSidebar(state, actions:PayloadAction<boolean>) {
      state.isSidebarMinimize = actions.payload;
      return state;
    },
    setAppLoading(state, actions:PayloadAction<boolean | undefined>) {
      state.appLoading = actions.payload ?? true;
      return state;
    },
  },
});

export const { getApp, setSidebar } = appSlice.actions;

export default appSlice.reducer;