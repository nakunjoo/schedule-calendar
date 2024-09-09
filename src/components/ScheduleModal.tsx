"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { OptionState } from "@/stores/slices/option-slices";
import { dayData } from "@/types/Celendar.types";
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
  return (
    <div className="w-full h-full z-10">
      <div
        className="w-full h-full absolute top-0 left-0 bg-black/30 backdrop-blur-[2px] z-20"
        onClick={() => {
          setSelectDay(null);
        }}
      ></div>
      <div className="md:w-[1080px] w-[90%] p-8 fixed border border-black border-solid h-[80%] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white overflow-hidden overflow-y-auto rounded-md z-30">
        <h2
          className="text-3xl font-bold"
          style={{ color: userOptions.themeColor }}
        >
          {dayjs(selectDay.day).format("YYYY-MM-DD ddd")}요일
        </h2>
        <div
          className="p-2 rounded absolute right-24 top-24 text-xl text-white font-bold cursor-pointer"
          onClick={() => {
            setSelectedDate(dayjs(selectDay.day).format("YYYY-MM-DD HH:mm"));
          }}
          style={{ backgroundColor: userOptions.themeColor }}
        >
          일정 추가 +
        </div>
        <div
          className="w-[90%] mx-auto mt-20 h-[80%] rounded-2xl overflow-hidden overflow-y-auto p-6"
          style={{ border: `3px solid ${userOptions.themeColor}` }}
        >
          {selectDay.schedules.length > 0 ? (
            <ul className="w-[95%] mx-auto ">
              {selectDay.schedules.map((schedule, index) => {
                return (
                  <li
                    key={index}
                    className="w-full h-38 my-4 rounded p-4 bg-[#eedeff] cursor-pointer"
                  >
                    <div className="flex justify-start items-center">
                      <Icon
                        className="w-8 h-8 mr-2"
                        icon="ic:round-drive-file-rename-outline"
                        style={{ color: userOptions.themeColor }}
                      />
                      <h3 className="text-xl font-bold text-black">
                        {schedule.title}
                      </h3>
                      <span
                        className="ml-4 p-2 rounded text-white text-lg"
                        style={{ backgroundColor: schedule.category.color }}
                      >
                        #{schedule.category.name}
                      </span>
                    </div>
                    <div className="flex justify-start items-center mt-1">
                      <Icon
                        className="w-8 h-8 mr-2"
                        icon="icon-park-solid:time"
                        style={{ color: userOptions.themeColor }}
                      />
                      <span className="text-xl font-bold text-black mr-1">
                        {dayjs(schedule.startDate).format("A HH:mm")}
                      </span>
                      <span className="text-xl font-bold text-black">~</span>
                      <span className="text-xl font-bold text-black ml-1">
                        {dayjs(schedule.endDate).format("A HH:mm")}
                      </span>
                      {schedule.type ? (
                        <span className="text-base text-gray-500 ml-2">
                          ({dayjs(schedule.start).format("MM/DD HH:mm")} ~
                          {dayjs(schedule.end).format("MM/DD HH:mm")})
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="flex justify-start items-center mt-2">
                      <Icon
                        className="w-8 h-8 mr-2"
                        icon="ic:round-event-note"
                        style={{ color: userOptions.themeColor }}
                      />
                      <div className="text-xl font-bold text-black">
                        {schedule.memo}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="w-full h-full p-4 flex justify-center items-center">
              <div className="text-center">
                <h3 className="text-2xl text-gray-600 font-bold mb-2">
                  일정없음
                </h3>
                <p className="text-base text-gray-500">일정을 등록해보세요.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
