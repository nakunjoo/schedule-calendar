"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { dayData } from "@/types/Celendar.types";

import { OptionState } from "@/stores/slices/option-slices";
import { ScheduleData, deleteSchedule } from "@/stores/slices/schedule-slices";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/index";

import { deleteScheduleDB } from "@/lib/db";

import { addMonths, startOfMonth } from "date-fns";

import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");

export default function DetailModal({
  userOptions,
  selectDay,
  setSelectDay,
  setSelectedDate,
}: {
  userOptions: OptionState;
  selectDay: dayData;
  setSelectDay: React.Dispatch<React.SetStateAction<dayData | null>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const deleteHandler = async (schedule: ScheduleData) => {
    const check = confirm("일정을 삭제 하시겠습니까?");
    if (check) {
      // Use startDate/endDate as primary, fallback to start/end
      const startDateStr = schedule.startDate || schedule.start;
      const endDateStr = schedule.endDate || schedule.end;
      
      if (!startDateStr || !endDateStr) {
        console.error('Cannot delete schedule with missing dates:', schedule);
        return;
      }

      const startDate = dayjs(startDateStr);
      const endDate = dayjs(endDateStr);
      
      if (!startDate.isValid() || !endDate.isValid()) {
        console.error('Cannot delete schedule with invalid dates:', { startDateStr, endDateStr });
        return;
      }

      if (startDate.format("YYYY-MM") !== endDate.format("YYYY-MM")) {
        const start = startOfMonth(startDate.toDate());
        const end = startOfMonth(endDate.toDate());

        for (let i = start; i <= end; i = addMonths(i, 1)) {
          const date = dayjs(i).format("YYYY-MM");
          await deleteScheduleDB(date, schedule.id);
        }
      } else {
        const date = startDate.format("YYYY-MM");
        await deleteScheduleDB(date, schedule.id);
      }
      dispatch(deleteSchedule(schedule.id));
      alert("일정이 삭제되었습니다.");
    } else {
      return false;
    }
  };
  return (
    <div className="w-full h-full z-10">
      <div
        className="w-full h-full absolute top-0 left-0 bg-black/30 backdrop-blur-[2px] z-20"
        onClick={() => {
          setSelectDay(null);
        }}
      ></div>
      <div className="md:w-[800px] w-[95%] sm:w-[90%] p-4 fixed border-0 shadow-2xl h-[90%] sm:h-[85%] md:top-1/2 md:-translate-y-1/2 top-4 left-1/2 -translate-x-1/2 bg-white overflow-hidden overflow-y-auto rounded-2xl z-30 custom-scrollbar">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2
              className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold"
              style={{ color: userOptions.themeColor }}
            >
              {dayjs(selectDay.day).format("YYYY-MM-DD ddd")}요일
            </h2>
            {/* 공휴일 정보 표시 */}
            {selectDay.holiday.name && userOptions.holiday && (
              <div className="flex items-center gap-1 mt-1 sm:mt-2">
                <Icon icon="material-symbols:celebration" className="w-4 h-4 text-red-500" />
                <span className="text-red-500 font-medium text-sm sm:text-base">
                  {selectDay.holiday.name}
                </span>
              </div>
            )}
            {/* 음력 정보 표시 */}
            {selectDay.lunar && userOptions.lunar && (
              <div className="flex items-center gap-1 mt-1">
                <Icon icon="material-symbols:calendar-month" className="w-4 h-4 text-blue-600" />
                <span className="text-blue-600 font-medium text-sm sm:text-base">
                  음력: {selectDay.lunar}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div
              className="px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-full text-xs sm:text-sm text-white font-medium cursor-pointer hover:opacity-90 transition-opacity flex items-center gap-1"
              onClick={() => {
                setSelectedDate(dayjs(selectDay.day).format("YYYY-MM-DD HH:mm"));
              }}
              style={{ backgroundColor: userOptions.themeColor }}
            >
              <Icon icon="material-symbols:add" className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">일정 추가</span>
              {/* <span className="sm:hidden"></span> */}
            </div>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => {
                setSelectDay(null);
              }}
            >
              <Icon
                className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500"
                icon="material-symbols:close"
              />
            </button>
          </div>
        </div>
        <div className="w-full mx-auto mt-8 h-[90%] overflow-hidden overflow-y-auto custom-scrollbar">
          {selectDay.schedules.length > 0 ? (
            <ul className="w-full mx-auto space-y-2 sm:space-y-3 md:space-y-4 pr-1">
              {selectDay.schedules.map((schedule, index) => {
                return (
                  <li
                    key={index}
                    className="w-full p-4 sm:p-6 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer relative shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-gray-300"
                    onClick={() => {
                      setSelectedDate(`edit:${schedule.id}`);
                      setSelectDay(null);
                    }}
                  >
                    <button
                      className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 p-1.5 sm:p-2 rounded-full hover:bg-red-100 transition-colors group"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await deleteHandler(schedule);
                      }}
                    >
                      <Icon
                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-red-500 transition-colors"
                        icon="material-symbols:delete-outline"
                      />
                    </button>
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <div className="flex-1 pr-6 sm:pr-8">
                        <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 mb-1.5 sm:mb-2 leading-tight">
                          {schedule.title}
                        </h3>
                        <span
                          className="inline-block px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-white text-xs font-medium"
                          style={{ backgroundColor: schedule.category.color }}
                        >
                          {schedule.category.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start sm:items-center mb-2 sm:mb-3">
                      <Icon
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0"
                        icon="material-symbols:schedule"
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center text-gray-700 text-xs sm:text-sm">
                        <span className="font-medium">
                          {schedule.startDate && dayjs(schedule.startDate).isValid() 
                            ? dayjs(schedule.startDate).format("HH:mm") 
                            : schedule.start && dayjs(schedule.start).isValid() 
                            ? dayjs(schedule.start).format("HH:mm")
                            : "시간 없음"}
                        </span>
                        <span className="mx-2 text-gray-400">~</span>
                        <span className="font-medium">
                          {schedule.endDate && dayjs(schedule.endDate).isValid() 
                            ? dayjs(schedule.endDate).format("HH:mm") 
                            : schedule.end && dayjs(schedule.end).isValid() 
                            ? dayjs(schedule.end).format("HH:mm")
                            : "시간 없음"}
                        </span>
                        {schedule.type && (
                          <span className="text-sm text-gray-400 ml-3">
                            ({schedule.startDate && dayjs(schedule.startDate).isValid() 
                              ? dayjs(schedule.startDate).format("MM/DD") 
                              : "날짜 없음"} ~ {schedule.endDate && dayjs(schedule.endDate).isValid() 
                              ? dayjs(schedule.endDate).format("MM/DD")
                              : "날짜 없음"})
                          </span>
                        )}
                      </div>
                    </div>
                    {schedule.memo && (
                      <div className="flex items-start mt-2">
                        <Icon
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0"
                          icon="material-symbols:note"
                        />
                        <div className="text-gray-600 leading-relaxed whitespace-pre-wrap text-xs sm:text-sm">
                          {schedule.memo}
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <div className="text-center py-16">
                <Icon
                  icon="material-symbols:event-available-outline"
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                />
                <h3 className="text-xl text-gray-500 font-medium mb-2">
                  등록된 일정이 없습니다
                </h3>
                <p className="text-gray-400">새로운 일정을 추가해보세요</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
