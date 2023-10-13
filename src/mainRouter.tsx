import { Route, Routes, BrowserRouter } from "react-router-dom";
import { urlAccount, urlDeposit, urlHome, urlStats, urlWithdraw } from "./mainRouterPathes";
import HomePage from "./components/home/homePage";
import WithdrawPage from "./components/withdraw/withdraw";
import StatsPage from "./components/stats/stats";
import DepositPage from "./components/deposit/deposit";
import AccountPage from "./components/account/account";
import Header from "./components/header/header";
import { WalletState, useMetaMask } from "./elements/metamask/useMetaMask";
import { useCallback, useEffect } from "react";
import { login } from "./api/apiMain";

export default function MainRouter() {
  const { wallet, hasProvider, apiUser, updateApiUser } = useMetaMask();

  const loginF = useCallback(
    async (wallet: WalletState) => {
      const res = await login(wallet);
      //@ts-ignore
      const data = await res.json();
      updateApiUser({
        ...data,
        userId: data.id,
      });
    },
    [updateApiUser]
  );

  useEffect(() => {
    const wAcc = wallet.accounts[0];
    if (hasProvider && wAcc && wAcc !== apiUser?.address) {
      loginF(wallet);
    }
  }, [wallet]);

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path={urlHome} element={<HomePage />} />
        <Route path={urlAccount} element={<AccountPage />} />
        <Route path={urlDeposit} element={<DepositPage />} />
        <Route path={urlStats} element={<StatsPage />} />
        <Route path={urlWithdraw} element={<WithdrawPage />} />
      </Routes>
    </BrowserRouter>
  );
}
