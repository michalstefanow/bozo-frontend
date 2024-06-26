import { MouseEventHandler, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Slider from "react-slick";
import clsx from "clsx";
import { motion } from "framer-motion";

import { pangolin } from "@/fonts/fonts";

import leftMargin from "../../public/scroll_open_l.png";
import rightMargin from "../../public/scroll_open_r.png";
import tarotCards from "../../public/Tarot_cards.png";
import magicCrystalBall from "../../public/Magic_crystall_ball.png";
import back from "../../public/Back_button.png";
import CardDetail from "./CardDetail";

export interface Card {
  card_description: string;
  card_id: string;
  card_name: string;
  card_rarity: string;
  card_url: string;
}

interface PackProps {
  cards: Card[];
  isOpened: boolean;
  onGetMoreCard: MouseEventHandler<HTMLButtonElement>;
}

function getGroupCards(cards: Card[]) {
  const groupedCards: Card[][] = [];
  for (let index = 0; index < cards.length; index++) {
    const card = cards[index];
    if (index % 14 === 0) {
      groupedCards.push([]);
    }
    groupedCards[groupedCards.length - 1].push(card);
  }
  return groupedCards;
}

const Pack = ({ cards, onGetMoreCard, isOpened }: PackProps) => {
  let sliderRef = useRef<any>(null);
  const [slideIndex, setSlideIndex] = useState<number>(0);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [animationFinished, setAnimationFinished] = useState<boolean>(false);

  const onBack = (e: any) => {
    setSelectedCard(null);
    if (isOpened) {
      onGetMoreCard(e);
    }
  };

  const groupedCards = getGroupCards(cards);

  useEffect(() => {
    setTimeout(() => setAnimationFinished(true), 500);
  }, []);
  console.log(groupedCards);

  return (
    <div className="h-full flex justify-center items-center sm:p-5 md:p-10">
      <motion.div
        initial={{ width: "10%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.5 }}
        className="relative h-full bg-[url('/paper_pop_up.png')] bg-stretch bg-center bg-no-repeat"
      >
        <Image
          src={leftMargin}
          alt="paper_pop_up.png"
          className="w-auto h-full z-20 top-0 absolute sm:-ml-4 md:-ml-2"
        />

        <Image
          src={rightMargin}
          alt="paper_pop_up.png"
          className="w-auto h-full z-20 top-0 absolute right-0 sm:-mr-4s"
        />

        {animationFinished && (
          <div className="absolute h-full w-full px-28 sm:px-22 md:px-24 lg:px-32 xl:px-48 py-20 top-0">
            {(selectedCard || isOpened) && (
              <div className="absolute z-30 top-20 left-30 lg:top-14 xl:left-24">
                <Image
                  src={back}
                  alt="back"
                  className="w-10 md:w-12 lg:w-16 h-auto"
                  role="button"
                  onClick={onBack}
                />
              </div>
            )}

            <div className="w-full h-full flex flex-col justify-around gap-6 overflow-y-auto">
              {selectedCard === null && (
                <Slider
                  ref={sliderRef}
                  dots={false}
                  speed={500}
                  arrows={false}
                  slidesToShow={1}
                  slidesToScroll={1}
                  adaptiveHeight={true}
                  className="w-full flex-grow"
                >
                  {groupedCards.map((_cards, key) => {
                    return (
                      <div className="h-full w-full" key={key}>
                        <div className="h-full w-full grid gap-4 grid-rows-2 grid-cols-7">
                          {_cards.map((card, idx) => (
                            <div
                              key={card.card_id + ":" + key + ":" + idx}
                              className="relative rounded-md overflow-hidden"
                              role="button"
                            >
                              <Image
                                src={card.card_url}
                                alt={card.card_url}
                                fill
                                className="object-cover"
                                onClick={() => setSelectedCard(card)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              )}

              {selectedCard && <CardDetail card={selectedCard} />}

              <div className="w-full">
                {/* small width pagination */}
                {selectedCard === null && (
                  <div className="sm:block md:hidden mb-2">
                    <div className="flex justify-center items-center gap-4">
                      {groupedCards.map((num, key) => {
                        return (
                          <div
                            key={key}
                            className={clsx(
                              "w-7 h-7",
                              "text-md text-center rounded-full",
                              "flex justify-center items-center border border-black",
                              "transition-all duration-300",
                              {
                                "bg-black/15": slideIndex === key,
                              }
                            )}
                            role="button"
                            onClick={() => {
                              sliderRef.current.slickGoTo(key);
                              setSlideIndex(key);
                            }}
                          >
                            {key + 1}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-center mt-2">
                      Open Card to see details!
                    </p>
                  </div>
                )}

                <div
                  className={clsx(
                    "flex justify-center md:justify-between gap-4 items-center flex-wrap",
                    pangolin.className
                  )}
                >
                  <div className="flex gap-2 lg:gap-6">
                    <Image
                      src={magicCrystalBall}
                      alt="paper_pop_up.png"
                      className="w-8 lg:w-10 xl:w-16 object-contain h-auto"
                    />
                    <button
                      className="xl:p-4 px-3 xl:px-6 sm:text-sm md:text-md xl:text-2xl bg-black/5 rounded-2xl hover:bg-black/10 hover:scale-105 transition-all duration-300"
                      type="button"
                      onClick={onGetMoreCard}
                    >
                      Get More Card
                    </button>
                  </div>

                  {selectedCard === null && (
                    <div className="hidden md:block">
                      <div className="flex justify-center items-center gap-2">
                        {groupedCards.map((num, key) => {
                          return (
                            <div
                              key={key}
                              className={clsx(
                                "md:w-7 md:h-7 xl:w-10 xl:h-10",
                                "md:text-lg xl:text-2xl text-center rounded-full",
                                "flex justify-center items-center border border-black",
                                "transition-all duration-300",
                                {
                                  "bg-black/15": slideIndex === key,
                                }
                              )}
                              role="button"
                              onClick={() => {
                                sliderRef.current.slickGoTo(key);
                                setSlideIndex(key);
                              }}
                            >
                              {key + 1}
                            </div>
                          );
                        })}
                      </div>
                      <p className="md:text-sm xl:text-lg mt-4">
                        Open Card to see details!
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2 md:gap-4 lg:gap-6">
                    <Image
                      src={tarotCards}
                      alt="paper_pop_up.png"
                      className="w-8 lg:w-10 xl:w-16 object-contain h-auto"
                    />
                    <button
                      className="xl:p-4 px-3 xl:px-6 sm:text-sm md:text-md xl:text-2xl bg-black/5 rounded-2xl hover:bg-black/10 hover:scale-105 transition-all duration-300"
                      type="button"
                    >
                      All Fortune Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Pack;
