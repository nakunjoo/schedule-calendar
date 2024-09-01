import React, { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { PickerBox } from "@/styles/datepicker.style";
import dayjs from "dayjs";
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
  parse,
} from "date-fns";

export default function DatePicker({
  selectedDate,
  startDate,
  endDate,
}: {
  selectedDate: string;
  startDate: string;
  endDate: string;
}) {
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
  }, []);

  useEffect(() => {
    const start_date =
      startDate || selectedDate === "add" ? new Date() : selectedDate;
    const end_date =
      endDate || selectedDate === "add" ? new Date() : selectedDate;
    setStartYear(dayjs(start_date).format("YYYY"));
    setStartMonth(dayjs(start_date).format("MM"));
    setStartDay(dayjs(start_date).format("DD"));
    setStartHour(dayjs(start_date).format("HH"));
    setStartMin(dayjs(start_date).format("mm"));
  }, [startDate, endDate]);

  useEffect(() => {
    const date = dayjs(`${startYear}-${startMonth}`).format("YYYY-MM-DD");
    const monthStart = startOfMonth(date);
    const monthEnd = parseInt(dayjs(endOfMonth(monthStart)).format("D"));

    const days = [];
    for (let day = 1; day <= monthEnd; day++) {
      days.push(`${day}`);
    }

    setStartDayList(days);
  }, [startYear, startMonth]);

  useEffect(() => {
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

  return (
    <div className="w-full mt-2 sm:flex sm:justify-around">
      <div className="sm:inline-block block sm:w-72 w-full relative">
        <Icon
          className="inline-block w-8 h-8 mr-2"
          icon="vaadin:hourglass-start"
          style={{ color: "#aa5fd3" }}
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
          } rounded-md  text-center text-lg absolute top-12 left-0`}
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
            <div className="w-full flex justify-between h-44 border-b border-black border-solid">
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
                className="w-16 bg-[#aa5fd3] rounded-md text-white p-2 cursor-pointer"
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
      <span className="sm:mx-4 mt-2">~</span>
      <div className="sm:inline-block block sm:w-56 w-full">
        <Icon
          className="inline-block  w-8 h-8  mr-2"
          icon="vaadin:hourglass-end"
          style={{ color: "#aa5fd3" }}
        />
        <input
          className="border-black border-solid border rounded p-2  cursor-pointer"
          type="text"
          placeholder="종료: YY/MM/DD"
          readOnly
        />
      </div>
    </div>
  );
}
