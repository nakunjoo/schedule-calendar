"use client";
import React, { useState, useEffect } from "react";
import { OptionState } from "@/stores/slices/option-slices";
import { Icon } from "@iconify/react";
import { ChromePicker } from "react-color";

export default function CategoryModal({
  categoryOpen,
  setCategoryOpen,
  userOptions,
  complate,
}: {
  categoryOpen: string;
  setCategoryOpen: React.Dispatch<React.SetStateAction<string>>;
  userOptions: OptionState;
  complate: any;
}) {
  const [pickerOpen, setPickerOpen] = useState<boolean>(false);
  const [categoryColor, setCategoryColor] = useState<string>("#ffffff");
  const [categoryName, setCategoryName] = useState<string>("");
  return (
    <div>
      <div
        className="w-full h-full absolute top-0 left-0 bg-black/30"
        onClick={() => {
          setCategoryOpen("");
        }}
      ></div>
      <div className="sm:w-[540px] w-[90%] border border-black border-solid rounded-lg p-4 absolute top-[300px]  left-1/2 -translate-x-1/2 bg-white">
        <div className="w-full">
          <div
            className="absolute top-5 right-5 cursor-pointer"
            onClick={() => {
              setCategoryOpen("");
            }}
          >
            <Icon
              className="w-10 h-10"
              icon="mdi:close-outline"
              style={{ color: userOptions.themeColor }}
            />
          </div>
          <h3 className="text-2xl font-bold">
            카테고리 {categoryOpen === "add" ? "추가" : "수정"}
          </h3>
          <div className="w-full flex justify-between mt-12 text-center">
            <div className="w-[340px] flex justify-around text-center">
              <span className="text-lg mr-2">이름: </span>
              <input
                className="w-[270px] border border-black border-solid p-2 rounded text-base"
                type="text"
                placeholder="카테고리명을 입력하세요."
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                }}
              />
            </div>
            <div className="w-[180px] flex justify-around text-center">
              <span className="text-lg mr-2 ">색상: </span>
              <div
                className={`w-28 h-10 border border-black border-solid rounded-sm cursor-pointer relative inline-block`}
                style={{ backgroundColor: categoryColor }}
                onClick={() => {
                  setPickerOpen(!pickerOpen);
                }}
              >
                {pickerOpen ? (
                  <div
                    className="w-60 absolute top-10 -right-3 z-30 bg-white border-black border border-solid rounded-md"
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    <ChromePicker
                      className="mx-auto mt-2 cursor-pointer"
                      color={categoryColor}
                      onChange={(e) => {
                        setCategoryColor(e.hex);
                      }}
                    />
                    <ul className="p-2 flex justify-end text-center cursor-default">
                      <li
                        className="p-2 border border-solid border-black rounded cursor-pointer"
                        onClick={() => {
                          setPickerOpen(false);
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
          </div>
          <div className="w-full text-right mt-6">
            <span
              className=" p-3 text-white rounded-md insline-block cursor-pointer"
              style={{ backgroundColor: userOptions.themeColor }}
              onClick={() => {
                complate(categoryName, categoryColor);
                setCategoryOpen("");
              }}
            >
              {categoryOpen === "add" ? "추가" : "수정"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
