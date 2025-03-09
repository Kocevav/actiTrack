// Import the Background component and NavbarDemo component
import Background from "@/components/background";
import { FloatingNavDemo } from "@/components/navbar";
import { Oxanium } from "next/font/google";

const oxanium = Oxanium({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <Background />
      <FloatingNavDemo />
      <div className="flex items-center justify-center w-full h-screen text-white relative z-10">
        <div className={`text-center w-[840px] font-bold p-6 `}>
          <p
            className={`drop-shadow-md text-[25px] text-custom-white ${oxanium.className}`}
          >
            Track and analyze your sports performance in real-time. Gain
            insights, visualize progress, and connect with fellow athletes.
            Elevate your game with ActiTrack!
          </p>
        </div>
      </div>
    </>
  );
}
