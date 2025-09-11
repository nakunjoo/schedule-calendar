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
  start: string;
  end: string;
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
    deleteSchedule: (state, action: PayloadAction<string>) => {
      const newArr = [];
      for (const schedule of state) {
        if (action.payload !== schedule.id) {
          newArr.push(schedule);
        }
      }
      state = newArr;
      return state;
    },
    setSchedule: (state, action: PayloadAction<ScheduleData[]>) => {
      state = action.payload;
      return state;
    },
    updateSchedule: (state, action: PayloadAction<ScheduleData>) => {
      const index = state.findIndex(schedule => schedule.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
      return state;
    },
  },
});

export const { addSchedule, deleteSchedule, setSchedule, updateSchedule } = schedules.actions;

export default schedules.reducer;
