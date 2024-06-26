import { request } from "sats-connect";
import qs from "qs";
import axios from "axios";
import {
  Transaction,
  Psbt,
  address as Address,
  initEccLib,
  networks,
  Signer as BTCSigner,
  payments,
} from "bitcoinjs-lib";
import { ECPairFactory, ECPairAPI } from "ecpair";
import ecc from "@bitcoinerlab/secp256k1";
import { RuneId, Runestone, none } from "runelib";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";
const BASE_URL = "https://www.runewhisperers.xyz/api";
const OPENAPI_UNISAT_URL = "https://open-api.unisat.io";
const OPENAPI_URL = "https://api.unisat.io/wallet-v4";
const OPENAPI_UNISAT_TOKEN =
  "a53dccd53ffb70e9ee96d42242832135e7cce4a63db88d2cc9241ad03bf72904";

const HEADERS = {
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/json",
  "x-api-key": API_KEY,
};

enum METHOD {
  POST = "POST",
  GET = "GET",
}

initEccLib(ecc as any);
declare const window: any;
const ECPair: ECPairAPI = ECPairFactory(ecc);
// const network = networks.testnet;
const network = networks.bitcoin;
const networkType: string = "mainnet";

interface GetNewCardsBody {
  amount: number;
  address: string;
}

interface IRuneUtxo {
  txid: string;
  vout: number;
  value: number;
  scriptpubkey: string;
  amount: number;
  divisibility: number;
}

interface IUtxo {
  txid: string;
  vout: number;
  value: number;
  scriptpubkey?: string;
}

export const getBitCoinBalance = async (bitCoinAddress: string) => {
  const response = await fetch(
    `https://blockchain.info/balance?active=${bitCoinAddress}`
  );
  return response.json();
};

export const getBozoBalance = async (id: string) => {
  const response: any = await request("runes_getBalance", null);
  const balances = response.result.balances;
  return balances.length > 0 ? balances[0] : 0;
};

export const getNewCards = async (body: GetNewCardsBody) => {
  const response = await fetch(`${BASE_URL}/get_new_cards`, {
    method: METHOD.POST,
    headers: HEADERS,
    body: JSON.stringify(body),
  });

  return response.json();
};

export const fetchCards = async (ordinalsAddress: string) => {
  const response = await fetch(
    `${BASE_URL}/get_cardholdings/${ordinalsAddress}`,
    {
      method: METHOD.GET,
      headers: HEADERS,
    }
  );

  return await response.json();
};

