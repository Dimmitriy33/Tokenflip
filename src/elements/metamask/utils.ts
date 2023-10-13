export const BACKEND_URL = `https://tokenflip.net:83/api/v1`;

export const formatBalance = (rawBalance: string) => {
  const balance = (parseInt(rawBalance, 10) / 1000000000000000000).toFixed(2);
  return balance;
};

export const formatChainAsNum = (chainIdHex: string) => {
  const chainIdNum = parseInt(chainIdHex, 10);
  return chainIdNum;
};

export const formatAddress = (addr: string) => `${addr.substring(0, 8)}...`;
