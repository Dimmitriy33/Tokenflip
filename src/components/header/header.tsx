/* eslint-disable css-modules/no-unused-class */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import logo from "images/logoMain.svg";
import styles from "./header.module.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useMetaMask } from "@/elements/metamask/useMetaMask";
import { formatAddress } from "@/elements/metamask/utils";
import { useState } from "react";

const pathes: IMenuItem[] = [
  {
    path: "",
    title: "Home",
  },
  {
    path: "withdraw",
    title: "Withdraw",
  },
  {
    path: "stats",
    title: "Stats",
  },
  {
    path: "account",
    title: "Account",
  },
  {
    path: "deposit",
    title: "Deposit",
  },
];

export default function Header() {
  const { wallet, hasProvider, isConnecting, apiUser, connectMetaMask } = useMetaMask();
  const [val] = useState("ETH");
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.header}>
      <div className={styles.header_left}>
        <img src={logo} alt="logo" />
        <div className={styles.header_left_2}>
          <div className={styles.header_left_2_1}>Token</div>
          <div className={styles.header_left_2_2}>Flip</div>
        </div>
      </div>
      <div className={styles.header_menu}>
        {pathes.map((v, i) => (
          <div key={i} className={location.pathname === `/${v.path}` ? styles.header_menu_active : ""}>
            <span />
            <div
              key={v.title}
              onClick={() => {
                navigate("/" + v.path);

                // const id = v.path;
                // const yOffset = -140;
                // const element = document.getElementById(id);
                // const y = element ? element.getBoundingClientRect().top + window.pageYOffset + yOffset : 0;
                // window.scrollTo({ top: y, behavior: "smooth" });
                // document.getElementById(v.path)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
              }}
            >
              {v.title}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.header_right}>
        {!hasProvider && (
          <a href="https://metamask.io" target="_blank" rel="noreferrer">
            Install MetaMask
          </a>
        )}
        {window.ethereum?.isMetaMask && wallet.accounts.length < 1 && (
          <button disabled={isConnecting} onClick={connectMetaMask}>
            Connect MetaMask
          </button>
        )}
        {hasProvider && wallet.accounts.length > 0 && (
          <>
            <p>
              {apiUser?.balance || "0.0000000000"} {val}
            </p>
            <a
              className="text_link tooltip-bottom"
              href={`https://etherscan.io/address/${wallet}`}
              target="_blank"
              data-tooltip="Open in Block Explorer"
              rel="noreferrer"
            >
              Connected
              {/* {formatAddress(wallet.accounts[0])} */}
            </a>
          </>
        )}
      </div>
    </div>
  );
}

interface IMenuItem {
  path: string;
  title: string;
}
