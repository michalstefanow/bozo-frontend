import useLocalStorage from "@/hooks/LocalStorage";
import React, { ReactNode, createContext, useContext } from "react";
import { BitcoinNetworkType } from "sats-connect";

export interface AppState {
  paymentAddress: string;
  paymentPublicKey: string;
  ordinalsAddress: string;
  ordinalsPublicKey: string;
  stacksAddress: string;
  stacksPublicKey: string;
  network: BitcoinNetworkType;
}

export interface SetAppState {
  setPaymentAddress: Function;
  setPaymentPublicKey: Function;
  setOrdinalsAddress: Function;
  setOrdinalsPublicKey: Function;
  setStacksAddress: Function;
  setStacksPublicKey: Function;
  setNetwork: Function;
}

const AppStateContext = createContext<AppState>({
  paymentAddress: "",
  paymentPublicKey: "",
  ordinalsAddress: "",
  ordinalsPublicKey: "",
  stacksAddress: "",
  stacksPublicKey: "",
  network: BitcoinNetworkType.Mainnet,
});

const SetAppSateContext = createContext<SetAppState>({
  setPaymentAddress: () => {},
  setPaymentPublicKey: () => {},
  setOrdinalsAddress: () => {},
  setOrdinalsPublicKey: () => {},
  setStacksAddress: () => {},
  setStacksPublicKey: () => {},
  setNetwork: () => {},
});

export const useAppState = () => {
  return useContext(AppStateContext);
};

export const useSetAppState = () => {
  return useContext(SetAppSateContext);
};

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [paymentAddress, setPaymentAddress] = useLocalStorage("paymentAddress");
  const [paymentPublicKey, setPaymentPublicKey] =
    useLocalStorage("paymentPublicKey");
  const [ordinalsAddress, setOrdinalsAddress] =
    useLocalStorage("ordinalsAddress");
  const [ordinalsPublicKey, setOrdinalsPublicKey] =
    useLocalStorage("ordinalsPublicKey");
  const [stacksAddress, setStacksAddress] = useLocalStorage("stacksAddress");
  const [stacksPublicKey, setStacksPublicKey] =
    useLocalStorage("stacksPublicKey");
  const [network, setNetwork] = useLocalStorage(
    "network",
    BitcoinNetworkType.Mainnet
  );

  const appState = {
    paymentAddress,
    paymentPublicKey,
    ordinalsAddress,
    ordinalsPublicKey,
    stacksAddress,
    stacksPublicKey,
    network,
  };

  const setAppState = {
    setPaymentAddress,
    setPaymentPublicKey,
    setOrdinalsAddress,
    setOrdinalsPublicKey,
    setStacksAddress,
    setStacksPublicKey,
    setNetwork,
  };

  return (
    <AppStateContext.Provider value={appState}>
      <SetAppSateContext.Provider value={setAppState}>
        {children}
      </SetAppSateContext.Provider>
    </AppStateContext.Provider>
  );
};
