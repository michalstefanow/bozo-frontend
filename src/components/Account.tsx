import { getBitCoinBalance, getBozoBalance } from "@/api/api";
import { useAppState, useSetAppState } from "@/contexts/AppState";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { BsClipboard2 } from "react-icons/bs";
import { FaBitcoin } from "react-icons/fa6";
import { WiTime9 } from "react-icons/wi";

const truncate = (str: string, len = 3) => {
  return `${str.slice(0, len)}...${str.slice(str.length - len)}`;
};

interface AccountProps {
  onLogout: Function;
}

const Account = ({ onLogout }: AccountProps) => {
  const [showDropDown, setshowDropDown] = useState<boolean>(false);
  const { ordinalsAddress, paymentAddress } = useAppState();
  const {
    setStacksPublicKey,
    setStacksAddress,
    setNetwork,
    setOrdinalsAddress,
    setOrdinalsPublicKey,
    setPaymentAddress,
    setPaymentPublicKey,
  } = useSetAppState();

  const { data: bitCoinBalance, isLoading: isBitCoinBalanceLoading } = useQuery(
    {
      queryKey: ["bitcoin-balance"],
      queryFn: () => getBitCoinBalance(ordinalsAddress),
    }
  );

  const { data: bozoBalance, isLoading: isBozoBalanceLoading } = useQuery({
    queryKey: ["bozo-balance"],
    queryFn: () => getBozoBalance(ordinalsAddress),
  });

  useEffect(() => {
    getBozoBalance(paymentAddress);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const logout = () => {
    setNetwork(undefined);
    setStacksAddress(undefined);
    setOrdinalsAddress(undefined);
    setPaymentPublicKey(undefined);
    setPaymentAddress(undefined);
    setOrdinalsPublicKey(undefined);
    setStacksPublicKey(undefined);
    onLogout();
  };

  return (
    <div className="absolute top-10 right-10 flex flex-col items-end">
      <button
        id="dropdownDividerButton"
        data-dropdown-toggle="dropdownDivider"
        className={clsx(
          "text-white bg-cyan-800 hover:bg-blue-800",
          "focus:ring-4 focus:outline-none focus:ring-blue-300",
          "font-medium rounded-lg text-sm px-5 py-2.5 text-center",
          "inline-flex items-center max-w-fit"
        )}
        onClick={() => setshowDropDown((prev) => !prev)}
        type="button"
      >
        <p className="">{truncate(ordinalsAddress)}</p>
        <svg
          className="w-2.5 h-2.5 ms-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      <div
        id="dropdownDivider"
        className={clsx(
          "z-10 mt-2 transition-all duration-300 bg-white divide-y ",
          "divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600",
          "p-2 pb-1 transition-all duration-200",
          {
            hidden: !showDropDown,
          }
        )}
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200 gap-2 flex flex-col"
          aria-labelledby="dropdownDividerButton"
        >
          <li className="flex justify-center divide-x divide-gray-600 border-b border-b-gray-600">
            <div className="px-4 pb-2">
              <p className="text-lg font-bold">Payment</p>
              <div className="flex items-center gap-2">
                <p>{truncate(paymentAddress, 6)}</p>
                <BsClipboard2
                  className="hover:scale-125 transition-all duration-200"
                  role="button"
                  onClick={() => copyToClipboard(paymentAddress)}
                />
              </div>
            </div>

            <div className="px-4">
              <p className="text-lg font-bold">Ordinals</p>
              <div className="flex items-center gap-2">
                <p>{truncate(ordinalsAddress, 6)}</p>
                <BsClipboard2
                  className="hover:scale-125 transition-all duration-200"
                  role="button"
                  onClick={() => copyToClipboard(ordinalsAddress)}
                />
              </div>
            </div>
          </li>
          <li
            role="button"
            className="flex items-center gap-2 hover:bg-black/10 p-2 rounded transition-all duration-200"
          >
            <FaBitcoin className="text-amber-400 w-7 h-7" />
            <div className={`${isBitCoinBalanceLoading && "animate-pulse"}`}>
              <p className="text-md font-bold">Bitcoin Balance</p>
              <p className="text-md font-extralight">
                {isBitCoinBalanceLoading
                  ? "Loading.."
                  : `${bitCoinBalance[ordinalsAddress].final_balance} BTC`}
              </p>
            </div>
          </li>
          <li
            role="button"
            className="flex items-center gap-2 hover:bg-black/10 p-2 rounded transition-all duration-200"
          >
            <WiTime9 className="w-7 h-7" />
            <div className={`${isBozoBalanceLoading && "animate-pulse"}`}>
              <p className="text-md font-bold">Bozo Balance</p>
              <p className="text-md font-extralight">
                {isBozoBalanceLoading ? "Loading..." : 0} BTC
              </p>
            </div>
          </li>
        </ul>
        <div className="p-2">
          <a
            href="#"
            role="button"
            onClick={logout}
            className="block p-4 hover:bg-black/10 text-white font-bold rounded transition-all duration-200"
          >
            Logout
          </a>
        </div>
      </div>
    </div>
  );
};

export default Account;
