"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import dayjs from "dayjs";
import { startOfMonth, endOfMonth } from "date-fns";
import { OptionState } from "@/stores/slices/option-slices";

export default function DatePicker({
  userOptions,
  startDate,
  setStartValue,
  endDate,
  setEndValue,
}: {
  userOptions: OptionState;
  startDate: string | null;
  endDate: string | null;
  setStartValue: React.Dispatch<React.SetStateAction<string>>;
  setEndValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  // start
  const [startOpen, setStartOpen] = useState<boolean>(false);
  const [startYearList, setStartYearList] = useState<string[]>([]);
  const [startMonthList, setStartMonthList] = useState<string[]>([]);
  const [startDayList, setStartDayList] = useState<string[]>([]);
  const [startHourList, setStartHourList] = useState<string[]>([]);
  const [startMinList, setStartMinList] = useState<string[]>([]);
  const [startYear, setStartYear] = useState<string | null>(null);
  const [startMonth, setStartMonth] = useState<string | null>(null);
  const [startDay, setStartDay] = useState<string | null>(null);
  const [startHour, setStartHour] = useState<string | null>(null);
  const [startMin, setStartMin] = useState<string | null>(null);
  // end
  const [endOpen, setEndOpen] = useState<boolean>(false);
  const [endYearList, setEndYearList] = useState<string[]>([]);
  const [endMonthList, setEndMonthList] = useState<string[]>([]);
  const [endDayList, setEndDayList] = useState<string[]>([]);
  const [endHourList, setEndHourList] = useState<string[]>([]);
  const [endMinList, setEndMinList] = useState<string[]>([]);
  const [endYear, setEndYear] = useState<string | null>(null);
  const [endMonth, setEndMonth] = useState<string | null>(null);
  const [endDay, setEndDay] = useState<string | null>(null);
  const [endHour, setEndHour] = useState<string | null>(null);
  const [endMin, setEndMin] = useState<string | null>(null);

  useEffect(() => {
    const year = parseInt(dayjs(new Date()).format("YYYY"));
    const years = [];
    const months = [];
    const hours = [];
    const mins = [];
    for (let i = year - 100; i < year + 100; i++) {
      years.push(`${i}`);
    }
    for (let i = 1; i < 13; i++) {
      let str = "";
      if (i < 10) {
        str = `0${i}`;
      } else {
        str = `${i}`;
      }
      months.push(str);
    }
    for (let i = 0; i < 24; i++) {
      let str = "";
      if (i < 10) {
        str = `0${i}`;
      } else {
        str = `${i}`;
      }
      hours.push(str);
    }
    for (let i = 0; i < 60; i++) {
      let str = "";
      if (i < 10) {
        str = `0${i}`;
      } else {
        str = `${i}`;
      }
      mins.push(str);
    }
    setStartYearList(years);
    setStartMonthList(months);
    setStartHourList(hours);
    setStartMinList(mins);

    setEndYearList(years);
    setEndMonthList(months);
    setEndHourList(hours);
    setEndMinList(mins);
  }, []);

  useEffect(() => {
    const startDayjs = dayjs(startDate).isValid() ? dayjs(startDate) : dayjs();
    const endDayjs = dayjs(endDate).isValid() ? dayjs(endDate) : dayjs();

    setStartYear(startDayjs.format("YYYY"));
    setStartMonth(startDayjs.format("MM"));
    setStartDay(startDayjs.format("DD"));
    setStartHour(startDayjs.format("HH"));
    setStartMin(startDayjs.format("mm"));

    setEndYear(endDayjs.format("YYYY"));
    setEndMonth(endDayjs.format("MM"));
    setEndDay(endDayjs.format("DD"));
    setEndHour(endDayjs.format("HH"));
    setEndMin(endDayjs.format("mm"));
  }, [startDate, endDate]);

  useEffect(() => {
    const date = dayjs(`${startYear}-${startMonth}`).format("YYYY-MM-DD");
    const monthStart = startOfMonth(date);
    const monthEnd = parseInt(dayjs(endOfMonth(monthStart)).format("D"));

    const days = [];
    for (let day = 1; day <= monthEnd; day++) {
      let str = "";
      if (day < 10) {
        str = `0${day}`;
      } else {
        str = `${day}`;
      }
      days.push(str);
    }

    if (Number(startDay) > monthEnd) {
      setStartDay(`${monthEnd}`);
    }

    setStartDayList(days);
  }, [startYear, startMonth]);

  useEffect(() => {
    if (endYear && endMonth) {
      const date = dayjs(`${endYear}-${endMonth}`).format("YYYY-MM-DD");
      const monthStart = startOfMonth(date);
      const monthEnd = parseInt(dayjs(endOfMonth(monthStart)).format("D"));

      const days = [];
      for (let day = 1; day <= monthEnd; day++) {
        let str = "";
        if (day < 10) {
          str = `0${day}`;
        } else {
          str = `${day}`;
        }
        days.push(str);
      }

      if (Number(endDay) > monthEnd) {
        setEndDay(`${monthEnd}`);
      }

      setEndDayList(days);
    }
  }, [endYear, endMonth, endDay]);

  useEffect(() => {
    if (!startOpen) return;
    const yearId = document.getElementById(`start-year-${startYear}`);
    const monthId = document.getElementById(`start-month-${startMonth}`);
    const dayId = document.getElementById(`start-day-${startDay}`);
    const hourId = document.getElementById(`start-hour-${startHour}`);
    const minId = document.getElementById(`start-min-${startMin}`);
    yearId?.focus();
    monthId?.focus();
    dayId?.focus();
    hourId?.focus();
    minId?.focus();
  }, [startOpen]);

  useEffect(() => {
    if (!endOpen) return;
    const yearId = document.getElementById(`end-year-${endYear}`);
    const monthId = document.getElementById(`end-month-${endMonth}`);
    const dayId = document.getElementById(`end-day-${endDay}`);
    const hourId = document.getElementById(`end-hour-${endHour}`);
    const minId = document.getElementById(`end-min-${endMin}`);
    yearId?.focus();
    monthId?.focus();
    dayId?.focus();
    hourId?.focus();
    minId?.focus();
  }, [endOpen]);

  useEffect(() => {
    if (startYear && startMonth && startDay && startHour && startMin && 
        startYear !== "Invalid" && startMonth !== "Invalid" && startDay !== "Invalid" && 
        startHour !== "Invalid" && startMin !== "Invalid") {
      const startValue = `${startYear}-${startMonth}-${startDay} ${startHour}:${startMin}`;
      // dayjs로 유효한 날짜인지 확인
      if (dayjs(startValue).isValid()) {
        setStartValue(startValue);
      }
    }
  }, [startYear, startMonth, startDay, startHour, startMin]);

  useEffect(() => {
    if (endYear && endMonth && endDay && endHour && endMin &&
        endYear !== "Invalid" && endMonth !== "Invalid" && endDay !== "Invalid" && 
        endHour !== "Invalid" && endMin !== "Invalid") {
      const endValue = `${endYear}-${endMonth}-${endDay} ${endHour}:${endMin}`;
      // dayjs로 유효한 날짜인지 확인
      if (dayjs(endValue).isValid()) {
        setEndValue(endValue);
      }
    }
  }, [endYear, endMonth, endDay, endHour, endMin]);

  return (
    <div className="w-full space-y-4">
      {/* Start Time */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Icon
            className="w-4 h-4"
            icon="heroicons:play"
            style={{ color: userOptions.themeColor }}
          />
          시작 시간
        </label>
        <div className="relative">
          <button
            className="w-full px-4 py-3 border border-gray-200 rounded-xl hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-left bg-white"
            onClick={() => setStartOpen(!startOpen)}
          >
            <span className="text-gray-700 font-medium">
              {startYear}년 {startMonth}월 {startDay}일 {startHour}:{startMin}
            </span>
            <Icon 
              icon={startOpen ? "heroicons:chevron-up" : "heroicons:chevron-down"} 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
            />
          </button>
          {startOpen && (
            <>
              <div
                className="fixed inset-0 z-[40]"
                onClick={() => setStartOpen(false)}
              />
              <div className="absolute top-16 left-0 right-0 z-[50] bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-600">
                  <div className="flex-1 py-3 text-center border-r border-gray-200">년도</div>
                  <div className="w-16 py-3 text-center border-r border-gray-200">월</div>
                  <div className="w-16 py-3 text-center border-r border-gray-200">일</div>
                  <div className="w-2 bg-gray-100"></div>
                  <div className="w-16 py-3 text-center border-l border-gray-200">시</div>
                  <div className="w-16 py-3 text-center">분</div>
                </div>
                {/* Date Time Selector */}
                <div className="flex h-48">
                  {/* year */}
                  <div className="flex-1 border-r border-gray-100 overflow-y-auto">
                    {startYearList.map((year, index) => (
                      <button
                        key={index}
                        id={`start-year-${year}`}
                        className={`w-full py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                          year === startYear 
                            ? "font-semibold text-white" 
                            : "text-gray-700"
                        }`}
                        style={{
                          backgroundColor: year === startYear ? userOptions.themeColor : 'transparent'
                        }}
                        onClick={() => setStartYear(year)}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                  {/* month */}
                  <div className="w-16 border-r border-gray-100 overflow-y-auto">
                    {startMonthList.map((month, index) => (
                      <button
                        key={index}
                        id={`start-month-${month}`}
                        className={`w-full py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                          month === startMonth 
                            ? "font-semibold text-white" 
                            : "text-gray-700"
                        }`}
                        style={{
                          backgroundColor: month === startMonth ? userOptions.themeColor : 'transparent'
                        }}
                        onClick={() => setStartMonth(month)}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                  {/* day */}
                  <div className="w-16 border-r border-gray-100 overflow-y-auto">
                    {startDayList.map((day, index) => (
                      <button
                        key={index}
                        id={`start-day-${day}`}
                        className={`w-full py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                          day === startDay 
                            ? "font-semibold text-white" 
                            : "text-gray-700"
                        }`}
                        style={{
                          backgroundColor: day === startDay ? userOptions.themeColor : 'transparent'
                        }}
                        onClick={() => setStartDay(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <div className="w-2 bg-gray-100"></div>
                  {/* hour */}
                  <div className="w-16 border-l border-gray-100 overflow-y-auto">
                    {startHourList.map((hour, index) => (
                      <button
                        key={index}
                        id={`start-hour-${hour}`}
                        className={`w-full py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                          hour === startHour 
                            ? "font-semibold text-white" 
                            : "text-gray-700"
                        }`}
                        style={{
                          backgroundColor: hour === startHour ? userOptions.themeColor : 'transparent'
                        }}
                        onClick={() => setStartHour(hour)}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                  {/* min */}
                  <div className="w-16 overflow-y-auto">
                    {startMinList.map((min, index) => (
                      <button
                        key={index}
                        id={`start-min-${min}`}
                        className={`w-full py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                          min === startMin 
                            ? "font-semibold text-white" 
                            : "text-gray-700"
                        }`}
                        style={{
                          backgroundColor: min === startMin ? userOptions.themeColor : 'transparent'
                        }}
                        onClick={() => setStartMin(min)}
                      >
                        {min}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Action Button */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <button
                    className="w-full py-2 px-4 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: userOptions.themeColor }}
                    onClick={() => setStartOpen(false)}
                  >
                    확인
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* End Time */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Icon
            className="w-4 h-4"
            icon="heroicons:stop"
            style={{ color: userOptions.themeColor }}
          />
          종료 시간
        </label>
        <div className="relative">
          <button
            className="w-full px-4 py-3 border border-gray-200 rounded-xl hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-left bg-white"
            onClick={() => setEndOpen(!endOpen)}
          >
            <span className="text-gray-700 font-medium">
              {endYear}년 {endMonth}월 {endDay}일 {endHour}:{endMin}
            </span>
            <Icon 
              icon={endOpen ? "heroicons:chevron-up" : "heroicons:chevron-down"} 
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" 
            />
          </button>
          {endOpen && (
            <>
              <div
                className="fixed inset-0 z-[40]"
                onClick={() => setEndOpen(false)}
              />
              <div className="absolute top-16 left-0 right-0 z-[50] bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-600">
                  <div className="flex-1 py-3 text-center border-r border-gray-200">년도</div>
                  <div className="w-16 py-3 text-center border-r border-gray-200">월</div>
                  <div className="w-16 py-3 text-center border-r border-gray-200">일</div>
                  <div className="w-2 bg-gray-100"></div>
                  <div className="w-16 py-3 text-center border-l border-gray-200">시</div>
                  <div className="w-16 py-3 text-center">분</div>
                </div>
                {/* Date Time Selector */}
                <div className="flex h-48">
                  {/* year */}
                  <div className="flex-1 border-r border-gray-100 overflow-y-auto">
                    {endYearList.map((year, index) => (
                      <button
                        key={index}
                        id={`end-year-${year}`}
                        className={`w-full py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                          year === endYear 
                            ? "font-semibold text-white" 
                            : "text-gray-700"
                        }`}
                        style={{
                          backgroundColor: year === endYear ? userOptions.themeColor : 'transparent'
                        }}
                        onClick={() => setEndYear(year)}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                  {/* month */}
                  <div className="w-16 border-r border-gray-100 overflow-y-auto">
                    {endMonthList.map((month, index) => (
                      <button
                        key={index}
                        id={`end-month-${month}`}
                        className={`w-full py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                          month === endMonth 
                            ? "font-semibold text-white" 
                            : "text-gray-700"
                        }`}
                        style={{
                          backgroundColor: month === endMonth ? userOptions.themeColor : 'transparent'
                        }}
                        onClick={() => setEndMonth(month)}
                      >
                        {month}
                      </button>
                    ))}
                  </div>
                  {/* day */}
                  <div className="w-16 border-r border-gray-100 overflow-y-auto">
                    {endDayList.map((day, index) => (
                      <button
                        key={index}
                        id={`end-day-${day}`}
                        className={`w-full py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                          day === endDay 
                            ? "font-semibold text-white" 
                            : "text-gray-700"
                        }`}
                        style={{
                          backgroundColor: day === endDay ? userOptions.themeColor : 'transparent'
                        }}
                        onClick={() => setEndDay(day)}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <div className="w-2 bg-gray-100"></div>
                  {/* hour */}
                  <div className="w-16 border-l border-gray-100 overflow-y-auto">
                    {endHourList.map((hour, index) => (
                      <button
                        key={index}
                        id={`end-hour-${hour}`}
                        className={`w-full py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                          hour === endHour 
                            ? "font-semibold text-white" 
                            : "text-gray-700"
                        }`}
                        style={{
                          backgroundColor: hour === endHour ? userOptions.themeColor : 'transparent'
                        }}
                        onClick={() => setEndHour(hour)}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                  {/* min */}
                  <div className="w-16 overflow-y-auto">
                    {endMinList.map((min, index) => (
                      <button
                        key={index}
                        id={`end-min-${min}`}
                        className={`w-full py-2 text-sm hover:bg-gray-50 transition-colors duration-150 ${
                          min === endMin 
                            ? "font-semibold text-white" 
                            : "text-gray-700"
                        }`}
                        style={{
                          backgroundColor: min === endMin ? userOptions.themeColor : 'transparent'
                        }}
                        onClick={() => setEndMin(min)}
                      >
                        {min}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Action Button */}
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <button
                    className="w-full py-2 px-4 text-white font-medium rounded-lg transition-all duration-200 hover:opacity-90"
                    style={{ backgroundColor: userOptions.themeColor }}
                    onClick={() => setEndOpen(false)}
                  >
                    확인
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}