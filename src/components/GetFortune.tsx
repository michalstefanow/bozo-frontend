import clsx from "clsx";
import Image from "next/image";

import { pangolin } from "@/fonts/fonts";

interface GetFortuneProps {
  amount: number;
  setAmount: Function;
}

const GetFortune = ({ amount, setAmount }: GetFortuneProps) => {
  return (
    <div className="flex flex-col items-center justify-center mb-[-1em] z-10">
      <div
        className={clsx(
          "relative w-full h-10 md:h-12 lg:h-14 xl:h-16",
          "flex justify-center",
          "mb-0 md:mb-2 lg:mb-4 xl:mb-5"
        )}
      >
        <Image
          src={"/get_fortune.png"}
          alt="text"
          fill
          className="w-full h-auto object-contain"
          sizes="(max-width: 768px) 256px, 320px"
        />
      </div>

      <div className="relative w-60 h-52 md:w-64 md:h-52 lg:w-80 lg:h-64 xl:w-96 xl:h-80">
        <Image
          src={"/book_illus.png"}
          alt="book_illus"
          priority
          className="object-contain"
          fill
          sizes="(max-width: 768px) 256px, 320px"
        />
        <div
          className={clsx(
            "absolute top-0 sm:mt-[-1.25em] md:mt-[-1.5em] lg:mt-[-1.75em] xl:mt-[-2em] h-full w-full",
            "flex justify-between items-center px-12 lg:px-16 gap-4"
          )}
        >
          <Image
            src={"/minus.png"}
            alt="minus"
            width={40}
            height={40}
            role="button"
            className={clsx(
              "h-8 md:h-10 lg:h-12 xl:h-14",
              "w-8 md:h-10 lg:w-12 xl:w-14",
              "object-contain"
            )}
            onClick={() => setAmount((prev: number) => Math.max(prev - 1, 0))}
          />
          <p
            className={clsx(
              "text-4xl md:text-5xl lg:text-6xl xl:text-7xl",
              pangolin.className
            )}
          >
            {amount}
          </p>
          <Image
            src={"/plus.png"}
            alt="plus"
            width={40}
            height={40}
            role="button"
            className={clsx(
              "h-8 md:h-10 lg:h-12 xl:h-14",
              "w-8 md:h-10 lg:w-12 xl:w-14",
              "object-contain"
            )}
            onClick={() => setAmount((prev: number) => Math.min(prev + 1, 3))}
          />
        </div>
      </div>
    </div>
  );
};

export default GetFortune;
