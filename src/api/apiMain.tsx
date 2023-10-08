import { WalletState } from "@/elements/metamask/useMetaMask";
import { BACKEND_URL } from "@/elements/metamask/utils";

export const login = (form: WalletState) => {
  return fetch(`${BACKEND_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: form.accounts[0],
      walletBalance: form.balance,
      chainId: form.chainId,
    }),
  }).catch((err) => {
    console.error(err.message);
  });
};

export const placeBet = (form: { color: number; userId: string; md5: string; address: string; betSum: number }) => {
  return fetch(`${BACKEND_URL}/flipshistory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  }).catch((err) => {
    console.error(err.message);
  });
};

export const finishGame = (form: { md5: string; id: string }) => {
  return fetch(`${BACKEND_URL}/game`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  }).catch((err) => {
    console.error(err.message);
  });
};

export const getGame = () => {
  return fetch(`${BACKEND_URL}/game`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error(err.message);
  });
};

export const getGameUsers = () => {
  return fetch(`${BACKEND_URL}/users/bets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => {
    console.error(err.message);
  });
};
