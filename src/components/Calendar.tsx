"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { preventScroll, allowScroll } from "@/utils/scrollEvent";

import ScheduleModal from "./ScheduleModal";
import DetailModal from "./DetailModal";
import CalendarOption from "./CalendarOption";
import CategoryList from "./CategoryList";
import CategoryModal from "./CategoryModal";
import DatePickerModal from "./DatePickerModal";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/stores/index";
import { getOptions, OptionState } from "@/stores/slices/option-slices";
import { ScheduleData, setSchedule } from "@/stores/slices/schedule-slices";
import { CategoryData, setCategory } from "@/stores/slices/category-slices";

import {
  dayData,
  calendarDateData,
  lunarDateData,
} from "@/types/Celendar.types";

import {
  initDB,
  getOptionDBData,
  getCategoryDB,
  getScheduleDB,
} from "@/lib/db";

export default function CalendarWrap() {
  const dispatch = useDispatch<AppDispatch>();
  const userOptions = useSelector(
    (state: RootState) => state.optionReducer.value
  );
  const isOptionsLoaded = useSelector(
    (state: RootState) => state.optionReducer.isLoaded
  );
  const categoryList: CategoryData[] = useSelector(
    (state: RootState) => state.categoryReducer
  );
  const scheduleList = useSelector((state: RootState) => state.scheduleReducer);

  // Hex 색상을 RGBA로 변환하는 함수
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectDay, setSelectDay] = useState<dayData | null>(null);
  const [addSchedule, setAddSchedule] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState<boolean>(false);
  const date = useMemo(() => ["일", "월", "화", "수", "목", "금", "토"], []);
  const [holidayList, setHolidayList] = useState<
    calendarDateData[] | undefined
  >(undefined); // 국경일
  const [lunarList, setLunarList] = useState<lunarDateData[] | undefined>(
    undefined
  ); // 음력
  const [isDBReady, setIsDBReady] = useState<boolean>(false);
  const [optionOpen, setOptionOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState<string>("");
  const [datePickerOpen, setDatePickerOpen] = useState<boolean>(false);

  // 모바일 스와이프 기능을 위한 상태
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [translateX, setTranslateX] = useState(0);

  const solYear = format(currentMonth, "yyyy");
  const solMonth = format(currentMonth, "MM");

  const handleInitDB = async () => {
    const status = await initDB();
    setIsDBReady(status);
  };

  const handleGetDB = async () => {
    // DB에서 옵션만 불러옴 - 없어도 새로 생성하지 않음
    const getOptionData = await getOptionDBData();
    const getCategoryData = await getCategoryDB();
    await handleGetSchedule();

    // 옵션이 실제로 로드되었을 때만 Redux에 저장
    if (getOptionData) {
      dispatch(getOptions(getOptionData));
    } else {
      console.log('Options not loaded - using default values only in UI');
    }
    if (getCategoryData) {
      dispatch(setCategory(getCategoryData));
    }
  };

  const handleGetSchedule = async () => {
    const getScheduleData = await getScheduleDB(
      dayjs(currentMonth).format("YYYY-MM")
    );
    if (getScheduleData) {
      dispatch(setSchedule(getScheduleData.schedule));
    }
  };

  useEffect(() => {
    handleInitDB();
  }, []);

  useEffect(() => {
    if (!isDBReady) return;
    handleGetDB();
  }, [isDBReady]);

  const getHoliDay = async (holiday: boolean) => {
    if (!holiday) {
      setHolidayList(undefined);
      return;
    }
    await axios
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


  const getLunar = (lunar: boolean) => {
    if (!lunar) {
      setLunarList(undefined);
      return;
    }
    axios
      .get(
        `http://apis.data.go.kr/B090041/openapi/service/LrsrCldInfoService/getLunCalInfo?solYear=${solYear}&solMonth=${solMonth}&numOfRows=31&ServiceKey=${dataServiceKey}`
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
    handleGetSchedule();
    getHoliDay(userOptions.holiday);
    getLunar(userOptions.lunar);
  }, [currentMonth]);

  useEffect(() => {
    getHoliDay(userOptions.holiday);
  }, [userOptions.holiday]);


  useEffect(() => {
    getLunar(userOptions.lunar);
  }, [userOptions.lunar]);

  // 메모이제이션된 달력 날짜 계산 (현재 월 + 이전/다음 월)
  const calendarDates = useMemo(() => {
    const prevMonth = subMonths(currentMonth, 1);
    const nextMonth = addMonths(currentMonth, 1);
    
    const calculateMonthData = (month: Date) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(monthStart);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);
      
      return {
        month,
        monthStart,
        monthEnd,
        startDate,
        endDate,
        toDay: new Date()
      };
    };

    return {
      prev: calculateMonthData(prevMonth),
      current: calculateMonthData(currentMonth),
      next: calculateMonthData(nextMonth)
    };
  }, [currentMonth]);

  // 달력 rows 생성 함수
  const generateCalendarRows = useCallback((monthData: any) => {
    const { monthStart, monthEnd, startDate, endDate, toDay } = monthData;
    let days = [];
    let rowArr = [];
    let day = startDate;
    let index = 1;
    const scheduleBar = [];
    const scheduleCircle = [];
    if (scheduleList.length > 0) {
      for (const schedule of scheduleList) {
        // 날짜 필드 안전하게 가져오기
        const startDateStr = schedule.startDate || schedule.start;
        const endDateStr = schedule.endDate || schedule.end;
        
        // 날짜 유효성 확인
        if (!startDateStr || !endDateStr) {
          console.warn('Missing date fields for schedule:', schedule.title);
          continue;
        }
        
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        
        // 유효한 날짜인지 확인
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.warn('Invalid date format for schedule:', schedule.title, { startDateStr, endDateStr });
          continue;
        }
        
        if (
          dayjs(startDate).format("YYYYMMDD") <
          dayjs(endDate).format("YYYYMMDD")
        ) {
          const start = startOfDay(startDate);
          const end = endOfDay(endDate);
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
              start: dayjs(start).format("YYYY-MM-DD HH:mm"),
              end: dayjs(end).format("YYYY-MM-DD HH:mm"),
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
      return schedules.sort((a, b) => {
        // 1. 긴 스케줄 우선 (기간이 긴 순서대로)
        const aStart = new Date(a.startDate || a.start);
        const aEnd = new Date(a.endDate || a.end);
        const bStart = new Date(b.startDate || b.start);
        const bEnd = new Date(b.endDate || b.end);
        
        // 유효한 날짜인지 확인
        if (isNaN(aStart.getTime()) || isNaN(aEnd.getTime()) || 
            isNaN(bStart.getTime()) || isNaN(bEnd.getTime())) {
          return 0; // 유효하지 않은 날짜는 순서 변경 안함
        }
        
        const aDuration = aEnd.getTime() - aStart.getTime();
        const bDuration = bEnd.getTime() - bStart.getTime();
        
        if (aDuration !== bDuration) {
          return bDuration - aDuration; // 긴 것부터
        }
        
        // 2. 기간이 같으면 시작 시간 순
        return aStart.getTime() - bStart.getTime();
      });
    };
    const startArrs: any = {};
    while (day <= endDate) {
      index++;
      for (let i = 0; i < 7; i++) {
        const formatDate = dayjs(day).format("YYYYMMDD");
        const schedule_bar = [];
        const schedule_circle = [];
        if (scheduleBar.length > 0) {
          // 기존 진행중인 스케줄들을 먼저 배치 (between/end 타입)
          const continuingSchedules = sortSchedule(scheduleBar).filter(schedule => 
            formatDate === dayjs(schedule.startDate).format("YYYYMMDD") && 
            schedule.type !== "start"
          );
          
          // 새로 시작하는 스케줄들 (start 타입)
          const newSchedules = sortSchedule(scheduleBar).filter(schedule => 
            formatDate === dayjs(schedule.startDate).format("YYYYMMDD") && 
            schedule.type === "start"
          );

          // 기존 진행중인 스케줄들 먼저 처리 (turn 유지)
          for (const schedule of continuingSchedules) {
            if (startArrs[schedule.id] !== undefined) {
              schedule.turn = startArrs[schedule.id];
              schedule_bar.push(schedule);
            }
          }

          // 새로 시작하는 스케줄들 처리 (빈 turn 찾아서 할당)
          for (const schedule of newSchedules) {
            // 사용 중인 turn들 확인
            const usedTurns = schedule_bar.map(s => s.turn);
            
            // 빈 turn 찾기 (0, 1, 2 중에서)
            let assignedTurn = -1;
            for (let turn = 0; turn <= 2; turn++) {
              if (!usedTurns.includes(turn)) {
                assignedTurn = turn;
                break;
              }
            }
            
            // 빈 자리가 없으면 다음 번호 사용
            if (assignedTurn === -1) {
              assignedTurn = schedule_bar.length;
            }
            
            schedule.turn = assignedTurn;
            startArrs[schedule.id] = assignedTurn;
            schedule_bar.push(schedule);
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
        if (userOptions.holiday && holidayList) {
          for (const item of holidayList) {
            if (formatDate === String(item.locdate)) {
              holiday.name = item.dateName;
              holiday.isHoliday = item.isHoliday;
            }
          }
        }

        let lunar = "";
        if (userOptions.lunar && lunarList) {
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
          lunar,
          day,
          schedules,
          schedule_bar,
          schedule_circle,
        };

        days.push(dayData);
        day = addDays(day, 1);
      }
      rowArr.push(days);
      days = [];
    }
    return rowArr;
  }, [
    holidayList,
    lunarList,
    scheduleList,
    userOptions.holiday,
    userOptions.lunar
  ]);

  // 세 개 월의 memoized rows 계산
  const prevMonthRows = useMemo(() => generateCalendarRows(calendarDates.prev), [calendarDates.prev, generateCalendarRows]);
  const currentMonthRows = useMemo(() => generateCalendarRows(calendarDates.current), [calendarDates.current, generateCalendarRows]);
  const nextMonthRows = useMemo(() => generateCalendarRows(calendarDates.next), [calendarDates.next, generateCalendarRows]);

  // 현재 표시할 rows (호환성을 위해)
  const memoizedRows = currentMonthRows;


  useEffect(() => {
    if (selectDay && memoizedRows.length > 0) {
      for (const rowDays of memoizedRows) {
        for (const day of rowDays) {
          if (dayjs(selectDay.day).format("YYYYMMDD") === day.formatDate) {
            setSelectDay(day);
            return;
          }
        }
      }
    }
  }, [memoizedRows, selectDay]);

  // 메모이제이션된 버튼 클릭 이벤트
  const arrowBtnHandler = useCallback((type: string) => {
    setOptionOpen(false);
    if (type === "prev") {
      setCurrentMonth(subMonths(currentMonth, 1));
    } else {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
  }, [currentMonth]);

  // 모바일 스와이프 처리 함수들
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (isTransitioning) return;
    e.stopPropagation(); // 이벤트 버블링 방지
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTranslateX(0);
  }, [isTransitioning]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart || isTransitioning) return;
    
    e.preventDefault(); // 스크롤 방지
    e.stopPropagation(); // 이벤트 버블링 방지
    
    const currentTouch = e.targetTouches[0].clientX;
    const diff = currentTouch - touchStart;
    
    // 스와이프 범위 제한 (-100vw ~ 100vw) with damping
    const maxTranslate = window.innerWidth;
    let limitedDiff = Math.max(-maxTranslate, Math.min(maxTranslate, diff));
    
    // 경계에서 저항 추가 (고무밴드 효과)
    if (Math.abs(limitedDiff) > maxTranslate * 0.8) {
      const excess = Math.abs(limitedDiff) - maxTranslate * 0.8;
      const damping = 0.3;
      limitedDiff = limitedDiff > 0 ? 
        maxTranslate * 0.8 + excess * damping : 
        -maxTranslate * 0.8 - excess * damping;
    }
    
    // 직접 업데이트로 빠른 반응성
    setTouchEnd(currentTouch);
    setTranslateX(limitedDiff);
  }, [touchStart, isTransitioning]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || isTransitioning) return;
    
    const distance = touchStart - touchEnd;
    const threshold = window.innerWidth * 0.15; // 임계값을 15%로 줄여서 더 민감하게
    
    setIsTransitioning(true);
    
    if (Math.abs(distance) > threshold) {
      // 가속도를 고려한 더 부드러운 애니메이션
      const finalTranslate = distance > 0 ? -window.innerWidth : window.innerWidth;
      
      // CSS transition 사용으로 더 부드러운 애니메이션
      setTranslateX(finalTranslate);
      
      setTimeout(() => {
        if (distance > 0) {
          arrowBtnHandler("next");
        } else {
          arrowBtnHandler("prev");
        }
        setTranslateX(0);
        setIsTransitioning(false);
      }, 250); // 애니메이션 시간 단축
    } else {
      // 스와이프가 충분하지 않으면 원래 위치로 복귀
      setTranslateX(0);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 200); // 복귀 시간 단축
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd, arrowBtnHandler, isTransitioning]);

  // 메모이제이션된 달력 헤더
  const calendarHeader = useMemo(() => (
    <div className="w-full flex bg-gray-50 border-b border-gray-200">
      {date.map((value, index) => (
        <div
          key={index}
          className={`${
            index === 0 ? "" : "border-l border-gray-200"
          } w-full text-center py-2 sm:py-3 md:py-4 font-semibold text-xs sm:text-sm tracking-wide`}
        >
          <span
            className={
              index === 0
                ? "text-red-500"
                : index === 6
                ? "text-blue-500"
                : "text-gray-700"
            }
          >
            {value}
          </span>
        </div>
      ))}
    </div>
  ), [date]);

  // 달력 렌더링 함수
  const renderCalendar = useCallback((rows: any[], monthOffset: number) => {
    const targetMonth = monthOffset === -1 ? subMonths(currentMonth, 1) : 
                       monthOffset === 1 ? addMonths(currentMonth, 1) : currentMonth;
    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    
    return (
      <div 
        className="flex-shrink-0" 
        style={{ 
          width: `${containerWidth}px`,
          transform: 'translate3d(0, 0, 0)',
          willChange: 'auto',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          WebkitTransform: 'translate3d(0, 0, 0)',
          isolation: 'isolate',
          contain: 'layout style'
        }}
      >
        {rows.map((days, index) => (
          <div
            key={`${monthOffset}-row-${index}`}
            className="border-b border-gray-200 last:border-b-0 justify-between flex w-full"
            style={{
              transform: 'translateZ(0)',
              willChange: 'auto',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              minWidth: 0,
              maxWidth: '100%'
            }}
          >
            {days.map((day: dayData, i: number) => {
                const formattedDate = format(day.day, "d");
                const isCurrentMonth = format(targetMonth, "M") === format(day.day, "M");
                const isToday = day.state === "selected" && monthOffset === 0; // 오늘은 현재 월에만
                const isWeekend = i === 0 || i === 6;
              const isHoliday = day.holiday.isHoliday === "Y";
              
              return (
                <div
                  className={`${
                    i === 0 ? "" : "border-l border-gray-200"
                  } box-content text-left p-1 sm:p-2 md:p-4 w-full h-24 sm:h-32 md:h-40 cursor-pointer relative overflow-hidden ${
                    !isCurrentMonth 
                      ? "bg-gray-100 hover:bg-gray-150" 
                      : "hover:bg-gray-50"
                  } ${day.state === 'disabled' ? 'pointer-events-none' : ''}`}
                  style={{
                    transform: 'translate3d(0, 0, 0)',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    minWidth: 0,
                    maxWidth: '100%',
                    WebkitBackfaceVisibility: 'hidden',
                    WebkitTransform: 'translate3d(0, 0, 0)',
                    transition: 'none'
                  }}
                  id={`date-${day.formatDate}`}
                  key={`day-${i}`}
                  onClick={() => {
                    setSelectDay(day);
                  }}
                >
                  <div className="flex items-start justify-between mb-0 sm:mb-2">
                    <div className="flex flex-col items-start">
                      <div
                        className={`
                          w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-semibold text-xs sm:text-sm transition-all duration-200
                          ${isToday ? 'text-white shadow-lg' : ''}
                          ${!isCurrentMonth ? 'text-gray-500' : 
                            isHoliday || (isWeekend && i === 0) ? 'text-red-500' : 
                            isWeekend && i === 6 ? 'text-blue-500' : 'text-gray-800'}
                          ${isToday ? 'hover:scale-110' : !isCurrentMonth ? '' : 'hover:bg-gray-100'}
                        `}
                        style={{
                          backgroundColor: isToday ? userOptions.themeColor : 'transparent'
                        }}
                      >
                        {formattedDate}
                      </div>
                    </div>
                    {/* {isToday && (
                      <div className="hidden sm:flex items-center">
                        <div
                          className="w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-semibold text-sm text-white shadow-lg"
                          style={{ backgroundColor: userOptions.themeColor }}
                        >
                          T
                        </div>
                      </div>
                    )} */}
                  </div>
                  {/* 공휴일 정보 표시 영역 */}
                  <div className="space-y-0.5 mb-0">
                    {day.holiday.name && (
                      <div className="text-[8px] sm:text-xs">
                        <div className={`${!isCurrentMonth ? 'text-gray-400' : 'text-red-500'} font-medium truncate`}>
                          {day.holiday.name}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* 음력 정보 */}
                  {day.lunar && (
                    <div className={`absolute top-1 sm:top-2 md:top-4 right-1 sm:right-2 md:right-3 text-[8px] sm:text-xs ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-500'}`}>
                      {day.lunar}
                    </div>
                  )}
                  
                  {/* 스케줄 바 영역 */}
                  <div className="absolute w-full h-6 top-[45px] sm:top-[70px] md:top-[90px] left-0 z-10">
                    {(() => {
                      const maxVisible = window.innerWidth < 640 ? 3 : window.innerWidth < 768 ? 2 : 2;
                      const visibleSchedules = day.schedule_bar.filter(s => s.turn <= maxVisible);
                      const hiddenSchedules = day.schedule_bar.filter(s => s.turn > maxVisible);
                      
                      return (
                        <>
                          {visibleSchedules.map((schedule, num) => (
                            <div key={num}>
                              <div
                                className={`w-[100%] absolute left-0 h-2 sm:h-2.5 md:h-3 overflow-hidden shadow-sm ${
                                  schedule.type === "start" ? "rounded-l-full" : ""
                                } ${
                                  schedule.type === "end" ? "rounded-r-full" : ""
                                }`}
                                style={{
                                  backgroundColor: !isCurrentMonth 
                                    ? hexToRgba(schedule.category.color, 0.3)
                                    : schedule.category.color,
                                  top: `${schedule.turn * (window.innerWidth < 640 ? 10 : 14)}px`,
                                }}
                              />
                            </div>
                          ))}
                          {hiddenSchedules.length > 0 && (
                            <div className="absolute top-[-10px] sm:top-[-12px] md:top-[-15px] bg-white right-0.5 sm:right-1 border border-gray-200 rounded px-0.5 sm:px-1 text-[10px] sm:text-xs text-gray-600 shadow-sm">
                              +{hiddenSchedules.length}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  {/* 스케줄 원형 영역 */}
                    <div className="absolute bottom-0.5 sm:bottom-1 left-1 sm:left-2 z-10 h-4 sm:h-6">
                      <div className="flex items-start gap-0.5 sm:gap-1 flex-wrap">
                        {day.schedule_circle.slice(0, window.innerWidth < 640 ? 3 : 6).map((schedule, num) => (
                          <div
                            key={num}
                            className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full shadow-sm border border-white"
                            style={{
                              backgroundColor: !isCurrentMonth 
                                ? hexToRgba(schedule.category.color, 0.3)
                                : schedule.category.color,
                            }}
                          />
                        ))}
                        {day.schedule_circle.length > (window.innerWidth < 640 ? 3 : 6) && (
                          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gray-200 border border-white shadow-sm flex items-center justify-center">
                            <span className="text-[8px] sm:text-[10px] font-semibold text-gray-600">
                              +{day.schedule_circle.length - (window.innerWidth < 640 ? 3 : 6)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                </div>
              );
            })}
        </div>
      ))}
    </div>
    );
  }, [currentMonth, userOptions.themeColor]);

  // 메모이제이션된 달력 바디
  const calendarBody = useMemo(() => {
    const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1000;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    
    if (isMobile) {
      // 모바일: 스와이프 기능 활성화
      return (
        <div 
          className="w-full overflow-hidden relative"
          style={{
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            isolation: 'isolate',
            contain: 'layout style paint',
            touchAction: 'pan-x',
            WebkitTouchCallout: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          <div 
            className={`flex ${isTransitioning ? 'transition-transform ease-out' : ''}`}
            style={{
              transform: `translate3d(${-containerWidth + translateX}px, 0, 0)`,
              width: `${containerWidth * 3}px`,
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              WebkitTransform: `translate3d(${-containerWidth + translateX}px, 0, 0)`,
              ...(isTransitioning && {
                transitionDuration: '250ms',
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              })
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {renderCalendar(prevMonthRows, -1)}
            {renderCalendar(currentMonthRows, 0)}
            {renderCalendar(nextMonthRows, 1)}
          </div>
        </div>
      );
    } else {
      // PC: 기존 방식으로 현재 달만 표시
      return (
        <div className="w-full overflow-hidden">
          {currentMonthRows.map((days, index) => (
            <div
              key={`row-${index}`}
              className="border-b border-gray-200 last:border-b-0 justify-between flex w-full"
              style={{
                transform: 'translateZ(0)',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                minWidth: 0,
                maxWidth: '100%'
              }}
            >
              {days.map((day: dayData, i: number) => {
                  const formattedDate = format(day.day, "d");
                  const isCurrentMonth = format(currentMonth, "M") === format(day.day, "M");
                  const isToday = day.state === "selected";
                  const isWeekend = i === 0 || i === 6;
                const isHoliday = day.holiday.isHoliday === "Y";
                
                return (
                  <div
                    className={`${
                      i === 0 ? "" : "border-l border-gray-200"
                    } box-content text-left p-1 sm:p-2 md:p-4 w-full h-24 sm:h-32 md:h-40 cursor-pointer relative transition-colors duration-200 overflow-hidden ${
                      !isCurrentMonth 
                        ? "bg-gray-100 hover:bg-gray-150" 
                        : "hover:bg-gray-50"
                    } ${day.state === 'disabled' ? 'pointer-events-none' : ''}`}
                    style={{
                      willChange: 'background-color',
                      minWidth: 0,
                      maxWidth: '100%'
                    }}
                    id={`date-${day.formatDate}`}
                    key={`day-${i}`}
                    onClick={() => {
                      setSelectDay(day);
                    }}
                  >
                    <div className="flex items-start justify-between mb-0 sm:mb-2">
                      <div className="flex flex-col items-start">
                        <div
                          className={`
                            w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center font-semibold text-xs sm:text-sm transition-all duration-200
                            ${isToday ? 'text-white shadow-lg' : ''}
                            ${!isCurrentMonth ? 'text-gray-500' : 
                              isHoliday || (isWeekend && i === 0) ? 'text-red-500' : 
                              isWeekend && i === 6 ? 'text-blue-500' : 'text-gray-800'}
                            ${isToday ? 'hover:scale-110' : !isCurrentMonth ? '' : 'hover:bg-gray-100'}
                          `}
                          style={{
                            backgroundColor: isToday ? userOptions.themeColor : 'transparent'
                          }}
                        >
                          {formattedDate}
                        </div>
                      </div>
                    </div>
                    {/* 공휴일 정보 표시 영역 */}
                    <div className="space-y-0.5 mb-0 w-full overflow-hidden">
                      {day.holiday.name && (
                        <div className="text-[8px] sm:text-xs w-full max-w-full">
                          <div className={`${!isCurrentMonth ? 'text-gray-400' : 'text-red-500'} font-medium truncate w-full max-w-full overflow-hidden text-ellipsis whitespace-nowrap`}>
                            {day.holiday.name}
                          </div>
                        </div>
                      )}
                    </div>
                    {/* 음력 정보 */}
                    {day.lunar && (
                      <div className={`absolute top-1 sm:top-2 md:top-4 right-1 sm:right-2 md:right-3 text-[8px] sm:text-xs max-w-[60px] overflow-hidden text-ellipsis whitespace-nowrap ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-500'}`}>
                        {day.lunar}
                      </div>
                    )}
                    
                    {/* 스케줄 바 영역 */}
                    <div className="absolute w-full h-6 top-[45px] sm:top-[70px] md:top-[90px] left-0 z-10">
                      {(() => {
                        const maxVisible = window.innerWidth < 640 ? 3 : window.innerWidth < 768 ? 2 : 2;
                        const visibleSchedules = day.schedule_bar.filter(s => s.turn <= maxVisible);
                        const hiddenSchedules = day.schedule_bar.filter(s => s.turn > maxVisible);
                        
                        return (
                          <>
                            {visibleSchedules.map((schedule, num) => (
                              <div key={num}>
                                <div
                                  className={`w-[100%] absolute left-0 h-2 sm:h-2.5 md:h-3 overflow-hidden shadow-sm ${
                                    schedule.type === "start" ? "rounded-l-full" : ""
                                  } ${
                                    schedule.type === "end" ? "rounded-r-full" : ""
                                  }`}
                                  style={{
                                    backgroundColor: !isCurrentMonth 
                                      ? `rgba(${parseInt(schedule.category.color.slice(1,3), 16)}, ${parseInt(schedule.category.color.slice(3,5), 16)}, ${parseInt(schedule.category.color.slice(5,7), 16)}, 0.3)`
                                      : schedule.category.color,
                                    top: `${schedule.turn * (window.innerWidth < 640 ? 10 : 14)}px`,
                                  }}
                                />
                              </div>
                            ))}
                            {hiddenSchedules.length > 0 && (
                              <div className="absolute top-[-10px] sm:top-[-12px] md:top-[-15px] bg-white right-0.5 sm:right-1 border border-gray-200 rounded px-0.5 sm:px-1 text-[10px] sm:text-xs text-gray-600 shadow-sm">
                                +{hiddenSchedules.length}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                    {/* 스케줄 원형 영역 */}
                      <div className="absolute bottom-0.5 sm:bottom-1 left-1 sm:left-2 z-10 h-4 sm:h-6">
                        <div className="flex items-start gap-0.5 sm:gap-1 flex-wrap">
                          {day.schedule_circle.slice(0, window.innerWidth < 640 ? 3 : 6).map((schedule, num) => (
                            <div
                              key={num}
                              className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full shadow-sm border border-white"
                              style={{
                                backgroundColor: !isCurrentMonth 
                                  ? `rgba(${parseInt(schedule.category.color.slice(1,3), 16)}, ${parseInt(schedule.category.color.slice(3,5), 16)}, ${parseInt(schedule.category.color.slice(5,7), 16)}, 0.3)`
                                  : schedule.category.color,
                              }}
                            />
                          ))}
                          {day.schedule_circle.length > (window.innerWidth < 640 ? 3 : 6) && (
                            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gray-200 border border-white shadow-sm flex items-center justify-center">
                              <span className="text-[8px] sm:text-[10px] font-semibold text-gray-600">
                                +{day.schedule_circle.length - (window.innerWidth < 640 ? 3 : 6)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      );
    }
  }, [currentMonthRows, prevMonthRows, nextMonthRows, translateX, isTransitioning, handleTouchStart, handleTouchMove, handleTouchEnd, renderCalendar, currentMonth, userOptions.themeColor]);

  useEffect(() => {
    setOptionOpen(false);
    if (selectDay || addSchedule) {
      preventScroll();
    } else {
      allowScroll();
    }
  }, [selectDay, addSchedule]);



  // 옵션이 로드되지 않은 경우 로딩 화면 표시
  if (!isOptionsLoaded) {
    return (
      <div className="sm:container mx-auto box-content py-20">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
            <p className="text-gray-500">사용자 설정을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:container mx-auto box-content pb-8">
      <div className="w-full mx-auto max-w-7xl">
        {/* calendars */}
        <div className="w-full mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* calendar-header */}
          <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
            {/* 모바일: 카테고리를 위쪽으로 */}
            <div className="sm:hidden w-full px-3 py-2 border-b border-gray-100">
              <div
                className="relative cursor-pointer bg-gray-50 rounded-xl p-2 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => {
                  setCategoryOpen(!categoryOpen);
                }}
              >
                <div className="flex items-center gap-1 overflow-x-auto overflow-y-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                  <div className="flex items-center gap-1 flex-nowrap">
                    {categoryList.map((category, index) => (
                      <div key={index} className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-md shadow-sm flex-shrink-0">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-xs font-medium text-gray-700 whitespace-nowrap">{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {categoryOpen && (
                  <CategoryList categoryList={categoryList} setCategoryModalOpen={setCategoryModalOpen} userOptions={userOptions} onClose={() => setCategoryOpen(false)} />
                )}
              </div>
            </div>

            {/* 데스크톱: 년도만 */}
            <div className="hidden sm:block w-full px-3 sm:px-6 py-2 sm:py-4 border-b border-gray-100 text-center">
              <button
                className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide hover:bg-gray-100 px-2 sm:px-4 py-1 sm:py-2 rounded-xl transition-colors duration-200"
                style={{ color: userOptions.themeColor }}
                onClick={() => setDatePickerOpen(true)}
              >
                {format(currentMonth, "yyyy")}
              </button>
            </div>

            <div className="px-3 sm:px-6 py-2 sm:py-4 justify-between flex items-center">
              {/* 모바일: 년도 + 월 + 버튼들 */}
              <div className="sm:hidden flex items-center gap-2 w-full justify-between">
                {/* 왼쪽: 년도 */}
                <div className="flex items-center">
                  <button
                    className="text-lg font-bold tracking-wide hover:bg-gray-100 px-2 py-1 rounded-xl transition-colors duration-200"
                    style={{ color: userOptions.themeColor }}
                    onClick={() => setDatePickerOpen(true)}
                  >
                    {format(currentMonth, "yyyy")}
                  </button>
                </div>

                {/* 중앙: 월 + 네비게이션 */}
                <div className="flex justify-center items-center">
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                      onClick={() => arrowBtnHandler("prev")}
                    >
                      <Icon
                        className="w-4 h-4"
                        icon="heroicons:chevron-left"
                        style={{ color: userOptions.themeColor }}
                      />
                    </button>
                    <button 
                      className="text-xl font-bold mx-2 text-gray-800 hover:bg-gray-100 px-3 py-1 rounded-xl transition-colors duration-200"
                      onClick={() => setDatePickerOpen(true)}
                    >
                      {format(currentMonth, "MM")}월
                    </button>
                    <button
                      className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm"
                      onClick={() => arrowBtnHandler("next")}
                    >
                      <Icon
                        className="w-4 h-4"
                        icon="heroicons:chevron-right"
                        style={{ color: userOptions.themeColor }}
                      />
                    </button>
                  </div>
                </div>

                {/* 오른쪽: 일정추가, 설정 버튼 */}
                <div className="flex items-center gap-1.5">
                  <button
                    className="p-1.5 rounded-lg text-white shadow-md transition-all duration-200 flex items-center"
                    style={{ backgroundColor: userOptions.themeColor }}
                    onClick={() => setAddSchedule("add")}
                  >
                    <Icon className="w-4 h-4" icon="heroicons:plus" />
                  </button>
                  <button
                    className="p-1.5 rounded-lg relative bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition-all duration-200"
                    onClick={() => setOptionOpen(!optionOpen)}
                  >
                    <Icon
                      className="w-4 h-4"
                      icon="heroicons:cog-6-tooth"
                      style={{ color: userOptions.themeColor }}
                    />
                    {optionOpen && (
                      <CalendarOption userOptions={userOptions} onClose={() => setOptionOpen(false)} />
                    )}
                  </button>
                </div>
              </div>

              {/* 데스크톱: 기존 레이아웃 */}
              <div className="hidden sm:flex justify-between items-center w-full">
                <div className="flex justify-start items-center">
                  <button 
                    className="text-xl sm:text-2xl md:text-3xl font-bold mr-2 sm:mr-4 text-gray-800 hover:bg-gray-100 px-2 sm:px-4 py-1 sm:py-2 rounded-xl transition-colors duration-200"
                    onClick={() => setDatePickerOpen(true)}
                  >
                    {format(currentMonth, "MM")}월
                  </button>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <button
                      className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white border border-gray-200 sm:border-2 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                      onClick={() => arrowBtnHandler("prev")}
                    >
                      <Icon
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                        icon="heroicons:chevron-left"
                        style={{ color: userOptions.themeColor }}
                      />
                    </button>
                    <button
                      className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white border border-gray-200 sm:border-2 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                      onClick={() => arrowBtnHandler("next")}
                    >
                      <Icon
                        className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"
                        icon="heroicons:chevron-right"
                        style={{ color: userOptions.themeColor }}
                      />
                    </button>
                  </div>
                </div>
                <div
                  className="flex-1 mx-2 sm:mx-4 md:mx-6 relative cursor-pointer bg-gray-50 rounded-xl p-2 sm:p-3 hover:bg-gray-100 transition-colors duration-200"
                  onClick={() => {
                    setCategoryOpen(!categoryOpen);
                  }}
                >
                  <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                    {categoryList.slice(0, categoryList.length > 6 ? 6 : 8).map((category, index) => (
                      <div key={index} className="flex items-center gap-1 bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm">
                        <div
                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">{category.name}</span>
                      </div>
                    ))}
                    {categoryList.length > (categoryList.length > 6 ? 6 : 8) && (
                      <div className="bg-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg shadow-sm">
                        <span className="text-xs sm:text-sm font-medium text-gray-500">+{categoryList.length - (categoryList.length > 6 ? 6 : 8)}</span>
                      </div>
                    )}
                  </div>
                  {categoryOpen && (
                    <CategoryList categoryList={categoryList} setCategoryModalOpen={setCategoryModalOpen} userOptions={userOptions} onClose={() => setCategoryOpen(false)} />
                  )}
                </div>
                <div className="flex items-center gap-3 relative">
                  <button
                    className="p-3 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 hover:opacity-90"
                    style={{ backgroundColor: userOptions.themeColor }}
                    onClick={() => setAddSchedule("add")}
                  >
                    <Icon className="w-5 h-5" icon="heroicons:plus" />
                    <span className="text-sm font-medium">일정 추가</span>
                  </button>
                  <button
                    className="p-3 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => setOptionOpen(!optionOpen)}
                  >
                    <Icon
                      className="w-5 h-5"
                      icon="heroicons:cog-6-tooth"
                      style={{ color: userOptions.themeColor }}
                    />
                  </button>
                  {optionOpen && (
                    <CalendarOption userOptions={userOptions} onClose={() => setOptionOpen(false)} />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* calendar-days */}
          {calendarHeader}
          {/* calendar-body */}
          {calendarBody}
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
      {categoryModalOpen && (
        <CategoryModal
          categoryOpen={categoryModalOpen}
          setCategoryOpen={setCategoryModalOpen}
          userOptions={userOptions}
        />
      )}
      <DatePickerModal
        isOpen={datePickerOpen}
        setIsOpen={setDatePickerOpen}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        userOptions={userOptions}
      />
    </div>
  );
}
