import { MouseEventHandler, useState } from "react";
import clsx from "clsx";

import Pack from "./Pack";
import ClosedPack from "./ClosedPack";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCards } from "@/api/api";
import { useAppState } from "@/contexts/AppState";

interface OpenPackProps {
  isOpened: boolean;
  onHide: MouseEventHandler<HTMLButtonElement>;
}

const OpenPack = ({ onHide, isOpened }: OpenPackProps) => {
  const { ordinalsAddress } = useAppState();
  const [isPackShown, setIsPackShown] = useState<boolean>(false);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["cards"],
    queryFn: () => fetchCards(ordinalsAddress),
  });

  const onOpenPack = () => {
    if (isLoading || isError) {
      return;
    }
    setIsPackShown(true);
  };

  const isPack = isOpened || isPackShown;

  if (isError) {
    alert("error occured");
  }

  return (
    <div
      className={clsx(
        "w-full h-full absolute top-0 z-30 bg-[url('/background_overlay.png')] backdrop-blur-md transition-all duration-500",
        "flex flex-col justify-center items-center"
      )}
    >
      <div className="h-full w-full">
        {isPack && (
          <Pack cards={data} onGetMoreCard={onHide} isOpened={isOpened} />
        )}
        {!isPack && <ClosedPack onOpenPack={onOpenPack} />}
      </div>
    </div>
  );
};

export default OpenPack;
