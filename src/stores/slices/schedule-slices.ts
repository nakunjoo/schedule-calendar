import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryData } from "./category-slices";

export type ScheduleData = {
  type: string;
  turn: number;
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  category: CategoryData;
  memo: string;
  start: Date | null;
  end: Date | null;
};

const initialState = [] as ScheduleData[];

export const schedules = createSlice({
  name: "calendar-schedules",
  initialState,
  reducers: {
    addSchedule: (state, action: PayloadAction<ScheduleData>) => {
      state.push(action.payload);
      return state;
    },
    deleteSchedule: (state, action: PayloadAction<number>) => {
      state.splice(action.payload, 1);
      return state;
    },
  },
});

export const { addSchedule, deleteSchedule } = schedules.actions;

export default schedules.reducer;
