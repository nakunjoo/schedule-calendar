import CalendarWrap from "@/components/Calendar";
import Footer from "@/components/Footer";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/index";

export default function Calendars() {
  const bgColor = useSelector(
    (state: RootState) => state.optionReducer.value.bgColor
  );
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bgColor }}>
      <div className="flex-1">
        <CalendarWrap />
      </div>
      <Footer />
    </div>
  );
}
