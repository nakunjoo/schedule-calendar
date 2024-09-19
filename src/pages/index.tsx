import CalendarWrap from "@/components/Calendar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/index";

export default function Calendars() {
  const bgColor = useSelector(
    (state: RootState) => state.optionReducer.value.bgColor
  );
  return (
    <div className={`w-full`} style={{ backgroundColor: bgColor }}>
      <CalendarWrap />
    </div>
  );
}
