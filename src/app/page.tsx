"use client";
import Background from "@/components/background";
import { FloatingNavBar } from "@/components/navbar";
import { homePageText } from "@/constants/constants";
import { Oxanium } from "next/font/google";
import { ReactTyped } from "react-typed";
import { useState } from "react";
import LoginForm from "@/components/login_form";
import { AnimatePresence, motion } from "framer-motion";

const oxanium = Oxanium({
  subsets: ["latin"],
});

export default function Home() {
  const [showForm, setShowForm] = useState<boolean>(false);

  const changeState = () => {
    setShowForm(!showForm);
  };

  return (
    <>
      <Background />
      <FloatingNavBar setShowForm={changeState} />
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex justify-end items-center min-h-screen px-8 z-10"
          >
            {showLoginForm()}
          </motion.div>
        ) : (
          <motion.div
            key="text"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center w-full h-screen text-white relative z-10"
          >
            {showTextTyping()}
          </motion.div>
        )}
      </AnimatePresence>

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

function showLoginForm() {
  return (
    <div className="flex justify-end items-center min-h-screen px-8 z-10">
      <div className="w-[400px] max-w-md z-10">
        <LoginForm />
      </div>
    </div>
  );
}

function showTextTyping() {
  return (
    <div className="flex items-center justify-center w-full h-screen text-white relative z-10">
      <div
        className={`text-center w-[840px] h-[200px] max-h-[200px] font-bold p-6 text-[20px] sm:text-[30px] relative top-10`}
      >
        <motion.div
          key="typed-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ReactTyped
            strings={[...homePageText]}
            typeSpeed={40}
            backSpeed={40}
            loop
          />
        </motion.div>
      </div>
    </div>
  );
}
