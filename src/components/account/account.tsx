// eslint-disable-next-line css-modules/no-unused-class
import chel from "images/chel.svg";
import cash from "images/cash.svg";
import bg_2 from "images/bg_3.svg";
import arrowUp from "images/arrow_up.png";
import styles from "./account.module.scss";
import { useCallback, useEffect, useState } from "react";
import coin1 from "images/coin1.svg";
import coin2 from "images/coin2.svg";
import cup from "images/cup.svg";
import AvatarImage from "@/elements/avatarImage/avi";
import { useMetaMask } from "@/elements/metamask/useMetaMask";
import { getUserBets } from "@/api/apiMain";
import { IRes } from "../stats/stats";

// const tableData2 = [
//   {
//     game: 1,
//     balance: 0.0456,
//     val: "ETH",
//     icon: coin2,
//     winner: "SHIBA",
//   },
//   {
//     game: 2,
//     balance: 0.0456,
//     val: "ETH",
//     icon: coin1,
//     winner: "PEPE",
//   },
//   {
//     game: 3,
//     balance: 0.0456,
//     val: "USD",
//     icon: coin2,
//     winner: "SHIBA",
//   },
//   {
//     game: 4,
//     balance: 0.0456,
//     val: "ETH",
//     icon: coin2,
//     winner: "SHIBA",
//   },
//   {
//     game: 5,
//     balance: 0.0456,
//     val: "ETH",
//     icon: coin2,
//     winner: "SHIBA",
//   },
// ];

export default function AccountPage() {
  const [winCount, setWinCount] = useState(0);
  const [loseCount, setLoseCount] = useState(0);
  const [team1] = useState("PEPE");
  const [team2] = useState("SHIBA");
  const [val] = useState("TF");

  const { apiUser } = useMetaMask();
  const [res, setRes] = useState<Array<IRes>>([]);
  // const [u, setU] = useState();

  const getHistory = useCallback(
    async (id: number) => {
      const res = await getUserBets(id);

      //@ts-ignore
      const data = await res.json();
      setWinCount(data.filter((v: IRes) => v.isWin).length);
      setLoseCount(data.filter((v: IRes) => !v.isWin).length);

      setRes(data);
    },
    [apiUser]
  );

  const getIcon = (isWin: boolean, color: 0 | 1) => {
    if (isWin) {
      if (color === 0) {
        return coin1;
      }

      return coin2;
    } else {
      if (color === 0) {
        return coin2;
      }

      return coin1;
    }
  };

  const getTeam = (isWin: boolean, color: 0 | 1) => {
    if (isWin) {
      if (color === 0) {
        return team1;
      }

      return team2;
    } else {
      if (color === 0) {
        return team2;
      }

      return team1;
    }
  };

  useEffect(() => {
    if (apiUser) {
      getHistory(apiUser?.id);
    }
  }, [apiUser]);

  return (
    <div className={styles.home}>
      <img src={bg_2} alt="bg" className={styles.home_sec5_bg} />

      {apiUser ? (
        <div className={styles.home_sec5}>
          <h2>
            <img src={cash} alt="arr" />
            {apiUser ? (+apiUser?.balance).toFixed(2) : "0"} {val}
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
                  <div>YOU</div>
                  <div></div>
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

            <div className={styles.home_sec5_main}>
              <div className={styles.home_sec5_main_table}>
                {res &&
                  res.map((v, i) => (
                    <div key={i} className={styles.home_sec5_main_table_row}>
                      <div className={styles.home_sec5_main_table_row_game}>
                        <div>Game:</div>
                        <div>{v.id}</div>
                      </div>
                      <div className={styles.home_sec5_main_table_row_bal}>
                        <div>Balance({(+val).toFixed(2)}):</div>
                        <div style={{ color: v.sumOfBet && v.isWin ? "green" : "red" }}>
                          {`${v.isWin === false ? "-" : ""}${v.sumOfBet.toFixed(2)}`}
                        </div>
                      </div>
                      <div className={styles.home_sec5_main_table_row_bal}>
                        <div>Hash:</div>
                        <div style={{ width: "100%", maxWidth: 180, overflowX: "auto" }}>{v.md5}</div>
                      </div>
                      <div className={styles.home_sec5_main_table_row_bal}>
                        <div>Secret:</div>
                        <div style={{ width: "100%", maxWidth: 180, overflowX: "auto" }}>{v.secret}</div>
                      </div>
                      <div className={styles.home_sec5_main_table_row_win}>
                        <div>WINNER:</div>
                        <img src={getIcon(v.isWin, v.color)} alt="icon" />
                        <div>Team {getTeam(v.isWin, v.color)}</div>
                      </div>
                    </div>
                  ))}
                {(!res || res.length === 0) && <div className={styles.home_sec5_main_table_zero}>No Results</div>}
              </div>
            </div>

            {/* <div className={styles.home_sec5_main_table}>
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
          </div> */}
          </div>
        </div>
      ) : (
        <div className={styles.home_empty}>Please connect metamask to see this page</div>
      )}
    </div>
  );
}
