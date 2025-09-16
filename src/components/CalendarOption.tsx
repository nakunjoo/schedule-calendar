import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores/index";
import { OptionState, valueChange } from "@/stores/slices/option-slices";
import { OptionSwitch } from "@/styles/option.style";
import { updateOptionDBData } from "@/lib/db";

export default function CalendarOption({
  userOptions,
  onClose,
}: {
  userOptions: OptionState;
  onClose?: () => void;
}) {
  const [themeOpen, setThemeOpen] = useState<boolean>(false);
  const [bgOpen, setBgOpen] = useState<boolean>(false);
  const [themeTab, setThemeTab] = useState<string>('basic');
  const [bgTab, setBgTab] = useState<string>('light');

  // 테마색 팔레트 정의
  const themeColorPalettes = {
    basic: {
      name: '기본',
      colors: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']
    },
    vivid: {
      name: '비비드',
      colors: ['#1D4ED8', '#DC2626', '#059669', '#D97706', '#7C3AED', '#BE185D', '#0891B2', '#65A30D']
    },
    soft: {
      name: '소프트',
      colors: ['#93C5FD', '#FCA5A5', '#6EE7B7', '#FCD34D', '#C4B5FD', '#F9A8D4', '#67E8F9', '#BEF264']
    },
    dark: {
      name: '다크',
      colors: ['#1E293B', '#374151', '#52525B', '#78716C', '#57534E', '#44403C', '#292524', '#0F172A']
    }
  };

  // 배경색 팔레트 정의
  const bgColorPalettes = {
    light: {
      name: '밝은 테마',
      colors: ['#FFFFFF', '#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#F9FAFB', '#F3F4F6', '#E5E7EB']
    },
    pastel: {
      name: '파스텔',
      colors: ['#FEF2F2', '#FEF8E1', '#F0F9FF', '#ECFDF5', '#F5F3FF', '#FDF2F8', '#F0FDFA', '#FFFBEB']
    },
    warm: {
      name: '따뜻한 톤',
      colors: ['#FFF7ED', '#FFFBEB', '#FEFCE8', '#F7FEE7', '#ECFCCB', '#FEF3C7', '#FED7AA', '#FECACA']
    },
    cool: {
      name: '시원한 톤',
      colors: ['#F0F9FF', '#EFF6FF', '#EEF2FF', '#F5F3FF', '#FAF5FF', '#FEFCE8', '#F0FDF4', '#ECFDF5']
    }
  };

  // 자동 저장 기능 추가 - 옵션 변경 시 자동으로 DB 저장
  useEffect(() => {
    const saveOptions = async () => {
      await updateOptionDBData(userOptions);
    };
    if (userOptions.themeColor && userOptions.bgColor) {
      saveOptions();
    }
  }, [userOptions]);

  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="w-52 sm:w-72 rounded-xl sm:rounded-2xl bg-white absolute top-8 sm:top-14 right-0 sm:-right-2 z-40 shadow-2xl border border-gray-200">
      <div className="w-full p-3 sm:p-5 space-y-3 sm:space-y-5">
        {/* 헤더와 닫기 버튼 */}
        <div className="flex justify-between items-center pb-2 sm:pb-3 border-b border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">설정</h3>
          <button
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={onClose}
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base font-semibold text-gray-800">테마색</span>
          <div className="relative">
            <button
              className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-gray-300 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200"
              style={{ backgroundColor: userOptions.themeColor }}
              onClick={() => setThemeOpen(!themeOpen)}
            />
            {themeOpen && (
              <>
                <div
                  className="fixed top-0 left-0 w-full h-full cursor-default z-[60]"
                  onClick={() => setThemeOpen(false)}
                />
                <div
                  className="absolute top-14 right-0 sm:-right-4 z-[70] bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-2 sm:p-4 w-48 sm:w-72"
                  onClick={(event) => event.stopPropagation()}
                >
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-4">테마색 선택</h4>
                  
                  {/* 탭 메뉴 */}
                  <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-4 bg-gray-100 rounded-lg p-0.5 sm:p-1">
                    {Object.entries(themeColorPalettes).map(([key, palette]) => (
                      <button
                        key={key}
                        className={`flex-1 py-1 sm:py-2 px-2 sm:px-3 text-[10px] sm:text-xs font-medium rounded-md transition-all duration-200 ${
                          themeTab === key 
                            ? 'bg-white text-gray-800 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                        onClick={() => setThemeTab(key)}
                      >
                        {palette.name}
                      </button>
                    ))}
                  </div>
                  
                  {/* 색상 그리드 */}
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {themeColorPalettes[themeTab as keyof typeof themeColorPalettes].colors.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border-2 hover:scale-110 transition-all duration-200 ${
                          userOptions.themeColor === color ? 'border-gray-400 scale-110' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          dispatch(valueChange(["themeColor", color]));
                          setThemeOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm sm:text-base font-semibold text-gray-800">배경색</span>
          <div className="relative">
            <button
              className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-gray-300 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200"
              style={{ backgroundColor: userOptions.bgColor }}
              onClick={() => setBgOpen(!bgOpen)}
            />
            {bgOpen && (
              <>
                <div
                  className="fixed top-0 left-0 w-full h-full cursor-default z-[60]"
                  onClick={() => setBgOpen(false)}
                />
                <div
                  className="absolute top-14 right-0 sm:-right-4 z-[70] bg-white border border-gray-200 rounded-xl sm:rounded-2xl shadow-2xl p-2 sm:p-4 w-48 sm:w-72"
                  onClick={(event) => event.stopPropagation()}
                >
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-4">배경색 선택</h4>
                  
                  {/* 탭 메뉴 */}
                  <div className="flex gap-0.5 sm:gap-1 mb-2 sm:mb-4 bg-gray-100 rounded-lg p-0.5 sm:p-1">
                    {Object.entries(bgColorPalettes).map(([key, palette]) => (
                      <button
                        key={key}
                        className={`flex-1 py-2 px-2 text-xs font-medium rounded-md transition-all duration-200 ${
                          bgTab === key 
                            ? 'bg-white text-gray-800 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                        onClick={() => setBgTab(key)}
                      >
                        {palette.name}
                      </button>
                    ))}
                  </div>
                  
                  {/* 색상 그리드 */}
                  <div className="grid grid-cols-4 gap-3">
                    {bgColorPalettes[bgTab as keyof typeof bgColorPalettes].colors.map((color) => (
                      <button
                        key={color}
                        className={`w-12 h-12 rounded-xl border-2 hover:scale-110 transition-all duration-200 ${
                          userOptions.bgColor === color ? 'border-gray-400 scale-110' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          dispatch(valueChange(["bgColor", color]));
                          setBgOpen(false);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="space-y-4 border-t border-gray-100 pt-1 sm:pt-6">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base font-semibold text-gray-800">공휴일</span>
            <OptionSwitch>
              <input
                type="checkbox"
                id="holiday_switch"
                className="switch"
                checked={userOptions.holiday}
                onChange={async (e) => {
                  dispatch(valueChange(["holiday", e.target.checked]));
                }}
              />
              <label htmlFor="holiday_switch"></label>
            </OptionSwitch>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base font-semibold text-gray-800">음력</span>
            <OptionSwitch>
              <input
                type="checkbox"
                id="lunar_switch"
                className="switch"
                checked={userOptions.lunar}
                onChange={async (e) => {
                  dispatch(valueChange(["lunar", e.target.checked]));
                }}
              />
              <label htmlFor="lunar_switch"></label>
            </OptionSwitch>
          </div>
        </div>
      </div>
    </div>
  );
}
