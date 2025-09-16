import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialState = {
  value: OptionState;
  isLoaded: boolean;
};

export type OptionState = {
  themeColor: string;
  bgColor: string;
  language: string;
  holiday: boolean;
  lunar: boolean;
  id: string;
};

type valueData = [type: string, value: string | boolean];

const initialState = {
  value: {
    themeColor: "",
    bgColor: "",
    language: "",
    holiday: false,
    lunar: false,
    id: "",
  } as OptionState,
  isLoaded: false,
} as InitialState;

export const option = createSlice({
  name: "calendar-option",
  initialState,
  reducers: {
    valueChange: (state, action: PayloadAction<valueData>) => {
      const type = action.payload[0];
      const value: any = { ...state.value };
      value[type] = action.payload[1];
      state.value = value;
      // 옵션 변경 시에도 로딩 상태 유지
      state.isLoaded = true;
      return state;
    },
    getOptions: (state, action: PayloadAction<any>) => {
      state.value = action.payload;
      state.isLoaded = true;
      return state;
    },
  },
});

export const { valueChange, getOptions } = option.actions;

export default option.reducer;
