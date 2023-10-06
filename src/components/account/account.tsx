// eslint-disable-next-line css-modules/no-unused-class
import chel from "images/chel.svg";
import cash from "images/cash.svg";
import bg_2 from "images/bg_3.svg";
import arrowUp from "images/arrow_up.png";
import styles from "./account.module.scss";
import { useState } from "react";
import coin1 from "images/coin1.svg";
import coin2 from "images/coin2.svg";
import cup from "images/cup.svg";
import AvatarImage from "@/elements/avatarImage/avi";
import { useMetaMask } from "@/elements/metamask/useMetaMask";

const tableData2 = [
  {
    game: 1,
    balance: 0.0456,
    val: "ETH",
    icon: coin2,
    winner: "SHIBA",
  },
  {
    game: 2,
    balance: 0.0456,
    val: "ETH",
    icon: coin1,
    winner: "PEPE",
  },
  {
    game: 3,
    balance: 0.0456,
    val: "USD",
    icon: coin2,
    winner: "SHIBA",
  },
  {
    game: 4,
    balance: 0.0456,
    val: "ETH",
    icon: coin2,
    winner: "SHIBA",
  },
  {
    game: 5,
    balance: 0.0456,
    val: "ETH",
    icon: coin2,
    winner: "SHIBA",
  },
];

export default function AccountPage() {
  const { apiUser } = useMetaMask();

  // const [ballance] = useState(0.05647);
  const [val] = useState("ETH");
  const [winCount] = useState(123);
  const [loseCount] = useState(12);

  return (
    <div className={styles.home}>
      <img src={bg_2} alt="bg" className={styles.home_sec5_bg} />

      <div className={styles.home_sec5}>
        <h2>
          <img src={cash} alt="arr" />
          {apiUser?.balance} {val}
        </h2>
        <div className={styles.home_sec5_p}>
          <div className={styles.home_sec5_p_1}>
            <img src={arrowUp} alt="arr" />
            Withdraw
          </div>
          <div className={styles.home_sec5_p_2}>
            <img src={arrowUp} alt="arr" />
            Deposit
          </div>
        </div>

        <div className={styles.home_sec5_main}>
          <div className={styles.home_sec5_main_info}>
            <div className={styles.home_sec5_main_info_left}>
              <div>
                <AvatarImage creds="LE" img={chel} />
              </div>
              <div>
                <div>Leo K</div>
                <div>Enemy</div>
              </div>
            </div>
            <div className={styles.home_sec5_main_info_right}>
              <img src={cup} alt="asd" />
              <p>79</p>
            </div>
          </div>

          <div className={styles.home_sec5_main_wl}>
            <div className={styles.home_sec5_main_wl_left}>
              <div>WIN:</div>
              <div>{winCount}</div>
            </div>
            <div className={styles.home_sec5_main_wl_right}>
              <div>LOSE:</div>
              <div>{loseCount}</div>
            </div>
          </div>

          <div className={styles.home_sec5_main_table}>
            {tableData2.map((v, i) => (
              <div key={i} className={styles.home_sec5_main_table_row}>
                <div className={styles.home_sec5_main_table_row_game}>
                  <div>Game:</div>
                  <div>{v.game}</div>
                </div>
                <div className={styles.home_sec5_main_table_row_bal}>
                  <div>Balance:</div>
                  <div>
                    {v.balance} {v.val}
                  </div>
                </div>
                <div className={styles.home_sec5_main_table_row_win}>
                  <div>WINNER:</div>
                  <img src={v.icon} alt="icon" />
                  <div>Team {v.winner}</div>
                </div>
              </div>
            ))}
            {tableData2.length === 0 && <div className={styles.home_sec5_main_table_zero}>No Results</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
