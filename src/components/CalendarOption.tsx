import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/stores/index";
import { OptionState, valueChange } from "@/stores/slices/option-slices";
import { ChromePicker } from "react-color";
import { OptionSwitch } from "@/styles/option.style";
import { addOptionDBData } from "@/lib/db";

export default function CalendarOption({
  userOptions,
}: {
  userOptions: OptionState;
}) {
  const [themeOpen, setThemeOpen] = useState<boolean>(false);
  const [bgOpen, setBgOpen] = useState<boolean>(false);
  const [prevThemeColor, setPrevThemeColor] = useState<string>(
    userOptions.themeColor
  );
  const [prevBgColor, setPrevBgColor] = useState<string>(userOptions.bgColor);

  useEffect(() => {
    addOptionDBData(userOptions);
  }, [
    userOptions.holiday,
    userOptions.anniversary,
    userOptions.exquisiteness,
    userOptions.lunar,
  ]);

  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="w-60 rounded-md bg-white absolute top-10 -right-2 z-20 border border-black border-solid">
      <div className="w-full p-4">
        <div className="w-full flex justify-between mb-4">
          <span className="font-bold text-lg text-black">테마색</span>
          <div
            className={`w-8 h-8 border border-black border-solid rounded-sm cursor-pointer relative`}
            style={{ backgroundColor: prevThemeColor }}
            onClick={() => {
              if (themeOpen) {
                dispatch(valueChange(["themeColor", prevThemeColor]));
              }
              setThemeOpen(!themeOpen);
            }}
          >
            {themeOpen ? (
              <div
                className="w-60 absolute top-8 -right-3 z-30 bg-white border-black border border-solid rounded-md"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <div
                  className="fixed top-0 left-0 w-full h-full cursor-default"
                  onClick={() => {
                    dispatch(valueChange(["themeColor", prevThemeColor]));
                    setThemeOpen(false);
                  }}
                />
                <ChromePicker
                  className="mx-auto mt-2 cursor-pointer relative z-20"
                  color={userOptions.themeColor}
                  onChange={(e) => {
                    dispatch(valueChange(["themeColor", e.hex]));
                  }}
                />
                <ul className="p-2 flex justify-end text-center cursor-default relative z-20">
                  <li
                    className="p-2 border border-solid border-black rounded mr-4 cursor-pointer"
                    onClick={() => {
                      dispatch(valueChange(["themeColor", prevThemeColor]));
                      setThemeOpen(false);
                    }}
                  >
                    취소
                  </li>
                  <li
                    className="p-2 border border-solid border-black rounded cursor-pointer"
                    onClick={async () => {
                      await addOptionDBData(userOptions);
                      setPrevThemeColor(userOptions.themeColor);
                      setThemeOpen(false);
                    }}
                  >
                    저장
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="w-full flex justify-between mb-4">
          <span className="font-bold text-lg text-black">배경색</span>
          <div
            className={`w-8 h-8 border border-black border-solid rounded-sm cursor-pointer relative`}
            style={{ backgroundColor: prevBgColor }}
            onClick={() => {
              if (bgOpen) {
                dispatch(valueChange(["bgColor", prevBgColor]));
              }
              setBgOpen(!bgOpen);
            }}
          >
            {bgOpen ? (
              <div
                className="w-60 absolute top-8 -right-3 z-30 bg-white border-black border border-solid rounded-md"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <div
                  className="fixed top-0 left-0 w-full h-full cursor-default"
                  onClick={() => {
                    dispatch(valueChange(["bgColor", prevBgColor]));
                    setBgOpen(false);
                  }}
                />
                <ChromePicker
                  className="mx-auto mt-2 cursor-pointer relative z-20"
                  color={userOptions.bgColor}
                  onChange={(e) => {
                    dispatch(valueChange(["bgColor", e.hex]));
                  }}
                />
                <ul className="p-2 flex justify-end text-center cursor-default relative z-20">
                  <li
                    className="p-2 border border-solid border-black rounded mr-4 cursor-pointer"
                    onClick={() => {
                      dispatch(valueChange(["bgColor", prevBgColor]));
                      setBgOpen(false);
                    }}
                  >
                    취소
                  </li>
                  <li
                    className="p-2 border border-solid border-black rounded cursor-pointer"
                    onClick={async () => {
                      await addOptionDBData(userOptions);
                      setPrevBgColor(userOptions.bgColor);
                      setBgOpen(false);
                    }}
                  >
                    저장
                  </li>
                </ul>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="w-full flex justify-between mb-4">
          <span className="font-bold text-lg text-black">공휴일</span>
          <OptionSwitch>
            <input
              type="checkbox"
              id="holiday_switch"
              className="switch"
              checked={userOptions.holiday}
              onChange={async (e) => {
                await dispatch(valueChange(["holiday", e.target.checked]));
              }}
            />
            <label htmlFor="holiday_switch"></label>
          </OptionSwitch>
        </div>
        <div className="w-full flex justify-between mb-4">
          <span className="font-bold text-lg text-black">기념일</span>
          <OptionSwitch>
            <input
              type="checkbox"
              id="anniversary_switch"
              className="switch"
              checked={userOptions.anniversary}
              onChange={(e) => {
                dispatch(valueChange(["anniversary", e.target.checked]));
              }}
            />
            <label htmlFor="anniversary_switch"></label>
          </OptionSwitch>
        </div>
        <div className="w-full flex justify-between mb-4">
          <span className="font-bold text-lg text-black">절기</span>
          <OptionSwitch>
            <input
              type="checkbox"
              id="exquisiteness_switch"
              className="switch"
              checked={userOptions.exquisiteness}
              onChange={(e) => {
                dispatch(valueChange(["exquisiteness", e.target.checked]));
              }}
            />
            <label htmlFor="exquisiteness_switch"></label>
          </OptionSwitch>
        </div>
        <div className="w-full flex justify-between">
          <span className="font-bold text-lg text-black">음력</span>
          <OptionSwitch>
            <input
              type="checkbox"
              id="lunar_switch"
              className="switch"
              checked={userOptions.lunar}
              onChange={(e) => {
                dispatch(valueChange(["lunar", e.target.checked]));
              }}
            />
            <label htmlFor="lunar_switch"></label>
          </OptionSwitch>
        </div>
      </div>
    </div>
  );
}