export const preTransfer = async (
  paymentAddress: string,
  ordinalAddress: string,
  paymentPublicKey: string,
  ordinalPublicKey: string,
  transferAmount: number,
  destinationAddress: string,
  runeId: string
) => {
  try {
    console.log(ordinalAddress, transferAmount, destinationAddress);
    console.log("transferAmount ==> ", transferAmount);

    const inputArray = [];

    const runeUtxos = await getRuneUtxoByAddress(ordinalAddress, runeId);

    if (runeUtxos.tokenSum < transferAmount) {
      throw "Invalid amount";
    }

    console.log("runeUtxos ======>", runeUtxos.runeUtxos);

    const runeBlockNumber = parseInt(runeId.split(":")[0]);
    const runeTxout = parseInt(runeId.split(":")[1]);

    const psbt = new Psbt({ network });
    const edicts: any = [];

    let tokenSum = 0;

    // create rune utxo input && edict
    for (const runeutxo of runeUtxos.runeUtxos) {
      if (
        tokenSum <
        transferAmount * 10 ** runeUtxos.runeUtxos[0].divisibility
      ) {
        inputArray.push(0);
        psbt.addInput({
          hash: runeutxo.txid,
          index: runeutxo.vout,
          tapInternalKey: Buffer.from(ordinalPublicKey, "hex"),
          witnessUtxo: {
            value: runeutxo.value,
            script: Buffer.from(runeutxo.scriptpubkey, "hex"),
          },
        });
        tokenSum += runeutxo.amount;
      }
    }

    console.log("Typeof runeBlockNumber ==> ", typeof runeBlockNumber);
    console.log("Typeof runeTxout ==> ", typeof runeTxout);
    console.log(
      "transferAmount ==> ",
      transferAmount * 10 ** runeUtxos.runeUtxos[0].divisibility
    );
    console.log("tokenSum ==> ", tokenSum);

    if (
      tokenSum - transferAmount * 10 ** runeUtxos.runeUtxos[0].divisibility >
      0
    ) {
      edicts.push({
        id: new RuneId(runeBlockNumber, runeTxout),
        amount: transferAmount * 10 ** runeUtxos.runeUtxos[0].divisibility,
        output: 2,
      });

      edicts.push({
        id: new RuneId(runeBlockNumber, runeTxout),
        amount:
          tokenSum - transferAmount * 10 ** runeUtxos.runeUtxos[0].divisibility,
        output: 1,
      });
    } else {
      edicts.push({
        id: new RuneId(runeBlockNumber, runeTxout),
        amount: parseInt(transferAmount.toString()),
        output: 1,
      });
    }

    console.log("tokenSum ==> ", tokenSum);
    console.log("transferAmount ==> ", edicts);

    const mintstone = new Runestone(edicts, none(), none(), none());

    psbt.addOutput({
      script: mintstone.encipher(),
      value: 0,
    });

    if (tokenSum - transferAmount > 0) {
      psbt.addOutput({
        address: ordinalAddress, // rune sender address
        value: 546,
      });
    }

    // add rune receiver address
    psbt.addOutput({
      address: destinationAddress, // rune receiver address
      value: 546,
    });

    // BTC transaction
    let paymentoutput;

    const hexedPaymentPubkey = Buffer.from(paymentPublicKey, "hex");
    const p2wpkh = payments.p2wpkh({
      pubkey: hexedPaymentPubkey,
      network: network,
    });

    const { redeem } = payments.p2sh({
      redeem: p2wpkh,
      network: network,
    });

    paymentoutput = redeem?.output;

    const btcUtxos = await getBtcUtxoByAddress(paymentAddress as string);
    const feeRate = await getFeeRate();

    // add btc utxo input
    let totalBtcAmount = 0;
    for (const btcutxo of btcUtxos) {
      const fee = calculateTxFee(psbt, feeRate);
      if (totalBtcAmount < fee && btcutxo.value > 10000) {
        totalBtcAmount += btcutxo.value;

        const txHex = await getTxHexById(btcutxo.txid);
        console.log("txHex WalletTypes.XVERSE  ==> ", txHex);
        inputArray.push(1);
        psbt.addInput({
          hash: btcutxo.txid,
          index: btcutxo.vout,
          redeemScript: paymentoutput,
          nonWitnessUtxo: Buffer.from(txHex, "hex"),
          sighashType: Transaction.SIGHASH_ALL,
        });
      }
    }

    const fee = calculateTxFee(psbt, feeRate);

    console.log("feeRate ==> ", feeRate);
    console.log("Pay Fee =====================>", fee);
    console.log("totalBtcAmount ====>", totalBtcAmount);

    if (totalBtcAmount < fee) throw "BTC balance is not enough";

    psbt.addOutput({
      address: paymentAddress as string,
      value: totalBtcAmount - fee,
    });

    console.log("psbt ============>", psbt.toHex());

    return {
      psbtHex: psbt.toHex(),
      psbtBase64: psbt.toBase64(),
      inputArray,
    };
  } catch (error) {
    console.log("error ==> ", error);
  }
};

export const transfer = async (
  psbt: string,
  signedPSBT: string,
  inputCount: number
) => {
  try {
    let sellerSignPSBT;
    const inputArray = [];
    console.log("inputCount ==> ", inputCount);
    for (let i = 0; i < inputCount; i++) {
      inputArray.push(i);
    }

    sellerSignPSBT = Psbt.fromBase64(signedPSBT);
    sellerSignPSBT = await finalizePsbtInput(
      sellerSignPSBT.toHex(),
      inputArray
    );
    console.log("WalletTypes.XVERSE inputArray  ==> ", inputArray);

    const combineResult = await combinePsbt(psbt, sellerSignPSBT);
    if (!combineResult.success)
      return {
        success: false,
        message: "Get Error",
        payload: combineResult.payload,
      };

    return {
      success: true,
      message: "Transaction broadcasting successfully.",
      payload: combineResult.payload,
    };
  } catch (error) {
    console.log("Error : ", error);
    return {
      success: false,
      message: "Transaction broadcasting failed.",
      payload: null,
    };
  }
};

const getRuneUtxoByAddress = async (address: string, runeId: string) => {
  const url = `${OPENAPI_UNISAT_URL}/v1/indexer/address/${address}/runes/${runeId}/utxo`;

  console.log("url===========>", url);

  const config = {
    headers: {
      Authorization: `Bearer ${OPENAPI_UNISAT_TOKEN}`,
    },
  };
  let cursor = 0;
  let tokenSum = 0;
  const size = 5000;
  const utxos: IRuneUtxo[] = [];
  const res = await axios.get(url, { ...config, params: { cursor, size } });
  console.log("res.data utxo ==> ");
  console.log(res.data.data.utxo[0].runes);

  if (res.data.code === -1) throw "Invalid Address";
  utxos.push(
    ...(res.data.data.utxo as any[]).map((utxo) => {
      tokenSum += Number(utxo.runes[0].amount);
      return {
        scriptpubkey: utxo.scriptPk,
        txid: utxo.txid,
        value: utxo.satoshi,
        vout: utxo.vout,
        amount: Number(utxo.runes[0].amount),
        divisibility: utxo.runes[0].divisibility,
      };
    })
  );

  return { runeUtxos: utxos, tokenSum };
};

