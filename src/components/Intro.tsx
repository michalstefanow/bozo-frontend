"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import {
  AddressPurpose,
  BitcoinNetworkType,
  Capability,
  getCapabilities,
  request,
} from "sats-connect";
import { useMutation } from "@tanstack/react-query";

import { pangolin } from "@/fonts/fonts";
import Loader from "@/components/Loader";

import connectBtn from "../../public/Connect_Button.png";
import logo from "../../public/logo.png";
import { useAppState, useSetAppState } from "@/contexts/AppState";

interface IntroProps {
  onStart: Function;
}

const Intro = ({ onStart }: IntroProps) => {
  const {
    paymentAddress,
    paymentPublicKey,
    ordinalsAddress,
    ordinalsPublicKey,
    stacksAddress,
    network,
  } = useAppState();

  const {
    setPaymentAddress,
    setPaymentPublicKey,
    setOrdinalsAddress,
    setOrdinalsPublicKey,
    setStacksAddress,
    setStacksPublicKey,
  } = useSetAppState();

  const [capabilityState, setCapabilityState] = useState<
    "loading" | "loaded" | "missing" | "cancelled"
  >("loading");
  const [capabilities, setCapabilities] = useState<Set<Capability>>();

  const { mutate } = useMutation({
    mutationFn: () =>
      getCapabilities({
        onFinish(response) {
          setCapabilities(new Set(response));
          setCapabilityState("loaded");
        },
        onCancel() {
          setCapabilityState("cancelled");
        },
        payload: {
          network: {
            type: network,
          },
        },
      }),
    onError: () => setCapabilityState("missing"),
  });

  const { mutate: mutateGetAccounts, isPending } = useMutation({
    mutationFn: () =>
      request("getAccounts", {
        purposes: [
          AddressPurpose.Ordinals,
          AddressPurpose.Payment,
          AddressPurpose.Stacks,
        ],
        message: "Bozo Advise",
      }),
    onSuccess: (response: any) => {
      const paymentAddressItem = response.result.find(
        (address: { purpose: AddressPurpose }) =>
          address.purpose === AddressPurpose.Payment
      );
      setPaymentAddress(paymentAddressItem?.address);
      setPaymentPublicKey(paymentAddressItem?.publicKey);

      const ordinalsAddressItem = response.result.find(
        (address: { purpose: AddressPurpose }) =>
          address.purpose === AddressPurpose.Ordinals
      );
      setOrdinalsAddress(ordinalsAddressItem?.address);
      setOrdinalsPublicKey(ordinalsAddressItem?.publicKey);

      const stacksAddressItem = response.result.find(
        (address: { purpose: AddressPurpose }) =>
          address.purpose === AddressPurpose.Stacks
      );
      setStacksAddress(stacksAddressItem?.address);
      setStacksPublicKey(stacksAddressItem?.publicKey);
      onStart();
    },
    onError: (err) => console.log(err),
  });

  useEffect(() => mutate(), [mutate]);

  const capabilityMessage =
    capabilityState === "loading"
      ? "Checking capabilities..."
      : capabilityState === "cancelled"
      ? "Capability check cancelled by wallet. Please refresh the page and try again."
      : capabilityState === "missing"
      ? "Could not find an installed Sats Connect capable wallet. Please install a wallet and try again."
      : !capabilities
      ? "Something went wrong with getting capabilities"
      : undefined;

  const connect = async () => {
    const isReady =
      !!paymentAddress &&
      !!paymentPublicKey &&
      !!ordinalsAddress &&
      !!ordinalsPublicKey &&
      !!stacksAddress;

    if (isPending || capabilityState === "missing") {
      return;
    }
    mutateGetAccounts();
  };

  return (
    <>
      <div
        className={clsx(
          "h-full w-full py-20 px-4",
          "bg-[url('/background_overlay.png')] backdrop-blur-md",
          "flex flex-col items-center justify-between"
        )}
      >
        <Image
          src={logo}
          alt="connect_button"
          className="max-w-[25rem] w-full object-contain"
        />
        <div className="relative">
          <Image
            src={connectBtn}
            alt="connect_button"
            role={isPending || capabilityState === "missing" ? "" : "button"}
            className={clsx("max-w-[30em] w-full", {
              "opacity-60": isPending || capabilityState === "missing",
            })}
            onClick={connect}
            priority
          />

          {isPending && (
            <div className="absolute flex justify-center items-center w-full h-full top-0">
              <Loader />
            </div>
          )}
        </div>

        <p
          className={clsx(
            "text-lg text-center text-amber-400 max-w-4xl p-0",
            pangolin.className
          )}
        >
          {capabilityMessage}
        </p>
        <p
          className={clsx(
            "sm:text-md md:text-lg lg:text-xl xl:text-2xl max-w-5xl text-center text-white",
            pangolin.className
          )}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum
          suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan
          lacus vel facilisis.
        </p>
      </div>
    </>
  );
};

export default Intro;
