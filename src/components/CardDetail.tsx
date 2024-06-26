import { MouseEventHandler } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";

import { pangolin } from "@/fonts/fonts";
import { Card } from "./Pack";

const CardDetail = ({ card }: { card: Card }) => {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full relative flex flex-col flex-grow"
    >
      <div
        className={clsx(
          "max-w-4xl mx-auto w-full flex-grow flex flex-col items-center gap-4 md:gap-8 lg:gap-16",
          pangolin.className
        )}
      >
        <div className="p-4 ml: rounded-full px-20 md:text-xl lg:text-2xl xl:text-3xl bg-black/5">
          Fortune Card Detail
        </div>
        <div className="flex w-full flex-col items-center md:items-start md:flex-row gap-2 md:gap-4 lg:gap-16 h-full">
          <div className="relative w-[40%] h-full rounded-md overflow-hidden">
            <Image
              src={card.card_url}
              alt="c3"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative w-full flex flex-col gap-2 md:gap-4 lg:gap-8">
            <div className="sm:text-lg md:text-xl lg:text-2xl xl:text-4xl rounded-lg bg-black/5 p-4">
              {card.card_name}
            </div>
            <div className="rounded-lg md:text-md lg:text-lg xl:text-xl bg-black/5 p-4 h-full">
              {card.card_description}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CardDetail;
