"use client";
import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { PickerBox } from "@/styles/datepicker.style";
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
    setStartYear(dayjs(startDate).format("YYYY"));
    setStartMonth(dayjs(startDate).format("MM"));
    setStartDay(dayjs(startDate).format("DD"));
    setStartHour(dayjs(startDate).format("HH"));
    setStartMin(dayjs(startDate).format("mm"));

    setEndYear(dayjs(endDate).format("YYYY"));
    setEndMonth(dayjs(endDate).format("MM"));
    setEndDay(dayjs(endDate).format("DD"));
    setEndHour(dayjs(endDate).format("HH"));
    setEndMin(dayjs(endDate).format("mm"));
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
  }, [endYear, endMonth]);

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
    const startValue = `${startYear}-${startMonth}-${startDay} ${startHour}:${startMin}`;
    setStartValue(startValue);
  }, [startYear, startMonth, startDay, startHour, startMin]);

  useEffect(() => {
    const endValue = `${endYear}-${endMonth}-${endDay} ${endHour}:${endMin}`;
    setEndValue(endValue);
  }, [endYear, endMonth, endDay, endHour, endMin]);

  return (
    <div className="w-full mt-2 sm:flex sm:justify-around">
      <div className="sm:inline-block block sm:w-60 w-full relative">
        <Icon
          className="inline-block w-8 h-8 mr-2 -mt-1"
          icon="vaadin:hourglass-start"
          style={{ color: userOptions.themeColor }}
        />
        <input
          className="border-black border-solid border rounded p-2 cursor-pointer text-base"
          type="text"
          placeholder="시작: YYYY/MM/DD"
          value={`${startYear} / ${startMonth} / ${startDay}  ${startHour} : ${startMin}`}
          onClick={() => {
            setStartOpen(!startOpen);
          }}
          readOnly
        />
        {startOpen ? (
          <PickerBox
            className={`w-full bg-white border border-black border-solid 
          } rounded-md  text-center text-lg absolute top-12 left-0 z-10`}
          >
            <div className="w-full flex justify-between border-b border-black border-solid bg-[#eedeff] text-base rounded-t-md">
              <span className="w-[110px] border-r border-black border-solid">
                년
              </span>
              <span className="w-[55px] border-r border-black border-solid">
                월
              </span>
              <span className="w-[55px] border-r border-black border-solid">
                일
              </span>
              <span className="w-2"></span>
              <span className="w-[55px] border-l border-black border-solid">
                시
              </span>
              <span className="w-[55px] border-l border-black border-solid">
                분
              </span>
            </div>
            <div className="w-full flex justify-between h-44 ">
              {/* year */}
              <div className="border-r border-black border-solid w-[110px] overflow-hidden overflow-y-auto relative">
                {startYearList.map((year, index) => {
                  return (
                    <div
                      key={index}
                      id={`start-year-${year}`}
                      tabIndex={0}
                      className={`p-1 cursor-pointer ${
                        year === startYear ? "active" : ""
                      }`}
                      onClick={() => {
                        setStartYear(year);
                      }}
                    >
                      {year}
                    </div>
                  );
                })}
              </div>
              {/* month */}
              <div className="border-r border-black border-solid w-[55px] overflow-hidden overflow-y-auto relative">
                {startMonthList.map((month, index) => {
                  return (
                    <div
                      key={index}
                      id={`start-month-${month}`}
                      tabIndex={0}
                      className={`p-1 cursor-pointer ${
                        month === startMonth ? "active" : ""
                      }`}
                      onClick={() => {
                        setStartMonth(month);
                      }}
                    >
                      {month}
                    </div>
                  );
                })}
              </div>
              {/* day */}
              <div className="border-r border-black border-solid w-[55px] overflow-hidden overflow-y-auto relative">
                {startDayList.map((day, index) => {
                  return (
                    <div
                      key={index}
                      id={`start-day-${day}`}
                      tabIndex={0}
                      className={`p-1 cursor-pointer ${
                        day === startDay ? "active" : ""
                      }`}
                      onClick={() => {
                        setStartDay(day);
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <div className="w-2"></div>
              {/* hour */}
              <div className="border-l border-black border-solid w-[55px] overflow-hidden overflow-y-auto relative">
                {startHourList.map((hour, index) => {
                  return (
                    <div
                      key={index}
                      id={`start-hour-${hour}`}
                      tabIndex={0}
                      className={`p-1 cursor-pointer ${
                        hour === startHour ? "active" : ""
                      }`}
                      onClick={() => {
                        setStartHour(hour);
                      }}
                    >
                      {hour}
                    </div>
                  );
                })}
              </div>
              {/* min */}
              <div className="border-l border-black border-solid w-[55px] overflow-hidden overflow-y-auto relative">
                {startMinList.map((min, index) => {
                  return (
                    <div
                      key={index}
                      id={`start-min-${min}`}
                      tabIndex={0}
                      className={`p-1 cursor-pointer ${
                        min === startMin ? "active" : ""
                      }`}
                      onClick={() => {
                        setStartMin(min);
                      }}
                    >
                      {min}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-full p-2 flex justify-end">
              <div
                className={`w-16 rounded-md text-white p-2 cursor-pointer`}
                style={{ backgroundColor: userOptions.themeColor }}
                onClick={() => {
                  setStartOpen(false);
                }}
              >
                확인
              </div>
            </div>
          </PickerBox>
        ) : (
          <></>
        )}
      </div>
      <span className="sm:mx-2 mt-2">~</span>
      <div className="sm:inline-block block sm:w-60 w-full relative">
        <Icon
          className="inline-block  w-8 h-8 mr-2 -mt-1"
          icon="vaadin:hourglass-end"
          style={{ color: userOptions.themeColor }}
        />
        <input
          className="border-black border-solid border rounded p-2 text-base cursor-pointer"
          type="text"
          placeholder="종료: YYYY/MM/DD"
          value={`${endYear} / ${endMonth} / ${endDay}  ${endHour} : ${endMin}`}
          onClick={() => {
            setEndOpen(!endOpen);
          }}
          readOnly
        />
        {endOpen ? (
          <PickerBox
            className={`w-full bg-white border border-black border-solid 
          } rounded-md  text-center text-lg absolute top-12 left-0 z-10`}
          >
            <div className="w-full flex justify-between border-b border-black border-solid bg-[#eedeff] text-base rounded-t-md">
              <span className="w-[110px] border-r border-black border-solid">
                년
              </span>
              <span className="w-[55px] border-r border-black border-solid">
                월
              </span>
              <span className="w-[55px] border-r border-black border-solid">
                일
              </span>
              <span className="w-2"></span>
              <span className="w-[55px] border-l border-black border-solid">
                시
              </span>
              <span className="w-[55px] border-l border-black border-solid">
                분
              </span>
            </div>
            <div className="w-full flex justify-between h-44">
              {/* year */}
              <div className="border-r border-black border-solid w-[110px] overflow-hidden overflow-y-auto relative">
                {endYearList.map((year, index) => {
                  return (
                    <div
                      key={index}
                      id={`end-year-${year}`}
                      tabIndex={0}
                      className={`p-1 cursor-pointer ${
                        year === endYear ? "active" : ""
                      }`}
                      onClick={() => {
                        setEndYear(year);
                      }}
                    >
                      {year}
                    </div>
                  );
                })}
              </div>
              {/* month */}
              <div className="border-r border-black border-solid w-[55px] overflow-hidden overflow-y-auto relative">
                {endMonthList.map((month, index) => {
                  return (
                    <div
                      key={index}
                      id={`end-month-${month}`}
                      tabIndex={0}
                      className={`p-1 cursor-pointer ${
                        month === endMonth ? "active" : ""
                      }`}
                      onClick={() => {
                        setEndMonth(month);
                      }}
                    >
                      {month}
                    </div>
                  );
                })}
              </div>
              {/* day */}
              <div className="border-r border-black border-solid w-[55px] overflow-hidden overflow-y-auto relative">
                {endDayList.map((day, index) => {
                  return (
                    <div
                      key={index}
                      id={`end-day-${day}`}
                      tabIndex={0}
                      className={`p-1 cursor-pointer ${
                        day === endDay ? "active" : ""
                      }`}
                      onClick={() => {
                        setEndDay(day);
                      }}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <div className="w-2"></div>
              {/* hour */}
              <div className="border-l border-black border-solid w-[55px] overflow-hidden overflow-y-auto relative">
                {endHourList.map((hour, index) => {
                  return (
                    <div
                      key={index}
                      id={`end-hour-${hour}`}
                      tabIndex={0}
                      className={`p-1 cursor-pointer ${
                        hour === endHour ? "active" : ""
                      }`}
                      onClick={() => {
                        setEndHour(hour);
                      }}
                    >
                      {hour}
                    </div>
                  );
                })}
              </div>
              {/* min */}
              <div className="border-l border-black border-solid w-[55px] overflow-hidden overflow-y-auto relative">
                {endMinList.map((min, index) => {
                  return (
                    <div
                      key={index}
                      id={`end-min-${min}`}
                      tabIndex={0}
                      className={`p-1 cursor-pointer ${
                        min === endMin ? "active" : ""
                      }`}
                      onClick={() => {
                        setEndMin(min);
                      }}
                    >
                      {min}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="w-full p-2 flex justify-end">
              <div
                className={`w-16 rounded-md text-white p-2 cursor-pointer`}
                style={{ backgroundColor: userOptions.themeColor }}
                onClick={() => {
                  setEndOpen(false);
                }}
              >
                확인
              </div>
            </div>
          </PickerBox>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
