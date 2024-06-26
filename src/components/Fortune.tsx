"use client";

import { useState } from "react";
import clsx from "clsx";
import Image from "next/image";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { RpcErrorCode, request, signMessage } from "sats-connect";

import GetFortune from "./GetFortune";
import OpenPack from "./OpenPack";
import GetFortuneLoader from "./GetFortuneLoader";
import { useAppState, useSetAppState } from "@/contexts/AppState";
import { getNewCards, preTransfer, transfer } from "@/api/api";

import Wallet, {
  sendBtcTransaction,
  BitcoinNetworkType,
  signTransaction,
} from "sats-connect";
import type { Capability, SignTransactionOptions } from "sats-connect";
import * as Bitcoin from "bitcoinjs-lib";

const ADMIN_ADDRESS = "bc1p3qxj9zml54xc4xz7lzqujf4rd7v4jfwjzzxjqa6lerfhclrjj7fqg3kqtm";

const Fortune = () => {
  const {
    ordinalsAddress,
    paymentAddress,
    paymentPublicKey,
    ordinalsPublicKey,
    network
  } = useAppState();

  const [amount, setAmount] = useState<number>(0);
  const [showOpenPack, setShowOpenPack] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [time, setTime] = useState<number>(10);

  const { mutate: getNewCardsMutate } = useMutation({
    mutationFn: getNewCards,
    onError: (err) => console.log(err),
    onSuccess: (response) => console.log(response),
  });

  const signMsgFunc = async () => {
    try {

      const psbt = await preTransfer(
        paymentAddress,
        ordinalsAddress,
        paymentPublicKey,
        ordinalsPublicKey,
        amount * 1000,
        ADMIN_ADDRESS,
        "840000:158"
      );

      console.log("paymentAddress ==> ", paymentAddress);
      console.log("ordinalsAddress ==> ", ordinalsAddress);

      if(!psbt) return;

      const tempPsbt = Bitcoin.Psbt.fromBase64(psbt.psbtBase64);
      console.log("input Count ==> ", tempPsbt.inputCount);

      let signedPsbt;

      const inputArray: number[] = psbt.inputArray;
      const inputsToSign = [];

      for (let i = 0; i < inputArray.length; i++) {
        if (!inputArray[i])
          inputsToSign.push({
            address: ordinalsAddress,
            signingIndexes: [i],
          });
        else
          inputsToSign.push({
            address: paymentAddress,
            signingIndexes: [i],
          });
      }

      console.log("inputsToSign ==> ", inputsToSign);

      const signPsbtOptions: SignTransactionOptions = {
        payload: {
          network: {
            type: network,
          },
          message: "Sign Transaction",
          psbtBase64: psbt.psbtBase64,
          broadcast: false,
          inputsToSign,
        },
        onFinish: (response: any) => {
          console.log(response);
          signedPsbt = response.psbtBase64;
        },
        onCancel: () => alert("Canceled"),
      };

      await signTransaction(signPsbtOptions);
      console.log("result after signPsbt ==> ", signedPsbt);
      if(signedPsbt){
        const txIdPayload = await transfer(psbt.psbtHex, signedPsbt, tempPsbt.inputCount);
        console.log("txIdPayload ==> ", txIdPayload);
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  const { mutate: signMsgMutate } = useMutation({
    mutationFn: signMsgFunc,
    onError: (err) => console.log(err),
    onSuccess: (response) => {
      console.log(response);
      getNewCardsMutate({ amount, address: ordinalsAddress });
      openPack();
    },
  });

  const openPack = () => {
    setIsLoading(true);
    setIsOpened(false);
    let timer = setInterval(() => {
      setTime((time) => {
        if (time === 0) {
          setIsLoading(false);
          setShowOpenPack(true);
          setAmount(0);
          clearInterval(timer);
          return 0;
        } else return time - 1;
      });
    }, 1000);
  };

  const formatTime = (time: number) => {
    return `00:00:${time.toString().padStart(2, "0")}`;
  };

  // Controller
  // const generatePsbt = async (
  //   paymentAddress: string,
  //   ordinalAddress: string,
  //   paymentPublicKey: string,
  //   ordinalPublicKey: string,
  //   transferAmount: number,
  //   destinationAddress: string,
  //   runeId: string,
  // ) => {
  //   try {
  //     console.log("generatePsbt in controller ==> ");
  //     const response = await fetch(`/api/preTransfer`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         paymentAddress,
  //         ordinalAddress,
  //         paymentPublicKey,
  //         ordinalPublicKey,
  //         transferAmount,
  //         destinationAddress,
  //         runeId,
  //       }),
  //     });
  //     if (response.status == 200) {
  //       const data = await response.json();
  //       console.log("response in controller ==> ", data);
  //       return data;
  //     } else {
  //       return undefined;
  //     }
  //   } catch (error) {
  //     console.log("error ==> ", error);
  //   }
  // };

  return (
    <>
      {showOpenPack && (
        <OpenPack
          isOpened={isOpened}
          onHide={() => {
            setTime(10);
            setShowOpenPack(false);
          }}
        />
      )}

      {isLoading && <GetFortuneLoader time={formatTime(time)} />}

      <div className="w-full h-full flex justify-between items-end lg:p-14 p-2 md:p-4 relative">
        {!isLoading && (
          <>
            <div className="bg-[#ffffe3] border-4 border-black p-4 rounded-[1.5rem] lg:rounded-[2rem] w-24 h-24 lg:w-28 lg:h-28 ">
              <Image
                src={"/Tarot_cards.png"}
                alt="Tarot_cards"
                width={100}
                height={100}
                role="button"
                onClick={() => {
                  setIsOpened(true);
                  setShowOpenPack(true);
                }}
              />
            </div>
            <GetFortune amount={amount} setAmount={setAmount} />
          </>
        )}
      </div>
      {amount > 0 && !isLoading && (
        <div className="absolute w-full flex justify-center md:bottom-[21%]">
          <motion.div
            initial={{ scale: 0.85, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={"/play.png"}
              alt="play"
              width={200}
              height={200}
              role="button"
              className={clsx("object-contain w-32 ml-[4em]")}
              onClick={() => signMsgMutate()}
            />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Fortune;
