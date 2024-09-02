import React, { useState, useEffect } from "react";
import DatePicker from "./DatePicker";
import dayjs from "dayjs";

export default function DetailModal({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

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
          {selectedDate === "add" ? "일정 추가" : "일정 상세"}
        </h2>
        <div className="w-full mt-4">
          <h3 className="text-xl font-bold">제목</h3>
          <input
            className=""
            type="text"
            placeholder="일정 제목을 입력해주세요."
          />
        </div>
        <div className="w-full mt-4">
          <h3 className="text-xl font-bold">시간</h3>
          <DatePicker
            selectedDate={selectedDate}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
          />
        </div>
      </div>
    </div>
  );
}
