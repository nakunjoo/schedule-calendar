"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { OptionState } from "@/stores/slices/option-slices";
import { preventScroll, allowScroll } from "@/utils/scrollEvent";

export default function DatePickerModal({
  isOpen,
  setIsOpen,
  currentMonth,
  setCurrentMonth,
  userOptions,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  userOptions: OptionState;
}) {
  const [selectedYear, setSelectedYear] = useState(currentMonth.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.getMonth());

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  const months = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const handleApply = () => {
    setCurrentMonth(new Date(selectedYear, selectedMonth));
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
    setCurrentMonth(today);
    setIsOpen(false);
  };

  // 모달이 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      preventScroll();
    } else {
      allowScroll();
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      allowScroll();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      />
      <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-visible">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: userOptions.themeColor }}
              >
                <Icon
                  icon="heroicons:calendar-days"
                  className="w-5 h-5 text-white"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                날짜 선택
              </h3>
            </div>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <Icon
                icon="heroicons:x-mark"
                className="w-5 h-5 text-gray-500"
              />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Year Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Icon icon="heroicons:calendar" className="w-4 h-4" />
                년도 선택
              </label>
              <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-xl custom-scrollbar">
                {years.map((year) => (
                  <button
                    key={year}
                    className={`p-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      selectedYear === year
                        ? 'text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: selectedYear === year ? userOptions.themeColor : 'transparent'
                    }}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}년
                  </button>
                ))}
              </div>
            </div>

            {/* Month Selection */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Icon icon="heroicons:calendar-days" className="w-4 h-4" />
                월 선택
              </label>
              <div className="grid grid-cols-4 gap-2">
                {months.map((month, index) => (
                  <button
                    key={index}
                    className={`p-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      selectedMonth === index
                        ? 'text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: selectedMonth === index ? userOptions.themeColor : 'transparent'
                    }}
                    onClick={() => setSelectedMonth(index)}
                  >
                    {month}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Date Preview */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2">
                <Icon icon="heroicons:eye" className="w-4 h-4 text-gray-500" />
                <span className="text-lg font-semibold text-gray-800">
                  {selectedYear}년 {selectedMonth + 1}월
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                className="px-4 py-3 text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                onClick={handleToday}
              >
                <Icon icon="heroicons:home" className="w-4 h-4" />
                오늘
              </button>
              <button
                className="px-4 py-3 text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex-1"
                onClick={() => setIsOpen(false)}
              >
                취소
              </button>
              <button
                className="flex-1 px-4 py-3 text-white font-medium rounded-xl transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: userOptions.themeColor }}
                onClick={handleApply}
              >
                <Icon icon="heroicons:check" className="w-4 h-4" />
                적용
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}