import { Route, Routes, BrowserRouter } from "react-router-dom";
import { urlAccount, urlDeposit, urlHome, urlStats, urlWithdraw } from "./mainRouterPathes";
import HomePage from "./components/home/homePage";
import WithdrawPage from "./components/withdraw/withdraw";
import StatsPage from "./components/stats/stats";
import DepositPage from "./components/deposit/deposit";
import AccountPage from "./components/account/account";
import Header from "./components/header/header";

export default function MainRouter() {
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
