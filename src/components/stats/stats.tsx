// eslint-disable-next-line css-modules/no-unused-class
import coin1 from "images/coin1.svg";
import coin2 from "images/coin2.svg";
import stats from "images/stats.svg";
import styles from "./stats.module.scss";
import { getUserBets } from "@/api/apiMain";
import { useCallback, useEffect, useState } from "react";
import { useMetaMask } from "@/elements/metamask/useMetaMask";
// import bg_2 from "images/bg_2.svg";

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

interface IRes {
  id: number;
  userId: number;
  sumOfBet: number;
  flipDate: Date;
  isWin: boolean;
  color: 0 | 1;
  md5: string;
  secret: string;
}
export default function StatsPage() {
  const [team1] = useState("PEPE");
  const [team2] = useState("SHIBA");
  const [val] = useState("ETH");

  const { apiUser } = useMetaMask();
  const [res, setRes] = useState<Array<IRes>>([]);
  const [u, setU] = useState();

  const getHistory = useCallback(async () => {
    const res = await getUserBets(apiUser?.userId);

    //@ts-ignore
    const data = await res.json();

    setRes(data);
  }, [apiUser]);

  useEffect(() => {
    getHistory();
    setU(apiUser?.id);
  }, []);

  useEffect(() => {
    if (apiUser?.id !== u?.id) {
      getHistory();
      setU(apiUser?.id);
    }
  }, []);

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

  return (
    <div className={styles.home}>
      <div className={styles.home_sec4}>
        <h2>
          <img src={stats} alt="arr" />
          Stats
        </h2>
        <p className={styles.home_sec4_p1}>Statistic your games</p>

        {/* <img src={bg_2} alt="bg" className={styles.home_sec4_bg} /> */}
        <div className={styles.home_sec4_main}>
          <div className={styles.home_sec4_table}>
            {res &&
              res.map((v, i) => (
                <div key={i} className={styles.home_sec4_table_row}>
                  <div className={styles.home_sec4_table_row_game}>
                    <div>Game:</div>
                    <div>{v.id}</div>
                  </div>
                  <div className={styles.home_sec4_table_row_bal}>
                    <div>Balance:</div>
                    <div>{`${v.isWin === false ? "-" : ""}${v.sumOfBet} ${val}`}</div>
                  </div>
                  <div className={styles.home_sec4_table_row_bal}>
                    <div>Hash:</div>
                    <div style={{ maxWidth: 200, overflowX: "auto" }}>{v.md5}</div>
                  </div>
                  <div className={styles.home_sec4_table_row_bal}>
                    <div style={{ maxWidth: 200, overflowX: "auto" }}>Hash:</div>
                    <div>{v.secret}</div>
                  </div>
                  <div className={styles.home_sec4_table_row_win}>
                    <div>WINNER:</div>
                    <img src={getIcon(v.isWin, v.color)} alt="icon" />
                    <div>Team {getTeam(v.isWin, v.color)}</div>
                  </div>
                </div>
              ))}
            {(!res || res.length === 0) && <div className={styles.home_sec4_table_zero}>No Results</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
