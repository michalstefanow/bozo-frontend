import clsx from "clsx";

import { pangolin } from "@/fonts/fonts";

const GetFortuneLoader = ({ time }: { time: string }) => {
  return (
    <div className="absolute z-20 w-full h-full">
      <div className="relative h-full w-full ">
      <video src="./Composicao_xl.mp4" autoPlay={true} loop className="w-full h-full object-cover"/>
        <div
          className={clsx(
            "h-32 w-full bg-gradient-to-t from-purple-700",
            "absolute bottom-0 text-white text-3xl justify-center flex items-end py-2",
            pangolin.className
          )}
        >
          <span className="ml-20">Time Left {time}</span>
        </div>
      </div>
    </div>
  );
};

export default GetFortuneLoader;
