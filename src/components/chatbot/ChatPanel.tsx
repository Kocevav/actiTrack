import { useEffect, useState } from "react";

export default function ChatPanel() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`
        fixed bottom-20 right-4
        h-96 w-80
        flex flex-col justify-between
        border border-gray-300
        rounded-lg
        shadow-xl
        transition-all duration-300 
        ${
          isVisible ? `opacity-100 translate-y-0` : "opacity-0 translate-y-4"
        } `}
    >
        <div className="  flex justify-between items-center p-3">
            <div className="flex bg-yellow-500 items-center gap-2">
                <div>🤖</div>
                <span>ActiTrackAI</span>
            </div>

            <div className=" ">
               <button>X</button>
            </div>
        </div>

        <div className="border-white border-2 flex justify-between">
            <input className="border-white border-2" type="text" />
            <button>Send</button>
        </div>
    </div>
  );
}
