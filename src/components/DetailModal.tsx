"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "./DatePicker";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { OptionState } from "@/stores/slices/option-slices";
import CategoryModal from "./CategoryModal";

type cateData = {
  id: string;
  name: string;
  color: string;
};

export default function DetailModal({
  userOptions,
  selectedDate,
  setSelectedDate,
}: {
  userOptions: OptionState;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [startValue, setStartValue] = useState<string | null>(null);
  const [endValue, setEndValue] = useState<string | null>(null);
  const [categoryList, setCategoryList] = useState<cateData[]>([]);
  const [categoryOpen, setCategoryOpen] = useState<string>("");

  useEffect(() => {
    if (selectedDate === "add") {
      setStartDate(dayjs().format("YYYY-MM-DD HH:mm"));
      setEndDate(dayjs().format("YYYY-MM-DD HH:mm"));
    } else {
      setStartDate(dayjs(selectedDate).format("YYYY-MM-DD HH:mm"));
      setEndDate(dayjs(selectedDate).format("YYYY-MM-DD HH:mm"));
    }
  }, [selectedDate]);

  const categoryAdd = (name: string, color: string) => {
    const list = [...categoryList];
    const newObj = {
      id: "",
      name,
      color,
    };
    list.push(newObj);
    setCategoryList(list);
  };

  useEffect(() => {
    console.log("categoryList:", categoryList);
  }, [categoryList]);

  return (
    <div className="w-full h-full">
      <div
        className="w-full h-full absolute top-0 left-0 bg-black/30 backdrop-blur-[2px]"
        onClick={() => {
          setSelectedDate(null);
        }}
      ></div>
      <div className="sm:w-[640px] w-[90%] p-8 fixed border border-black border-solid h-[90%] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white overflow-hidden overflow-y-auto rounded-md">
        <div
          className="absolute top-5 right-5 cursor-pointer"
          onClick={() => {
            setSelectedDate(null);
          }}
        >
          <Icon
            className="w-10 h-10"
            icon="mdi:close-outline"
            style={{ color: userOptions.themeColor }}
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-600">
          <Icon
            className="w-10 h-10 inline-block -mt-2 mr-1"
            icon="mingcute:schedule-fill"
            style={{ color: userOptions.themeColor }}
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
            userOptions={userOptions}
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
              style={{ color: userOptions.themeColor }}
              onClick={() => {
                setCategoryOpen("add");
              }}
            />
          </div>
          <div className="w-full h-24 border border-black border-solid rounded-lg mt-2 text-center">
            {categoryList.length > 0 ? (
              <div className="w-full flex justify-between p-1">
                {categoryList.map((category, index) => {
                  return (
                    <div
                      className="w-1/4 p-2 flex justify-between rounded-lg text-left"
                      style={{ border: `2px solid ${category.color}` }}
                      key={index}
                    >
                      <p className="w-1/2 text-sm">{category.name}</p>
                      <div
                        className="w-5 h-5 border border-black border-solid rounded-md"
                        style={{ backgroundColor: category.color }}
                      />

                      <Icon
                        className="w-5 h-5 cursor-pointer"
                        icon="solar:close-circle-outline"
                        style={{ color: "#ff4444" }}
                      />
                    </div>
                  );
                })}
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
        <div
          className={`w-full mt-6 rounded-lg text-3xl text-center p-4 text-white font-bold cursor-pointer`}
          style={{ backgroundColor: userOptions.themeColor }}
        >
          저 장
        </div>
      </div>
      {categoryOpen ? (
        <CategoryModal
          categoryOpen={categoryOpen}
          setCategoryOpen={setCategoryOpen}
          userOptions={userOptions}
          complate={categoryAdd}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
