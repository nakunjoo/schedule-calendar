import CalendarWrap from "@/components/Calendar";
import AuthButton from "@/components/AuthButton";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/index";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";

export default function Calendars() {
  const bgColor = useSelector(
    (state: RootState) => state.optionReducer.value.bgColor
  );
  const isOptionsLoaded = useSelector(
    (state: RootState) => state.optionReducer.isLoaded
  );
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-gray-100">
        <div>로딩중...</div>
      </div>
    );
  }

  return (
    <div 
      className={`w-full min-h-screen flex justify-between flex-col ${!isOptionsLoaded || !bgColor ? 'bg-gray-100' : ''}`} 
      style={{ backgroundColor: isOptionsLoaded && bgColor ? bgColor : undefined }}
    >
      <div className="w-full min-h-full">
        <div className="w-full flex justify-end p-4">
          <AuthButton />
        </div>
        {user ? (
          <CalendarWrap />
        ) : (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">일정 캘린더에 오신 것을 환영합니다!</h2>
              <p className="text-gray-600 mb-8">Google 계정으로 로그인하여 일정을 관리하세요.</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
