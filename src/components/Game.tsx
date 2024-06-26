import { useState } from "react";
import Image from "next/image";

import Intro from "./Intro";
import Fortune from "./Fortune";
import Account from "./Account";

const Game = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  return (
    <div className="h-screen relative">
      <Image
        src="/Background.png"
        fill
        alt="background"
        className="-z-10 object-cover"
      />
      {!isConnected ? <Intro onStart={() => setIsConnected(true)} /> : <Fortune />}
      {isConnected && <Account onLogout={() => setIsConnected(false)} />}
    </div>
  );
};

export default Game;
