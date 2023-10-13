/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, createContext, PropsWithChildren, useContext, useCallback } from "react";

import detectEthereumProvider from "@metamask/detect-provider";
import { formatBalance } from "./utils";

export interface WalletState {
  accounts: any[];
  balance: string;
  chainId: string;
}

interface MetaMaskContextData {
  wallet: WalletState;
  apiUser: any;
  hasProvider: boolean | null;
  isPendingTrans: boolean;
  error: boolean;
  errorMessage: string;
  isConnecting: boolean;
  connectMetaMask: () => void;
  clearError: () => void;
  updateBalance: (change: number) => void;
  updateApiUser: (c: any) => void;
  sendTransaction: (sender: string, receiver: string, amount: number) => void;
}

const disconnectedState: WalletState = { accounts: [], balance: "", chainId: "" };

const MetaMaskContext = createContext<MetaMaskContextData>({} as MetaMaskContextData);

export function MetaMaskContextProvider({ children }: PropsWithChildren) {
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const [isPendingTrans, setIsPendingTrans] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const clearError = () => setErrorMessage("");

  const [wallet, setWallet] = useState(disconnectedState);
  const [apiUser, setApiUser] = useState(null);

  // useCallback ensures that you don't uselessly recreate the _updateWallet function on every render
  const _updateWallet = useCallback(async (providedAccounts?: any) => {
    const accounts = providedAccounts || (await window.ethereum.request({ method: "eth_accounts" }));

    if (accounts.length === 0) {
      // If there are no accounts, then the user is disconnected
      setWallet(disconnectedState);
      return;
    }

    const balance = formatBalance(
      await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    setWallet({ accounts, balance, chainId });
  }, []);

  const _sendTransaction = useCallback(async (sender: string, receiver: string, amount: number) => {
    const gasPrice = "0x5208";
    const amountHex = amount.toString(16);
    console.log(amountHex);
    const rx = {
      from: sender,
      to: receiver,
      value: amountHex,
      gas: gasPrice,
    };

    try {
      await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [rx],
      });

      updateBalance(amount * -1);
    } catch {
      console.log("err declined");
    } finally {
      setIsPendingTrans(false);
    }
  }, []);

  const updateWalletAndAccounts = useCallback(() => _updateWallet(), [_updateWallet]);
  const updateWallet = useCallback((accounts: any) => _updateWallet(accounts), [_updateWallet]);
  const sendTransaction = useCallback(
    (sender: string, receiver: string, amount: number) => _sendTransaction(sender, receiver, amount),
    [_sendTransaction]
  );

  /**
   * This logic checks if MetaMask is installed. If it is, some event handlers are set up
   * to update the wallet state when MetaMask changes. The function returned by useEffect
   * is used as a "cleanup": it removes the event handlers whenever the MetaMaskProvider
   * is unmounted.
   */
  useEffect(() => {
    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });
      setHasProvider(Boolean(provider));

      if (provider) {
        updateWalletAndAccounts();
        window.ethereum.on("accountsChanged", updateWallet);
        window.ethereum.on("chainChanged", updateWalletAndAccounts);
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener("accountsChanged", updateWallet);
      window.ethereum?.removeListener("chainChanged", updateWalletAndAccounts);
    };
  }, [updateWallet, updateWalletAndAccounts]);

  const connectMetaMask = async () => {
    setIsConnecting(true);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      clearError();
      updateWallet(accounts);
    } catch (err: any) {
      setErrorMessage(err.message);
    }
    setIsConnecting(false);
  };

  const updateBalance = (v: number) => {
    setApiUser({
      ...(apiUser as any),
      balance: Math.max(apiUser!.balance + v, 0),
    });
  };

  const handleTrans = (sender: string, receiver: string, amount: number) => {
    setIsPendingTrans(true);
    sendTransaction(sender, receiver, amount);
  };

  const updateApiUser = (v) => {
    setApiUser(v);
  };

  return (
    <MetaMaskContext.Provider
      value={{
        apiUser,
        wallet,
        hasProvider,
        error: !!errorMessage,
        isPendingTrans,
        errorMessage,
        isConnecting,
        connectMetaMask,
        clearError,
        updateBalance,
        updateApiUser,
        sendTransaction: handleTrans,
      }}
    >
      {children}
    </MetaMaskContext.Provider>
  );
}

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext);
  if (context === undefined) {
    throw new Error('useMetaMask must be used within a "MetaMaskContextProvider"');
  }
  return context;
};

declare global {
  interface Window {
    // @ts-ignore
    ethereum: any;
  }
}
