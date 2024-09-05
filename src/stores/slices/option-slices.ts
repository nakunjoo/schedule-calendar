import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: OptionState;
};

export type OptionState = {
  themeColor: string;
  bgColor: string;
  language: string;
  holiday: boolean;
  anniversary: boolean;
  exquisiteness: boolean;
  lunar: boolean;
  uId: string;
};

type valueData = [type: string, value: string | boolean];

const initialState = {
  value: {
    themeColor: "#aa5fd3",
    bgColor: "#c5e4f7",
    language: "Ko",
    holiday: true,
    anniversary: false,
    exquisiteness: false,
    lunar: false,
    uId: "",
  } as OptionState,
} as InitialState;

export const option = createSlice({
  name: "calendar-option",
  initialState,
  reducers: {
    valueChange: (state, action: PayloadAction<valueData>) => {
      const type = action.payload[0];
      state.value[type] = action.payload[1];
      return state;
    },
  },
});

export const { valueChange } = option.actions;

export default option.reducer;
