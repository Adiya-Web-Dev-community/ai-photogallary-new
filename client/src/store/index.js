import createEventReducer from "./reducer";
import appReducer from "./app";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    eventPopUP: createEventReducer,
    app: appReducer,
  },
});
