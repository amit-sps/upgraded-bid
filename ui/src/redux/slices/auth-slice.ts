import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInterface } from "../interfaces/user-interface";

interface AuthState {
  isLoggedIn: boolean;
  user: UserInterface | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getAuth(state) {
      return state;
    },
    login(state, actions: PayloadAction<UserInterface>) {
      state.isLoggedIn = true;
      state.user = actions.payload;
      return state;
    },
    logout(state) {
      localStorage.removeItem("softprodigy-bidding-token");
      state.isLoggedIn = false;
      state.user = null;
      return state;
    },
  },
});

export const { getAuth, login, logout } = authSlice.actions;

export default authSlice.reducer;
