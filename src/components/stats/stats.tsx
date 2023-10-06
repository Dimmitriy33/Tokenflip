// eslint-disable-next-line css-modules/no-unused-class
import coin1 from "images/coin1.svg";
import coin2 from "images/coin2.svg";
import stats from "images/stats.svg";
import styles from "./stats.module.scss";
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

export default function StatsPage() {
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
            {tableData2.map((v, i) => (
              <div key={i} className={styles.home_sec4_table_row}>
                <div className={styles.home_sec4_table_row_game}>
                  <div>Game:</div>
                  <div>{v.game}</div>
                </div>
                <div className={styles.home_sec4_table_row_bal}>
                  <div>Balance:</div>
                  <div>
                    {v.balance} {v.val}
                  </div>
                </div>
                <div className={styles.home_sec4_table_row_win}>
                  <div>WINNER:</div>
                  <img src={v.icon} alt="icon" />
                  <div>Team {v.winner}</div>
                </div>
              </div>
            ))}
            {tableData2.length === 0 && <div className={styles.home_sec4_table_zero}>No Results</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
