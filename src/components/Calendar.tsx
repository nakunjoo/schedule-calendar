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
  parse,
} from "date-fns";
import dayjs from "dayjs";
import { CalendarBodyRow, CalendarRowDiv } from "@/styles/calendar.style";
import { dataServiceKey } from "@/configs/data.service";
import axios from "axios";

import DetailModal from "./DetailModal";

export default function CalendarWrap() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const date = ["일", "월", "화", "수", "목", "금", "토"];
  const [rows, setRows] = useState<React.JSX.Element[]>([]);

  useEffect(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const toDay = new Date();

    const solYear = format(currentMonth, "yyyy");
    const solMonth = format(currentMonth, "MM");

    axios
      .get(
        `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=${solYear}&solMonth=${solMonth}&ServiceKey=${dataServiceKey}`
      )
      .then((res) => {
        let items = res.data?.response?.body?.items?.item;
        if (!items?.length) {
          items = items ? [items] : undefined;
        }
        let days = [];
        let rowArr = [];
        let day = startDate;
        let formattedDate = "";
        let index = 1;

        while (day <= endDate) {
          index++;
          for (let i = 0; i < 7; i++) {
            const formatDate = dayjs(day).format("YYYYMMDD");
            let holiday = "";
            if (items) {
              for (const item of items) {
                if (formatDate === String(item.locdate)) {
                  holiday = item.dateName;
                }
              }
            }

            formattedDate = format(day, "d");
            let list = <div></div>;
            const state = !isSameMonth(day, monthStart)
              ? "disabled"
              : isSameDay(day, toDay)
              ? "selected"
              : format(currentMonth, "M") !== format(day, "M")
              ? "not-valid"
              : "valid";

            days.push(
              <CalendarRowDiv
                className={`${
                  i === 0 ? "" : "border-l"
                } border-black border-solid text-left p-1 w-full h-36 cursor-pointer ${state} relative`}
                id={`date-${formatDate}`}
                key={`day-${i}`}
                onClick={() => {
                  setSelectedDate(formatDate);
                }}
              >
                <span
                  className={`
                ${
                  format(currentMonth, "M") !== format(day, "M")
                    ? "text not-valid"
                    : ""
                }
                ${
                  state === "disabled"
                    ? "text-gray-500"
                    : i === 0
                    ? "text-red-600"
                    : i === 6
                    ? "text-blue-600"
                    : holiday
                    ? "text-red-600"
                    : "text-black"
                }
                text-base
                day
              `}
                >
                  {formattedDate}
                </span>
                <span
                  className={`
                ${
                  format(currentMonth, "M") !== format(day, "M")
                    ? "text not-valid"
                    : ""
                }
                ${
                  state === "disabled"
                    ? "text-gray-500"
                    : i === 0
                    ? "text-red-600"
                    : i === 6
                    ? "text-blue-600"
                    : holiday
                    ? "text-red-600"
                    : "text-black"
                }
                text-base
                ml-1
              `}
                >
                  {holiday}
                </span>
                {state === "selected" ? (
                  <span
                    className="today 
                text-base absolute right-2 top-1"
                  >
                    ToDay
                  </span>
                ) : (
                  <></>
                )}
                {list}
              </CalendarRowDiv>
            );
            day = addDays(day, 1);
          }
          rowArr.push(
            <CalendarBodyRow
              key={`row-${index}`}
              className="border-b border-black border-solid justify-between flex"
            >
              {days}
            </CalendarBodyRow>
          );
          days = [];
        }
        setRows(rowArr);
      });
  }, [currentMonth]);

  // 버튼 클릭시 이벤트
  const arrowBtnHandler = (type: string) => {
    if (type === "prev") {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  };

  useEffect(() => {
    if (selectedDate) {
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
  }, [selectedDate]);

  return (
    <div className="sm:container mx-auto box-content py-20">
      <div className="w-full mx-auto">
        {/* calendars */}
        <div className="w-full mx-auto border border-black border-solid rounded-lg  bg-white">
          {/* calendar-header */}
          <div className="w-full h-18 border-b border-black border-solid">
            <div className="w-full px-2 border-b border-black border-solid text-center">
              <span className="text-xl font-bold text-[#aa5fd3]">
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
                  style={{ color: "#aa5fd3" }}
                  onClick={() => {
                    arrowBtnHandler("prev");
                  }}
                />
                <Icon
                  className="cursor-pointer w-8 h-8"
                  icon="icon-park-solid:arrow-circle-right"
                  style={{ color: "#aa5fd3" }}
                  onClick={() => {
                    arrowBtnHandler("next");
                  }}
                />
              </div>
              <div className="flex justify-start">
                <span>
                  <Icon
                    className="cursor-pointer w-8 h-8"
                    icon="icon-park-solid:add"
                    style={{ color: "#aa5fd3" }}
                    onClick={() => {
                      setSelectedDate("add");
                    }}
                  />
                </span>
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
          <div className="w-full">{rows}</div>
        </div>
      </div>
      {selectedDate ? (
        <DetailModal
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
