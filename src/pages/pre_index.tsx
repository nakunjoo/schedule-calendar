import React, { useState, useEffect } from "react";

import Register from "@/components/RegisterModal";
import { preventScroll, allowScroll } from "@/utils/scrollEvent";

export default function Home() {
  const [registerOpen, setRegisterOpen] = useState<boolean>(false);

  useEffect(() => {
    if (registerOpen) {
      preventScroll();
    } else {
      allowScroll();
    }
  }, [registerOpen]);

  return (
    <div className="w-full h-[100vh] bg-[#eedeff]">
      <div className="container mx-auto flex items-center justify-center h-full">
        <div className="w-[640px] text-center">
          <h2 className="text-3xl font-bold mb-2">My Calendar</h2>
          <div className="w-full border border-black border-solid rounded p-8 bg-white">
            <div className="w-[300px] mx-auto">
              {/* id */}
              <div className="w-full flex justify-start items-center my-5">
                <label className="w-[50px] mr-2 text-xl" htmlFor="login-id">
                  ID:
                </label>
                <input
                  className="w-[240px] p-2 border border-black border-solid rounded text-base"
                  type="text"
                />
              </div>
              {/* pw */}
              <div className="w-full flex justify-start items-center">
                <label className="w-[50px] mr-2 text-xl" htmlFor="login-id">
                  PW:
                </label>
                <input
                  className="w-[240px] p-2 border border-black border-solid rounded text-base"
                  type="password"
                />
              </div>
              {/*  */}
              <ul className="w-full flex justify-around text-gray-500 my-8">
                <li
                  className="cursor-pointer"
                  onClick={() => {
                    setRegisterOpen(true);
                  }}
                >
                  회원가입
                </li>
              </ul>
              <div className="w-full bg-[#aa5fd3] p-3 text-white rounded text-lg font-bold cursor-pointer">
                로그인
              </div>
            </div>
          </div>
        </div>
      </div>
      {registerOpen ? <Register setRegisterOpen={setRegisterOpen} /> : <></>}
    </div>
  );
}
