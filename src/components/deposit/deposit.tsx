import arrowUp from "images/arrow_up.png";
import arrow_right from "images/arrows_right.svg";
import qu from "images/qu.svg";
import styles from "./deposit.module.scss";
import ReactSlider from "react-slider";
import { useState } from "react";

import btc from "images/btc.png";
import eth from "images/eth.png";
import ttt from "images/ttt.png";
import visa from "images/visa.png";
import mastercard from "images/mastercard.png";
import sq from "images/sq.png";

const wallets = [
  {
    id: 1,
    name: "USD",
    img: mastercard,
  },
  {
    id: 2,
    name: "USD",
    img: visa,
  },
  {
    id: 3,
    name: "BTC",
    img: btc,
  },
  {
    id: 4,
    name: "ETH",
    img: eth,
  },
  {
    id: 5,
    name: "USDT",
    img: ttt,
  },
  {
    id: 6,
    name: "TRON",
    img: sq,
  },
];

const tableData = [
  {
    id: 1,
    ammount: 0.0456,
    wallet: "0x7273796e632d6275696c6465722e78797a",
    status: "Confirmed",
  },
  {
    id: 2,
    ammount: 0.1456,
    wallet: "0x7273796e632d6275696c6465722e78797a",
    status: "Processing",
  },
  {
    id: 3,
    ammount: 0.4456,
    wallet: "0x7273796e632d6275696c6465722e78797a",
    status: "Processing",
  },
];

export default function DepositPage() {
  const [walletVal] = useState(0.05647);
  const [walletNum] = useState("0x7273796e632d6275696c6465722e78797a");
  const [wallet, setWallet] = useState(wallets[0]);

  const [confirm, setConfirm] = useState(false);
  const [ammount] = useState(0.05647);
  const [getonbal] = useState(0.05647);
  const [comm] = useState(0.05647);

  return (
    <div className={styles.home}>
      <div className={styles.home_sec3}>
        <h2>
          <img src={arrowUp} alt="arr" />
          Deposit
        </h2>
        <p className={styles.home_sec3_p1}>
          <img src={qu} alt="qu" />
          How it works?
        </p>

        <div className={styles.home_sec3_main}>
          <div className={styles.home_sec3_main_top}>
            <div className={styles.home_sec3_main_top_left}>
              <input value={`${walletVal} ${wallet.name}`} disabled />
              <input value={walletNum} disabled />
              <ReactSlider
                className="horizontal-slider2"
                thumbClassName="example-thumb2"
                trackClassName="example-track"
                defaultValue={3000}
                min={0}
                max={10000}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
              />
              <div className={styles.home_sec3_main_top_left_nums}>
                <p>0</p>
                <p>10000</p>
              </div>
            </div>
            <div className={styles.home_sec3_main_top_right}>
              {wallets.map((v, i) => (
                <div
                  className={v.id == wallet.id ? styles.home_sec3_main_top_right_sel : ""}
                  key={v.name + i}
                  onClick={() => setWallet(v)}
                >
                  <img src={v.img} alt="val" />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.home_sec3_main_mid}>
            <input checked={confirm} onChange={() => setConfirm(!confirm)} type="checkbox" />
            <label>I confirm that I have provided valid information.</label>
          </div>

          <div className={styles.home_sec3_main_bot}>
            <button disabled={!confirm}>
              Confirm
              <img src={arrow_right} alt="srt" />
            </button>
            <div>
              <p>
                Amount: . . . . . . . . . . . . . . . . . . . . . . . . . . . . {ammount.toFixed(5)}
                {" " + wallet.name}
              </p>
              <p>Get on the balance: . . . . . . . . . . . . . . . . . . . . . . . {getonbal.toFixed(5)}</p>
              <p>Commission: . . . . . . . . . . . . . . . . . . . . . . . . . . . . {comm.toFixed(5)}</p>
            </div>
          </div>

          <div className={styles.home_sec3_main_table}>
            {tableData.map((v, i) => (
              <div key={i} className={styles.home_sec3_main_table_row}>
                <div className={styles.home_sec3_main_table_row_amount}>
                  <div>Amount:</div>
                  <div>{v.ammount}</div>
                </div>
                <div className={styles.home_sec3_main_table_row_wallet}>
                  <div>Wallet:</div>
                  <div>{v.wallet}</div>
                </div>
                <div className={styles.home_sec3_main_table_row_status}>{v.status}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
