"use client";
import Background from "@/components/background";
import { FloatingNavBar } from "@/components/navbar";
import { homePageText } from "@/constants/constants";
import { Oxanium } from "next/font/google";
import { ReactTyped } from "react-typed";

const oxanium = Oxanium({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Background />
      <FloatingNavBar />
      <div className="flex items-center justify-center w-full h-screen text-white relative z-10 ">
        <div
          className={`text-center w-[840px] h-[200px] max-h-[200px] font-bold p-6 text-[20px] sm:text-[30px] relative top-10`}
        >
          <ReactTyped
            startWhenVisible
            strings={[...homePageText]}
            typeSpeed={40}
            backSpeed={40}
            loop
          />
        </div>
      </div>

      <div
        className={`fixed inset-x-0 bottom-1.5 flex justify-center p-4 text-white  ${oxanium.className}`}
      >
        <p className="text-[15px]">
          &copy; {new Date().getFullYear()} Acti
          <span className=" text-orange-600 font-bold">Track</span>. All rights
          reserved.
        </p>
      </div>
    </>
  );
}
