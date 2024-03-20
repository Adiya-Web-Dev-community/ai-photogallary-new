import { createSlice } from "@reduxjs/toolkit";

const favouritesSlice = createSlice({
  name: "favourites",
  initialState: {
    favouriteImages: null,
  },
  reducers: {
    setFavouriteImages: (state, { payload }) => {
      state.token = payload;
    },
  },
});

export default favouritesSlice.reducer;
export const { setFavouriteImages } = favouritesSlice.actions;
