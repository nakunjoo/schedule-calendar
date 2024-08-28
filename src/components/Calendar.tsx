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

export default function CalendarWrap() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>("");
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
        console.log("items:", items);
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
                className={`border-l border-black border-solid text-left p-1 w-full h-36 cursor-pointer ${state}`}
                id={`date-${formatDate}`}
                key={`day-${i}`}
                onClick={(e) => {
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
              `}
                >
                  {formattedDate}
                  <span className="ml-1">{holiday}</span>
                </span>
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
    console.log("selectedDate:", selectedDate);
  }, [selectedDate]);

  return (
    <div className="xl:container mx-auto  p-24">
      <div className="w-full">
        {/* calendars */}
        <div className="w-full m-5 border border-black border-solid rounded-lg">
          {/* calendar-header */}
          <div className="w-full h-16 p-2 border-b border-black border-solid">
            <div className="mt-1 justify-between flex">
              <span className="text-3xl font-bold text-gray-400">
                {format(currentMonth, "yyyy")}
              </span>
              <div className="flex justify-start">
                <span className="text-xl text-gray-400">
                  <span className="text-3xl mr-1 text-black">
                    {format(currentMonth, "M")}월
                  </span>
                </span>
                <Icon
                  className="cursor-pointer w-10 h-10 mx-2"
                  icon="bi:arrow-left-circle-fill"
                  onClick={() => {
                    arrowBtnHandler("prev");
                  }}
                />
                <Icon
                  className="cursor-pointer w-10 h-10"
                  icon="bi:arrow-right-circle-fill"
                  onClick={() => {
                    arrowBtnHandler("next");
                  }}
                />
              </div>
              <div className="flex justify-start">
                <span>플러스</span>
                <span>점세개</span>
              </div>
            </div>
          </div>
          {/* calendar-days */}
          <div className="w-full flex justify-between border-b border-black border-solid">
            {date.map((value, index) => {
              return (
                <div
                  key={index}
                  className="w-full text-center p-1 border-l border-black border-solid font-bold"
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
    </div>
  );
}
