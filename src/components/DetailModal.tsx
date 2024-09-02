import React, { useState, useEffect } from "react";
import DatePicker from "./DatePicker";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";

export default function DetailModal({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [startValue, setStartValue] = useState<string | null>(null);
  const [endValue, setEndValue] = useState<string | null>(null);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    if (selectedDate === "add") {
      setStartDate(dayjs().format("YYYY-MM-DD HH:mm"));
      setEndDate(dayjs().format("YYYY-MM-DD HH:mm"));
    } else {
      setStartDate(dayjs(selectedDate).format("YYYY-MM-DD HH:mm"));
      setEndDate(dayjs(selectedDate).format("YYYY-MM-DD HH:mm"));
    }
  }, [selectedDate]);

  return (
    <div className="w-full h-full">
      <div
        className="w-full h-full absolute top-0 left-0 bg-black/30 backdrop-blur-[2px]"
        onClick={() => {
          setSelectedDate(null);
        }}
      ></div>
      <div className="sm:w-[640px] w-[90%] p-8 fixed border border-black border-solid h-[90%] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white">
        <h2 className="text-2xl font-bold text-gray-600">
          <Icon
            className="w-10 h-10 inline-block -mt-2 mr-1"
            icon="mingcute:schedule-fill"
            style={{ color: "#aa5fd3" }}
          />
          {selectedDate === "add" ? "일정 추가" : "일정 상세"}
        </h2>
        <div className="w-full mt-4">
          <h3 className="text-xl font-bold">제목</h3>
          <input
            className="w-full border border-black border-solid rounded-md p-2 mt-2 text-base"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="일정 제목을 입력해주세요."
          />
        </div>
        <div className="w-full mt-4">
          <h3 className="text-xl font-bold">시간</h3>
          <DatePicker
            selectedDate={selectedDate}
            startDate={startDate}
            setStartValue={setStartValue}
            endDate={endDate}
            setEndValue={setEndValue}
          />
        </div>
        <div className="w-full mt-6 relative">
          <h3 className="text-xl font-bold">카테고리</h3>
          <div className="absolute right-0 top-0">
            <Icon
              className="cursor-pointer w-8 h-8"
              icon="icon-park-solid:add"
              style={{ color: "#aa5fd3" }}
              onClick={() => {
                // setSelectedDate("add");
              }}
            />
          </div>
          <div className="w-full h-24 border border-black border-solid rounded-lg mt-2 text-center">
            {categoryList.length > 0 ? (
              <div className="w-full h-full flex justify-between">
                <span>asd</span>
              </div>
            ) : (
              <p className="text-gray-500 text-lg mt-8">
                카테고리 목록이 없습니다.
              </p>
            )}
          </div>
        </div>
        <div className="w-full mt-4">
          <h3 className="text-xl font-bold">메모</h3>
          <textarea
            className="w-full h-60 border border-black border-solid rounded-lg mt-2 p-3 text-base resize-none"
            name="schedule_memo"
            id="schedule_memo"
            placeholder="메모를 남겨주세요."
          ></textarea>
        </div>
        <div className="w-full mt-6 rounded-lg bg-[#aa5fd3] text-3xl text-center p-4 text-white font-bold cursor-pointer">
          저 장
        </div>
      </div>
    </div>
  );
}
