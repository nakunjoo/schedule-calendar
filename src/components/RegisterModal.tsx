import React, { useState } from "react";

export default function Register({
  setRegisterOpen,
}: {
  setRegisterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="w-full h-full">
      <div
        className="w-full h-full absolute top-0 left-0 bg-black/30 z-30"
        onClick={() => {
          setRegisterOpen(false);
        }}
      ></div>
      <div className="w-[640px] py-12 px-4 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 border border-black border-solid rounded bg-white z-40">
        <div className="w-[90%] text-center mx-auto">
          <h2 className="text-3xl font-bold mb-10">회원가입</h2>
          <div className="flex justify-between items-center mb-8">
            <p className="w-[30%] text-xl font-bold">아이디:</p>
            <div className="w-[65%] flex justify-between">
              <input
                className="w-[70%] border border-black border-solid rounded p-2 text-base"
                type="text"
              />
              <div className="w-[25%] bg-[#aa5fd3] text-white p-2 text-base rounded cursor-pointer">
                중복확인
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-8">
            <p className="w-[30%] text-xl font-bold">비밀번호:</p>
            <input
              className="w-[65%] border border-black border-solid rounded p-2 text-base"
              type="password"
            />
          </div>
          <div className="flex justify-between items-center mb-8">
            <p className="w-[30%] text-xl font-bold">비밀번호확인:</p>
            <input
              className="w-[65%] border border-black border-solid rounded p-2 text-base"
              type="password"
            />
          </div>
          <div className="w-full bg-[#aa5fd3] p-3 text-white rounded text-lg font-bold cursor-pointer">
            회원가입
          </div>
        </div>
      </div>
    </div>
  );
}
