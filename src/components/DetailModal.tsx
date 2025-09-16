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
      <div className="sm:w-[600px] w-[90%] p-3 sm:p-6 fixed border-0 shadow-2xl h-[90%] top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-white overflow-hidden overflow-y-auto rounded-2xl z-40">
        <div
          className="absolute top-4 right-4 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => {
            setSelectedDate(null);
          }}
        >
          <Icon
            className="w-6 h-6 text-gray-400"
            icon="material-symbols:close"
          />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          <Icon
            className="w-7 h-7 inline-block -mt-1 mr-2"
            icon="material-symbols:edit-calendar"
            style={{ color: userOptions.themeColor }}
          />
          {isEditMode ? "일정 수정" : selectedDate === "add" ? "일정 추가" : "일정 상세"}
        </h2>
        <div className="w-full mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">제목</label>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ "--tw-ring-color": userOptions.themeColor } as any}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            placeholder="일정 제목을 입력해주세요"
          />
        </div>
        <div className="w-full mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">시간</label>
          <DatePicker
            userOptions={userOptions}
            startDate={startDate}
            setStartValue={setStartValue}
            endDate={endDate}
            setEndValue={setEndValue}
          />
        </div>
        <div className="w-full mb-6">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-semibold text-gray-700">카테고리</label>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => {
                setCategoryOpen("add");
              }}
            >
              <Icon
                className="w-5 h-5"
                icon="material-symbols:add"
                style={{ color: userOptions.themeColor }}
              />
            </button>
          </div>
          <div className="w-full min-h-[120px] border border-gray-300 rounded-lg p-3 bg-gray-50 overflow-y-auto">
            {categoryList.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {categoryList.map((category, index) => {
                  const isSelected = selectCategory?.id === category.id;
                  return (
                    <div
                      className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                        isSelected 
                          ? "border-current bg-white shadow-sm" 
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      style={{ 
                        borderColor: isSelected ? category.color : undefined,
                        backgroundColor: isSelected ? `${category.color}10` : undefined
                      }}
                      onClick={() => {
                        setSelectCategory(category);
                      }}
                      key={index}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm font-medium truncate">{category.name}</span>
                        </div>
                        <button
                          className="p-1 rounded-full hover:bg-red-100 transition-colors flex-shrink-0"
                          onClick={(event) => {
                            event.stopPropagation();
                            if (selectCategory?.id === category.id) {
                              setSelectCategory(null);
                            }
                            deleteCategoryDB(category.id);
                            dispatch(deleteCategory(index));
                          }}
                        >
                          <Icon
                            className="w-4 h-4 text-gray-400 hover:text-red-500"
                            icon="material-symbols:close"
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-20">
                <p className="text-gray-400 text-sm">카테고리가 없습니다</p>
              </div>
            )}
          </div>
        </div>
        <div className="w-full mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">메모</label>
          <textarea
            className="w-full h-32 border border-gray-300 rounded-lg px-4 py-3 text-base resize-none focus:outline-none focus:ring-2 focus:border-transparent transition-all"
            style={{ "--tw-ring-color": userOptions.themeColor } as any}
            name="schedule_memo"
            id="schedule_memo"
            value={memo}
            onChange={(e) => {
              setMemo(e.target.value);
            }}
            placeholder="메모를 남겨주세요"
          ></textarea>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            className="flex-1 py-3 px-6 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            onClick={() => {
              setSelectedDate(null);
            }}
          >
            취소
          </button>
          <button
            className="flex-1 py-3 px-6 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
            style={{ backgroundColor: userOptions.themeColor }}
            onClick={() => {
              saveSchedule();
            }}
          >
            {isEditMode ? "수정" : "저장"}
          </button>
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
