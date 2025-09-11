"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "./DatePicker";
import dayjs from "dayjs";
import { Icon } from "@iconify/react";
import { OptionState } from "@/stores/slices/option-slices";
import CategoryModal from "./CategoryModal";
import { CategoryBox } from "@/styles/calendar.style";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/index";
import { CategoryData, deleteCategory } from "@/stores/slices/category-slices";
import { addSchedule, updateSchedule, ScheduleData } from "@/stores/slices/schedule-slices";
import { addMonths, startOfMonth } from "date-fns";
import { addScheduleDBData, updateScheduleDBData, deleteCategoryDB } from "@/lib/db";

export default function DetailModal({
  userOptions,
  selectedDate,
  setSelectedDate,
}: {
  userOptions: OptionState;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const categoryList = useSelector((state: RootState) => state.categoryReducer);
  const scheduleList = useSelector((state: RootState) => state.scheduleReducer);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [startValue, setStartValue] = useState<string>(
    dayjs().format("YYYY-MM-DD HH:mm")
  );
  const [endValue, setEndValue] = useState<string>(
    dayjs().format("YYYY-MM-DD HH:mm")
  );
  const [categoryOpen, setCategoryOpen] = useState<string>("");
  const [selectCategory, setSelectCategory] = useState<CategoryData | null>(
    null
  );
  const [memo, setMemo] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleData | null>(null);

  useEffect(() => {
    if (selectedDate === "add") {
      setIsEditMode(false);
      setEditingSchedule(null);
      setTitle("");
      setMemo("");
      setSelectCategory(null);
      setStartDate(dayjs().format("YYYY-MM-DD HH:mm"));
      setEndDate(dayjs().format("YYYY-MM-DD HH:mm"));
      setStartValue(dayjs().format("YYYY-MM-DD HH:mm"));
      setEndValue(dayjs().format("YYYY-MM-DD HH:mm"));
    } else if (selectedDate.startsWith("edit:")) {
      const scheduleId = selectedDate.replace("edit:", "");
      const schedule = scheduleList.find(s => s.id === scheduleId);
      if (schedule) {
        setIsEditMode(true);
        setEditingSchedule(schedule);
        setTitle(schedule.title);
        setMemo(schedule.memo);
        setSelectCategory(schedule.category);
        setStartDate(schedule.startDate);
        setEndDate(schedule.endDate);
        setStartValue(schedule.startDate);
        setEndValue(schedule.endDate);
      }
    } else {
      setIsEditMode(false);
      setEditingSchedule(null);
      setTitle("");
      setMemo("");
      setSelectCategory(null);
      setStartDate(dayjs(selectedDate).format("YYYY-MM-DD HH:mm"));
      setEndDate(dayjs(selectedDate).format("YYYY-MM-DD HH:mm"));
      setStartValue(dayjs(selectedDate).format("YYYY-MM-DD HH:mm"));
      setEndValue(dayjs(selectedDate).format("YYYY-MM-DD HH:mm"));
    }
  }, [selectedDate, scheduleList]);

  const saveSchedule = async () => {
    if (!title) {
      alert("제목을 입력해주세요.");
      return false;
    }
    if (new Date(startValue) > new Date(endValue)) {
      alert("일정 시간을 다시 확인해주세요.");
      return false;
    }
    if (!selectCategory) {
      alert("카테고리를 선택해주세요.");
      return false;
    }

    if (isEditMode && editingSchedule) {
      // 수정 모드
      const updated_schedule = {
        ...editingSchedule,
        title,
        startDate: startValue,
        endDate: endValue,
        category: selectCategory,
        memo,
        start: startValue,
        end: endValue,
      } as ScheduleData;

      const result = await updateScheduleDBData(editingSchedule.id, updated_schedule);
      if (result) {
        dispatch(updateSchedule(result));
        alert("일정이 수정되었습니다.");
        setSelectedDate(null);
      } else {
        alert("일정 수정에 실패했습니다.");
      }
    } else {
      // 새 일정 추가
      let randomStr = Math.random().toString(36).substring(2, 12);
      const schedule_data = {
        id: randomStr,
        title,
        startDate: startValue,
        endDate: endValue,
        category: selectCategory,
        memo,
        type: "",
        turn: 0,
        start: startValue,
        end: endValue,
      } as ScheduleData;
      
      if (
        dayjs(startValue).format("YYYY-MM") !== dayjs(endValue).format("YYYY-MM")
      ) {
        const start = startOfMonth(new Date(startValue));
        const end = startOfMonth(new Date(endValue));
        for (let i = start; i <= end; i = addMonths(i, 1)) {
          const date = dayjs(i).format("YYYY-MM");
          const addData = {
            DATE: date,
            schedule: [schedule_data],
          };
          await addScheduleDBData(date, addData);
        }
      } else {
        const addData = {
          DATE: dayjs(startValue).format("YYYY-MM"),
          schedule: [schedule_data],
        };
        await addScheduleDBData(addData.DATE, addData);
      }
      dispatch(addSchedule(schedule_data));
      alert("등록되었습니다.");
      setSelectedDate(null);
    }
  };

  return (
    <div className="w-full h-full z-10">
      <div
        className="w-full h-full absolute top-0 left-0 bg-black/30 backdrop-blur-[2px] z-30"
        onClick={() => {
          setSelectedDate(null);
        }}
      ></div>
      <div className="sm:w-[640px] w-[90%] p-8 fixed border border-black border-solid h-[90%] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white overflow-hidden overflow-y-auto rounded-md z-40">
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
          {isEditMode ? "일정 수정" : selectedDate === "add" ? "일정 추가" : "일정 상세"}
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
          <div className="w-full h-24 border border-black border-solid rounded-lg mt-2 text-center overflow-hidden overflow-y-auto">
            {categoryList.length > 0 ? (
              <div className="w-full flex justify-start p-1 flex-wrap">
                {categoryList.map((category, index) => {
                  return (
                    <CategoryBox
                      className={`w-[133px] p-2 flex justify-between rounded-lg text-left mx-1 my-2 cursor-pointer border border-solid border-gray-500 ${
                        selectCategory?.color === category.color ? "active" : ""
                      }`}
                      color={category.color}
                      onClick={() => {
                        setSelectCategory(category);
                      }}
                      key={index}
                    >
                      <p className="w-1/2 text-sm truncate">{category.name}</p>
                      <div
                        className="w-6 h-6 border border-black border-solid rounded-md"
                        style={{ backgroundColor: category.color }}
                      />

                      <Icon
                        className="w-5 h-5 cursor-pointer ml-2 mt-0.5"
                        icon="solar:close-circle-outline"
                        style={{ color: "#ff4444" }}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (selectCategory?.id === category.id) {
                            setSelectCategory(null);
                          }

                          deleteCategoryDB(category.id);
                          dispatch(deleteCategory(index));
                        }}
                      />
                    </CategoryBox>
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
            value={memo}
            onChange={(e) => {
              setMemo(e.target.value);
            }}
            placeholder="메모를 남겨주세요."
          ></textarea>
        </div>
        <div
          className={`w-full mt-6 rounded-lg text-3xl text-center p-4 text-white font-bold cursor-pointer`}
          style={{ backgroundColor: userOptions.themeColor }}
          onClick={() => {
            saveSchedule();
          }}
        >
          {isEditMode ? "수 정" : "저 장"}
        </div>
      </div>
      {categoryOpen ? (
        <CategoryModal
          categoryOpen={categoryOpen}
          setCategoryOpen={setCategoryOpen}
          userOptions={userOptions}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
