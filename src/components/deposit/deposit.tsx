import arrowUp from "images/arrow_up.png";
import arrow_right from "images/arrows_right.svg";
import qu from "images/qu.svg";
import styles from "./deposit.module.scss";
import ReactSlider from "react-slider";
import { useCallback, useEffect, useState } from "react";

// import btc from "images/btc.png";
// import eth from "images/eth.png";
import ttt from "images/ttt.png";
// import visa from "images/visa.png";
// import mastercard from "images/mastercard.png";
// import sq from "images/sq.png";
import { useMetaMask } from "@/elements/metamask/useMetaMask";
import CurrencyInput from "react-currency-input-field";
import { getDeposits } from "@/api/apiMain";

// const wallets = [
//   {
//     id: 1,
//     name: "USD",
//     img: mastercard,
//   },
//   {
//     id: 2,
//     name: "USD",
//     img: visa,
//   },
//   {
//     id: 3,
//     name: "BTC",
//     img: btc,
//   },
//   {
//     id: 4,
//     name: "ETH",
//     img: eth,
//   },
//   {
//     id: 5,
//     name: "USDT",
//     img: ttt,
//   },
//   {
//     id: 6,
//     name: "TRON",
//     img: sq,
//   },
// ];

// const tableData = [
//   {
//     id: 1,
//     ammount: 0.0456,
//     wallet: "0x7273796e632d6275696c6465722e78797a",
//     status: "Confirmed",
//   },
//   {
//     id: 2,
//     ammount: 0.1456,
//     wallet: "0x7273796e632d6275696c6465722e78797a",
//     status: "Processing",
//   },
//   {
//     id: 3,
//     ammount: 0.4456,
//     wallet: "0x7273796e632d6275696c6465722e78797a",
//     status: "Processing",
//   },
// ];

export interface IWithDep {
  id: number;
  userId: number;
  sum: number;
  isDone: boolean;
}

export default function DepositPage() {
  const { apiUser } = useMetaMask();

  const [tableData, setTableData] = useState<IWithDep[]>([]);
  const [walletVal, setWalletVal] = useState(0);
  const [walletNum, setWalletNum] = useState("0x7273796e632d6275696c6465722e78797a");
  const [walletOut] = useState({ id: 1, name: " TF", img: ttt });
  // const [wallet] = useState(wallets[0]);

  const [confirm, setConfirm] = useState(false);

  const updateValue = (val: number) => {
    const maxV = apiUser?.balance ? Math.min(+val.toFixed(2), apiUser.balance) : 0;
    const v = Math.max(maxV, 0);

    setWalletVal(v);
  };

  const getTableData = useCallback(async () => {
    const res = await getDeposits();
    //@ts-ignore
    const data = await res.json();
    setTableData(data);
  }, []);

  useEffect(() => {
    if (apiUser) {
      setWalletNum(apiUser.address);
      getTableData();
    }
  }, [apiUser]);

  return (
    <div className={styles.home}>
      {apiUser ? (
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
                <CurrencyInput
                  id="input-example"
                  name="input-name"
                  placeholder="Please enter a sum"
                  defaultValue={walletVal}
                  decimalsLimit={2}
                  suffix={walletOut.name}
                  max={100000}
                  min={0}
                  value={walletVal}
                  onValueChange={(value, _name) => {
                    updateValue(value ? Number(value) : 0);
                  }}
                />
                <input value={walletNum} disabled />
                <ReactSlider
                  className="horizontal-slider2"
                  thumbClassName="example-thumb2"
                  trackClassName="example-track"
                  defaultValue={0}
                  min={0}
                  max={100000}
                  value={walletVal}
                  onChange={(v) => updateValue(v)}
                  renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                />
                <div className={styles.home_sec3_main_top_left_nums}>
                  <p>0</p>
                  <p>100000</p>
                </div>
              </div>
              <div className={styles.home_sec3_main_top_right}>
                {/* {wallets.map((v, i) => (
                <div
                  className={v.id == walletOut.id ? styles.home_sec3_main_top_right_sel : ""}
                  key={v.name + i}
                  onClick={() => setWallet(v)}
                >
                  <img src={v.img} alt="val" />
                </div>
              ))} */}
                <div
                  className={styles.home_sec3_main_top_right_sel}
                  key={1}
                  // onClick={() => setWallet(v)}
                >
                  {/* <img src={v.img} alt="val" /> */}
                  <div>TF</div>
                </div>
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
                  Amount: . . . . . . . . . . . . . . . . . . . . . . . . . . . . {walletVal.toFixed(2)}
                  {" " + walletOut.name}
                </p>
                {/* <p>Get on the balance: . . . . . . . . . . . . . . . . . . . . . {(walletVal * 0.99).toFixed(2)}</p>
                <p>
                  Commission: . . . . . . . . . . . . . . . . . . . . . . . . . . . . {(walletVal * 0.01).toFixed(2)}
                </p> */}
              </div>
            </div>

            <div className={styles.home_sec3_main_table}>
              {tableData.map((v, i) => (
                <div key={i} className={styles.home_sec3_main_table_row}>
                  <div className={styles.home_sec3_main_table_row_amount}>
                    <div>Amount:</div>
                    <div>{v.sum.toFixed(2)}</div>
                  </div>
                  <div className={styles.home_sec3_main_table_row_wallet}>
                    <div>Address:</div>
                    <div>{apiUser.address}</div>
                  </div>
                  <div className={styles.home_sec3_main_table_row_status}>{v.isDone ? "Confirmed" : "Processing"}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.home_empty}>Please connect metamask to see this page</div>
      )}
    </div>
  );
}
