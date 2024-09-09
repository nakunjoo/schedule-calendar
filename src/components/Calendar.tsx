"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addDays,
  startOfDay,
  endOfDay,
} from "date-fns";
import dayjs from "dayjs";
import { CalendarBodyRow, CalendarRowDiv } from "@/styles/calendar.style";
import { dataServiceKey } from "@/configs/data.service";
import axios from "axios";

import ScheduleModal from "./ScheduleModal";
import DetailModal from "./DetailModal";
import CalendarOption from "./CalendarOption";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/index";
import { ScheduleData } from "@/stores/slices/schedule-slices";
import { CategoryData } from "@/stores/slices/category-slices";

import {
  dayData,
  calendarDateData,
  lunarDateData,
} from "@/types/Celendar.types";
import { updateSelectDay } from "@/stores/slices/select-day-slices";

export default function CalendarWrap() {
  const dispatch = useDispatch<AppDispatch>;
  const userOptions = useSelector(
    (state: RootState) => state.optionReducer.value
  );
  const categoryList = useSelector((state: RootState) => state.categoryReducer);
  const scheduleList = useSelector((state: RootState) => state.scheduleReducer);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectDay, setSelectDay] = useState<dayData | null>(null);
  const [addSchedule, setAddSchedule] = useState<string | null>(null);
  const date = ["일", "월", "화", "수", "목", "금", "토"];
  const [rows, setRows] = useState<dayData[][]>([]);
  const [holidayList, setHolidayList] = useState<
    calendarDateData[] | undefined
  >(undefined); // 국경일
  const [anniversaryList, setAnniversaryList] = useState<
    calendarDateData[] | undefined
  >(undefined); // 기념일
  const [exquisitenessList, setExquisitenessList] = useState<
    calendarDateData[] | undefined
  >(undefined); // 절기
  const [lunarList, setLunarList] = useState<lunarDateData[] | undefined>(
    undefined
  ); // 음력

  const [optionOpen, setOptionOpen] = useState(false);

  const solYear = format(currentMonth, "yyyy");
  const solMonth = format(currentMonth, "MM");

  const getHoliDay = (holiday: boolean) => {
    if (!holiday) {
      setHolidayList(undefined);
      return;
    }
    axios
      .get(
        `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=${solYear}&solMonth=${solMonth}&ServiceKey=${dataServiceKey}`
      )
      .then((res) => {
        let items = res.data?.response?.body?.items?.item;
        if (!items?.length) {
          items = items ? [items] : undefined;
        }
        setHolidayList(items);
      })
      .catch((err) => {
        console.log("getHolidayError:", err);
        setHolidayList(undefined);
      });
  };

  const getAnniversary = (anniversary: boolean) => {
    if (!anniversary) {
      setAnniversaryList(undefined);
      return;
    }
    axios
      .get(
        `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getAnniversaryInfo?solYear=${solYear}&solMonth=${solMonth}&ServiceKey=${dataServiceKey}`
      )
      .then((res) => {
        let items = res.data?.response?.body?.items?.item;
        if (!items?.length) {
          items = items ? [items] : undefined;
        }
        setAnniversaryList(items);
      })
      .catch((err) => {
        console.log("getAnniversaryError:", err);
        setAnniversaryList(undefined);
      });
  };

  const getExquisiteness = async (exquisiteness: boolean) => {
    if (!exquisiteness) {
      setExquisitenessList(undefined);
      return;
    }
    let divisions: calendarDateData[] | undefined = undefined;
    await axios
      .get(
        `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/get24DivisionsInfo?solYear=${solYear}&solMonth=${solMonth}&ServiceKey=${dataServiceKey}`
      )
      .then((res) => {
        let items = res.data?.response?.body?.items?.item;
        if (!items?.length) {
          items = items ? [items] : undefined;
        }
        divisions = items;
      });
    let sundryDay: calendarDateData[] | undefined = undefined;
    await axios
      .get(
        `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getSundryDayInfo?solYear=${solYear}&solMonth=${solMonth}&ServiceKey=${dataServiceKey}`
      )
      .then((res) => {
        let items = res.data?.response?.body?.items?.item;
        if (!items?.length) {
          items = items ? [items] : undefined;
        }
        sundryDay = items;
      });
    if (divisions && sundryDay) {
      setExquisitenessList([...divisions, ...sundryDay]);
    } else if (!divisions && sundryDay) {
      setExquisitenessList(sundryDay);
    } else if (divisions && !sundryDay) {
      setExquisitenessList(divisions);
    } else {
      setExquisitenessList(undefined);
    }
  };

  const getLunar = (lunar: boolean) => {
    if (!lunar) {
      setLunarList(undefined);
      return;
    }
    axios
      .get(
        `http://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo?solYear=${solYear}&solMonth=${solMonth}&ServiceKey=${dataServiceKey}`
      )
      .then((res) => {
        let items = res.data?.response?.body?.items?.item;
        if (!items?.length) {
          items = items ? [items] : undefined;
        }
        setLunarList(items);
      })
      .catch((err) => {
        console.log("getlunarError:", err);
        setLunarList(undefined);
      });
  };

  useEffect(() => {
    getHoliDay(userOptions.holiday);
    getAnniversary(userOptions.anniversary);
    getExquisiteness(userOptions.exquisiteness);
    getLunar(userOptions.lunar);
  }, [currentMonth]);

  useEffect(() => {
    getHoliDay(userOptions.holiday);
  }, [userOptions.holiday]);

  useEffect(() => {
    getAnniversary(userOptions.anniversary);
  }, [userOptions.anniversary]);

  useEffect(() => {
    getExquisiteness(userOptions.exquisiteness);
  }, [userOptions.exquisiteness]);

  useEffect(() => {
    getLunar(userOptions.lunar);
  }, [userOptions.lunar]);

  useEffect(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const toDay = new Date();
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    let days = [];
    let rowArr = [];
    let day = startDate;
    let index = 1;
    const scheduleBar = [];
    const scheduleCircle = [];
    if (scheduleList.length > 0) {
      for (const schedule of scheduleList) {
        if (
          dayjs(schedule.startDate).format("YYYYMMDD") <
          dayjs(schedule.endDate).format("YYYYMMDD")
        ) {
          const start = startOfDay(new Date(schedule.startDate));
          const end = endOfDay(new Date(schedule.endDate));
          for (let i = start; i <= end; i = addDays(i, 1)) {
            const data = {
              id: schedule.id,
              startDate: dayjs(i).format("YYYY-MM-DD 00:00"),
              endDate: dayjs(i).format("YYYY-MM-DD 23:59"),
              category: schedule.category,
              title: schedule.title,
              memo: schedule.memo,
              type: "between",
              turn: 0,
              start,
              end,
            };
            if (
              dayjs(i).format("YYYY-MM-DD") ===
              dayjs(schedule.startDate).format("YYYY-MM-DD")
            ) {
              data.startDate = schedule.startDate;
              data.type = "start";
            }
            if (
              dayjs(i).format("YYYY-MM-DD") ===
              dayjs(schedule.endDate).format("YYYY-MM-DD")
            ) {
              data.endDate = schedule.endDate;
              data.type = "end";
            }
            scheduleBar.push(data);
          }
        } else {
          scheduleCircle.push(schedule);
        }
      }
    }

    const sortSchedule = (schedules: ScheduleData[]) => {
      return schedules.sort((a, b) => new Date(a.start) - new Date(b.start));
    };
    while (day <= endDate) {
      index++;
      const startArrs: any = {};
      for (let i = 0; i < 7; i++) {
        const formatDate = dayjs(day).format("YYYYMMDD");
        const schedule_bar = [];
        const schedule_circle = [];
        if (scheduleBar.length > 0) {
          for (const schedule of sortSchedule(scheduleBar)) {
            if (formatDate === dayjs(schedule.startDate).format("YYYYMMDD")) {
              schedule.turn = schedule_bar.length;
              if (schedule.type === "start") {
                if (schedule.turn === 1) {
                  if (
                    schedule_bar[0].turn === 1 ||
                    schedule_bar[0].turn === 2
                  ) {
                    schedule.turn = 0;
                  }
                } else if (schedule.turn === 2) {
                  if (
                    (schedule_bar[0].turn === 0 ||
                      schedule_bar[0].turn === 2) &&
                    (schedule_bar[1].turn === 0 || schedule_bar[1].turn === 2)
                  ) {
                    schedule.turn = 1;
                  } else if (
                    (schedule_bar[0].turn === 1 ||
                      schedule_bar[0].turn === 2) &&
                    (schedule_bar[1].turn === 1 || schedule_bar[1].turn === 2)
                  ) {
                    schedule.turn = 0;
                  }
                } else if (schedule.turn > 2) {
                  let empty_turn_0 = true;
                  let empty_turn_1 = true;
                  let empty_turn_2 = true;
                  for (const bar of schedule_bar) {
                    if (bar.turn === 0) {
                      empty_turn_0 = false;
                    } else if (bar.turn === 1) {
                      empty_turn_1 = false;
                    } else if (bar.turn === 2) {
                      empty_turn_2 = false;
                    }
                  }
                  if (empty_turn_2) {
                    schedule.turn = 2;
                  } else if (empty_turn_1) {
                    schedule.turn = 1;
                  } else if (empty_turn_0) {
                    schedule.turn = 0;
                  }
                }
                startArrs[schedule.id] = schedule.turn;
              } else {
                if (startArrs[schedule.id] >= 0) {
                  schedule.turn = startArrs[schedule.id];
                }
              }

              schedule_bar.push(schedule);
            }
          }
        }
        if (scheduleCircle.length > 0) {
          for (const schedule of sortSchedule(scheduleCircle)) {
            if (formatDate === dayjs(schedule.startDate).format("YYYYMMDD")) {
              schedule_circle.push(schedule);
            }
          }
        }

        const schedules = sortSchedule([...schedule_bar, ...schedule_circle]);

        let holiday = {
          name: "",
          isHoliday: "",
        };
        if (holidayList) {
          for (const item of holidayList) {
            if (formatDate === String(item.locdate)) {
              holiday.name = item.dateName;
              holiday.isHoliday = item.isHoliday;
            }
          }
        }
        let anniversary = "";
        if (anniversaryList) {
          for (const item of anniversaryList) {
            if (formatDate === String(item.locdate)) {
              anniversary = item.dateName;
            }
          }
        }
        let exquisiteness = "";
        if (exquisitenessList) {
          for (const item of exquisitenessList) {
            if (formatDate === String(item.locdate)) {
              exquisiteness = item.dateName;
            }
          }
        }

        let lunar = "";
        if (lunarList) {
          for (const item of lunarList) {
            if (
              formatDate === `${item.solYear}${item.solMonth}${item.solDay}`
            ) {
              lunar = `${item.lunMonth}/${item.lunDay}`;
            }
          }
        }

        const state = !isSameMonth(day, monthStart)
          ? "disabled"
          : isSameDay(day, toDay)
          ? "selected"
          : format(currentMonth, "M") !== format(day, "M")
          ? "not-valid"
          : "valid";

        const dayData: dayData = {
          formatDate,
          state,
          holiday,
          anniversary,
          exquisiteness,
          lunar,
          day,
          schedules,
          schedule_bar,
          schedule_circle,
        };

        if (selectDay) {
          if (dayjs(selectDay.day).format("YYYYMMDD") === formatDate) {
            setSelectDay(dayData);
          }
        }

        days.push(dayData);
        day = addDays(day, 1);
      }
      rowArr.push(days);
      days = [];
    }
    setRows(rowArr);
  }, [
    holidayList,
    anniversaryList,
    exquisitenessList,
    lunarList,
    scheduleList,
  ]);

  // 버튼 클릭시 이벤트
  const arrowBtnHandler = (type: string) => {
    setOptionOpen(false);
    if (type === "prev") {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  useEffect(() => {
    setOptionOpen(false);
    if (selectDay || addSchedule) {
      document.body.style.cssText = `
        position: fixed; 
        top: -${window.scrollY}px;
        overflow-y: scroll;
        width: 100%;
      `;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    }
  }, [selectDay, addSchedule]);

  return (
    <div className="sm:container mx-auto box-content py-20">
      <div className="w-full mx-auto">
        {/* calendars */}
        <div className="w-full mx-auto border border-black border-solid rounded-lg  bg-white">
          {/* calendar-header */}
          <div className="w-full h-18 border-b border-black border-solid">
            <div className="w-full px-2 border-b border-black border-solid text-center">
              <span
                className={`text-xl font-bold`}
                style={{ color: userOptions.themeColor }}
              >
                {format(currentMonth, "yyyy")}
              </span>
            </div>
            <div className="p-2 justify-between flex">
              <div className="flex justify-start">
                <span className="text-xl text-gray-400">
                  <span className="text-2xl mr-1 text-black font-bold">
                    {format(currentMonth, "MM")}월
                  </span>
                </span>
                <Icon
                  className="cursor-pointer w-8 h-8 mx-2"
                  icon="icon-park-solid:arrow-circle-left"
                  style={{ color: userOptions.themeColor }}
                  onClick={() => {
                    arrowBtnHandler("prev");
                  }}
                />
                <Icon
                  className="cursor-pointer w-8 h-8"
                  icon="icon-park-solid:arrow-circle-right"
                  style={{ color: userOptions.themeColor }}
                  onClick={() => {
                    arrowBtnHandler("next");
                  }}
                />
              </div>
              <div className="flex justify-start  relative">
                <span>
                  <Icon
                    className="cursor-pointer w-8 h-8 mr-2"
                    icon="icon-park-solid:add"
                    style={{ color: userOptions.themeColor }}
                    onClick={() => {
                      setAddSchedule("add");
                    }}
                  />
                </span>
                <span>
                  <Icon
                    className="cursor-pointer w-8 h-8"
                    icon="solar:menu-dots-bold"
                    style={{ color: userOptions.themeColor }}
                    onClick={() => {
                      setOptionOpen(!optionOpen);
                    }}
                  />
                </span>
                {optionOpen ? (
                  <CalendarOption userOptions={userOptions} />
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          {/* calendar-days */}
          <div className="w-full flex justify-between border-b border-black border-solid">
            {date.map((value, index) => {
              return (
                <div
                  key={index}
                  className={`${
                    index === 0 ? "" : "border-l"
                  } w-full text-center p-1 
                  border-black border-solid font-bold`}
                >
                  <span
                    className={
                      index === 0
                        ? "text-red-600"
                        : index === 6
                        ? "text-blue-600"
                        : "text-black"
                    }
                  >
                    {value}
                  </span>
                </div>
              );
            })}
          </div>
          {/* calendar-body */}
          <div className="w-full overflow-hidden">
            {rows.map((days, index) => {
              return (
                <CalendarBodyRow
                  key={`row-${index}`}
                  className="border-b border-black border-solid justify-between flex"
                >
                  {days.map((day: dayData, i: number) => {
                    const formattedDate = format(day.day, "d");
                    return (
                      <CalendarRowDiv
                        className={`${
                          i === 0 ? "" : "border-l"
                        } border-black border-solid box-content text-left p-1 w-full h-36 cursor-pointer ${
                          day.state
                        } relative`}
                        id={`date-${day.formatDate}`}
                        key={`day-${i}`}
                        onClick={() => {
                          setSelectDay(day);
                        }}
                      >
                        <span
                          className={`
                            ${
                              format(currentMonth, "M") !== format(day.day, "M")
                                ? "text not-valid"
                                : ""
                            }
                            ${
                              day.state === "disabled"
                                ? "text-gray-500"
                                : i === 0
                                ? "text-red-600"
                                : i === 6
                                ? "text-blue-600"
                                : day.holiday.isHoliday === "Y"
                                ? "text-red-600"
                                : "text-black"
                            }
                            text-base
                            day
                          `}
                          style={{
                            backgroundColor:
                              day.state === "selected"
                                ? userOptions.themeColor
                                : "",
                          }}
                        >
                          {formattedDate}
                        </span>
                        <span
                          className={`
                            ${
                              format(currentMonth, "M") !== format(day.day, "M")
                                ? "text not-valid"
                                : ""
                            }
                            ${
                              day.state === "disabled"
                                ? "text-gray-500"
                                : i === 0
                                ? "text-red-600"
                                : i === 6
                                ? "text-blue-600"
                                : day.holiday.isHoliday === "Y"
                                ? "text-red-600"
                                : "text-black"
                            }
                            text-base
                            ml-1
                            mr-1
                          `}
                        >
                          {day.holiday.name}
                        </span>
                        <span className="text-xs">{day.exquisiteness}</span>
                        <p className="text-xs">{day.anniversary}</p>
                        {day.state === "selected" ? (
                          <span className="absolute right-3 top-0">
                            <span
                              className="today text-base"
                              style={{
                                color:
                                  day.state === "selected"
                                    ? userOptions.themeColor
                                    : "",
                              }}
                            >
                              ToDay
                            </span>
                            <p className="text-sx text-gray-400 -mt-1 text-right">
                              {day.lunar}
                            </p>
                          </span>
                        ) : (
                          <span className="absolute right-2 top-1 text-sx text-gray-400">
                            {day.lunar}
                          </span>
                        )}
                        <div className="absolute w-full h-6 top-[45px] left-0 z-10">
                          {day.schedule_bar.map((schedule, num) => {
                            return (
                              <div key={num}>
                                {schedule.turn > 2 ? (
                                  <div className="absolute top-[-15px]  bg-white right-0.5 border text-xs">
                                    +{schedule.turn - 2}
                                  </div>
                                ) : (
                                  <div
                                    className={`w-[101%] absolute left-0 h-4 mt-0.5 ${
                                      schedule.type === "start"
                                        ? "ml-1 rounded-l-xl"
                                        : ""
                                    } ${
                                      schedule.type === "end"
                                        ? "-ml-2 rounded-r-xl"
                                        : ""
                                    }`}
                                    style={{
                                      backgroundColor: schedule.category.color,
                                      top: `${schedule.turn * 20}px`,
                                    }}
                                  ></div>
                                )}
                              </div>
                            );
                          })}
                          <div className="absolute w-full h-6 top-[65px] left-0 z-10">
                            {day.schedule_circle.map((schedule, num) => {
                              return (
                                <div key={num} className="inline-block">
                                  {num > 4 ? (
                                    <div className="absolute top-[0px]  bg-white right-0.5 border text-xs">
                                      +{num - 4}
                                    </div>
                                  ) : (
                                    <div
                                      className="w-8 h-8 mt-0.5 ml-2 rounded-full"
                                      style={{
                                        backgroundColor:
                                          schedule.category.color,
                                      }}
                                    ></div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </CalendarRowDiv>
                    );
                  })}
                </CalendarBodyRow>
              );
            })}
          </div>
        </div>
      </div>
      {selectDay ? (
        <ScheduleModal
          userOptions={userOptions}
          selectDay={selectDay}
          setSelectDay={setSelectDay}
          setSelectedDate={setAddSchedule}
        />
      ) : (
        <></>
      )}
      {addSchedule ? (
        <DetailModal
          userOptions={userOptions}
          selectedDate={addSchedule}
          setSelectedDate={setAddSchedule}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
