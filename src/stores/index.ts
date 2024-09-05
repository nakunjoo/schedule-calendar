import { configureStore } from "@reduxjs/toolkit";
import optionReducer from "./slices/option-slices";

export const store = configureStore({
  reducer: {
    optionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
