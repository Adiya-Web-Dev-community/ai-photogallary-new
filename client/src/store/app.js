import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    token: null,
  },
  reducers: {
    setToken: (state, { payload }) => {
      state.token = payload;
    },
  },
});

export default appSlice.reducer;
export const { setToken } = appSlice.actions;