const getBtcUtxoByAddress = async (address: string) => {
  const url = `${OPENAPI_UNISAT_URL}/v1/indexer/address/${address}/utxo-data`;

  console.log("get btc utxo url ====>", url);

  const config = {
    headers: {
      Authorization: `Bearer ${OPENAPI_UNISAT_TOKEN}`,
    },
  };

  let cursor = 0;
  const size = 5000;
  const utxos: IUtxo[] = [];

  // while (1) {
  const res = await axios.get(url, { ...config, params: { cursor, size } });

  if (res.data.code === -1) throw "Invalid Address";

  utxos.push(
    ...(res.data.data.utxo as any[]).map((utxo) => {
      return {
        scriptpubkey: utxo.scriptPk,
        txid: utxo.txid,
        value: utxo.satoshi,
        vout: utxo.vout,
      };
    })
  );

  console.log("btc utxos ====>", utxos);

  return utxos;
};

const getFeeRate = async () => {
  try {
    const url = `https://mempool.space/api/v1/fees/recommended`;
    const res = await axios.get(url);
    return res.data.fastestFee;
  } catch (error) {
    console.log("Ordinal api is not working now. Try again later");
    return 40 * 3;
  }
};

const calculateTxFee = (psbt: Psbt, feeRate: number) => {
  const tx = new Transaction();
  const SIGNATURE_SIZE = 126;
  for (let i = 0; i < psbt.txInputs.length; i++) {
    const txInput = psbt.txInputs[i];
    tx.addInput(txInput.hash, txInput.index, txInput.sequence);
    tx.setWitness(i, [Buffer.alloc(SIGNATURE_SIZE)]);
  }
  for (let txOutput of psbt.txOutputs) {
    tx.addOutput(txOutput.script, txOutput.value);
  }
  return tx.virtualSize() * feeRate;
};

const getTxHexById = async (txId: string) => {
  try {
    const { data } = await axios.get(
      `https://mempool.space/api/tx/${txId}/hex`
    );

    return data as string;
  } catch (error) {
    console.log("Mempool api error. Can not get transaction hex");

    throw "Mempool api is not working now. Try again later";
  }
};

const finalizePsbtInput = (hexedPsbt: string, inputs: number[]) => {
  const psbt = Psbt.fromHex(hexedPsbt);
  inputs.forEach((input) => psbt.finalizeInput(input));
  return psbt.toHex();
};

const combinePsbt = async (
  hexedPsbt: string,
  signedHexedPsbt1: string,
  signedHexedPsbt2?: string
) => {
  try {
    const psbt = Psbt.fromHex(hexedPsbt);
    const signedPsbt1 = Psbt.fromHex(signedHexedPsbt1);
    if (signedHexedPsbt2) {
      const signedPsbt2 = Psbt.fromHex(signedHexedPsbt2);
      psbt.combine(signedPsbt1, signedPsbt2);
    } else {
      psbt.combine(signedPsbt1);
    }

    console.log("combine is finished!!");

    const tx = psbt.extractTransaction();
    const txHex = tx.toHex();

    console.log("txHex =======> ", txHex);

    const txId = await pushRawTx(txHex);
    // const txId = "";
    console.log("txId ==> ", txId);

    return {
      success: true,
      payload: txId,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      payload: error,
    };
  }
};

const pushRawTx = async (rawTx: string) => {
  const txid = await postData(`https://mempool.space/api/tx`, rawTx);
  console.log("pushed txid", txid);
  return txid;
};

const postData = async (
  url: string,
  json: any,
  content_type = "text/plain",
  apikey = ""
) => {
  while (1) {
    try {
      const headers: any = {};

      if (content_type) headers["Content-Type"] = content_type;

      if (apikey) headers["X-Api-Key"] = apikey;
      const res = await axios.post(url, json, {
        headers,
      });

      return res.data;
    } catch (err: any) {
      const axiosErr = err;
      console.log("push tx error", axiosErr.response?.data);

      if (
        !(axiosErr.response?.data).includes(
          'sendrawtransaction RPC error: {"code":-26,"message":"too-long-mempool-chain,'
        )
      )
        throw new Error("Got an err when push tx");
    }
  }
};
