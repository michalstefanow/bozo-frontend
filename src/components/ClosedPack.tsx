import Image from "next/image";
import { motion } from "framer-motion";
import { MouseEventHandler } from "react";
import clsx from "clsx";

import { pangolin } from "@/fonts/fonts";
import open from "../../public/open.png";
import hand from "../../public/hand.png";

interface ClosedPackProps {
  onOpenPack: MouseEventHandler<HTMLImageElement>;
}

const ClosedPack = ({ onOpenPack }: ClosedPackProps) => {
  return (
    <div className="relative z-30 w-full h-full flex flex-col justify-center items-center p-4">
      <motion.div
        initial={{ scale: 0.6, rotate: "-45deg" }}
        animate={{ scale: 1, rotate: "0deg" }}
        transition={{ duration: 0.3 }}
        className="w-24 md:w-32 lg:w-36 relative flex-grow"
      >
        <Image
          src={"/open.png"}
          fill
          alt="open"
          role="button"
          className="object-contain"
          onClick={onOpenPack}
        />
      </motion.div>

      <Image
        src={hand}
        alt="hand"
        role="button"
        onClick={onOpenPack}
        className="absolute mt-16 ml-16 animate-rotate w-22 h-22 object-contain"
      />

      <div
        className={clsx(
          "text-3xl text-white",
          "bg-[url('/open_background.png')] bg-contain bg-no-repeat w-[300px] h-[100px]",
          "flex justify-center items-center",
          "bottom-5",
          pangolin.className
        )}
        role="button"
        onClick={onOpenPack}
      >
        Open The Pack!
      </div>

      <Image
        src={"/patterns.png"}
        alt="pattern"
        width={400}
        height={400}
        className="animate-blink w-[40em] absolute -z-10"
      />
    </div>
  );
};

export default ClosedPack;
