// eslint-disable-next-line css-modules/no-unused-class
import coin1 from "images/coin1.svg";
import coin2 from "images/coin2.svg";
import coin1G from "images/coin1.gif";
import coin2G from "images/coin2.gif";
import arrow from "images/arrow.svg";
import bank from "images/bank.png";
import chel from "images/chel.svg";
// import bg_1 from "images/bg_1.svg";
import bg_4 from "images/bg_4.svg";
import timer from "images/timer.svg";
import pers from "images/pers.svg";
import persPlus from "images/persPlus.svg";
import AvatarImage from "@/elements/avatarImage/avi";
import styles from "./homePage.module.scss";
import ReactSlider from "react-slider";
import { useCallback, useEffect, useState } from "react";
import cx from "classnames";
import { finishGame, getGame, getGameUsers, login, placeBet } from "@/api/apiMain";
import { WalletState, useMetaMask } from "@/elements/metamask/useMetaMask";

// let delayTimer;
export default function HomePage() {
  const { wallet, hasProvider, apiUser, updateBalance, updateApiUser } = useMetaMask();
  const [team1] = useState("PEPE");
  const [team2] = useState("SHIBA");
  const [val] = useState("TF");

  const [time, setTime] = useState<number | null>(null);
  const [finishTime, setFinishTime] = useState<number | null>(null);
  const [tick, setTick] = useState(false);

  const [ethValue, setEthValue] = useState(0);
  const [betPlaced, setBetPlaced] = useState<boolean>(false);
  const [selTeam, setSelTeam] = useState<string | null>(null);
  const [curHash, setCurHash] = useState<string | null>(null);
  const [users, setUsers] = useState<Array<any>>([]);

  const [prevGame, setPrevGame] = useState<IPrevGame | null>(null);
  const [resAnim, serResAnim] = useState<boolean>(false);
  const [showRes, setShowRes] = useState<boolean>(false);

  const updateValue = (val: number) => {
    const maxV = apiUser?.balance ? Math.min(+val.toFixed(2), apiUser.balance) : 0;
    const v = Math.max(maxV, 0);

    setEthValue(v);
  };

  const showResultAnim = (data: any) => {
    serResAnim(true);
    setShowRes(false);

    setTimeout(() => {
      const prev = data.previos;

      setPrevGame({
        ...prev,
        sumOfBet: data.sumOfBet,
        teamWin: data?.color === 0 ? team1 : team2,
        isWin: data.isWin,
      });
      if (data.isWin) {
        updateBalance(data.sumOfBet * 2);
      }

      setShowRes(true);
    }, 5600);

    setTimeout(() => {
      const next = data.next;
      const t = Math.round((next.timestamp + 60) * 1000);
      setFinishTime(t);
      setTime(Math.round(((data.timestamp + 60) * 1000 - new Date().getTime()) / 1000));
      setUsers(getMockedUsers(Math.round(((data.timestamp + 60) * 1000 - new Date().getTime()) / 1000), t));
      setCurHash(next.md5);
      setBetPlaced(false);
      setSelTeam(null);
      setEthValue(0);
      serResAnim(false);
      setShowRes(false);
    }, 8000);
  };

  const getGameF = useCallback(async () => {
    const res = await getGame();
    //@ts-ignore
    const data = await res.json();
    const t = (data.timestamp + 60) * 1000;
    if (users.length < 1) {
      const users = getMockedUsers(Math.round(((data.timestamp + 60) * 1000 - new Date().getTime()) / 1000), t);
      setUsers(users);
    }

    setTick(!tick);
    setFinishTime(Math.round(t));
    setBetPlaced(apiUser?.canBet || false);
    setCurHash(data.md5);
  }, []);

  const finishGameF = useCallback(async () => {
    const res = await finishGame({
      md5: curHash as string,
      id: apiUser?.userId || 0,
    });

    //@ts-ignore
    const data = await res.json();

    showResultAnim(data);
  }, [curHash, apiUser]);

  const placeBetF = useCallback(async () => {
    if (apiUser) {
      await placeBet({
        color: selTeam === team1 ? 0 : 1,
        userId: apiUser.userId,
        md5: curHash as string,
        address: wallet.accounts[0],
        betSum: ethValue,
      }).then(() => {
        setBetPlaced(true);
        updateBalance(ethValue * -1);
      });
    }
  }, [apiUser, curHash, ethValue, wallet, selTeam]);

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

  const getPerc = (team: number) => {
    const u1 = users.filter((v) => v?.color === 0).length;
    const u2 = users.filter((v) => v?.color === 1).length;
    if (team === 0) {
      return Math.round(100 * (u1 / (u1 + u2)));
    }

    return Math.round(100 * (u2 / (u1 + u2)));
  };

  useEffect(() => {
    const wAcc = wallet.accounts[0];
    if (hasProvider && wAcc && wAcc !== apiUser?.address) {
      loginF(wallet).then(() => {
        getGameF();
      });
    }
  }, [wallet]);

  useEffect(() => {
    if (finishTime) {
      const diff = Math.round((finishTime - new Date().getTime()) / 1000);
      if (diff <= 0) {
        setFinishTime(null);
        finishGameF();
      }

      const users = getMockedUsers(diff, finishTime);
      setUsers(users);
      setTime(diff);
    }
  }, [tick, finishTime]);

  useEffect(() => {
    const timerID = setInterval(() => setTick(!tick), 1000);
    return () => clearInterval(timerID);
  }, [tick]);

  useEffect(() => {
    if (finishTime === null) {
      getGameF();
    }
  }, []);

  return (
    <div className={styles.home}>
      <img src={bg_4} alt="bg" className={styles.home_bg} />

      <div className={styles.home_sec1} id="Home">
        <div className={styles.home_sec1_block1}>
          <div className={styles.home_sec1_block1_top}>
            <div>
              <div>{selTeam === team1 ? "Player" : "Leo K"}</div>
              <div></div>
              {/* <div>{selTeam === team1 ? "YOU" : "Enemy"}</div> */}
            </div>
            <div>
              <AvatarImage creds="LE" img={chel} />
            </div>
          </div>
          <div className={styles.home_sec1_block1_mid}>
            <div
              className={[
                styles.home_sec1_block1_mid_pep1,
                selTeam === team1 ? styles.home_sec1_block1_mid_pep1_selected : "",
              ].join(" ")}
              onClick={() => setSelTeam(team1)}
            >
              <img src={coin1} alt="coin1" />
              <p>Team {team1}</p>
            </div>
            <div className={styles.home_sec1_block1_mid_pep2}>
              <img src={arrow} alt="arrow" />
              <p>{getPerc(0)}%</p>
            </div>
          </div>
          <div className={styles.home_sec1_block1_bot}>
            <div>
              <img src={bank} alt="bank" />
              <div>Bet Placed</div>
            </div>
            <p>
              {users
                .filter((v) => v?.color === 0)
                .map((v) => v.sumOfBet)
                .reduce((partialSum, a) => partialSum + a, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        <div className={styles.home_sec1_block2}>
          <div className={styles.home_sec1_block2_top}>
            <p>VS</p>
            <span></span>
          </div>

          <div className={styles.home_sec1_block2_mid}>
            {resAnim ? (
              <>
                <p>{showRes ? `TEAM ${prevGame?.teamWin} WON!` : "Flipping..."}</p>
                <img
                  className={styles.home_sec1_block2_mid_imgres}
                  src={prevGame?.teamWin === team1 ? coin1G : coin2G}
                  alt="coin win"
                />
              </>
            ) : (
              <>
                <p>Coin flipping in</p>
                <div className={styles.home_sec1_block2_mid_time}>
                  <img src={timer} alt="timer" />
                  <p>{time || 0} sec</p>
                </div>
                <ReactSlider
                  className="horizontal-slider"
                  thumbClassName="example-thumb"
                  trackClassName="example-track"
                  value={time != null ? (isNaN(time) ? 60 : time) : 60}
                  max={60}
                  renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                />
                <div className={styles.home_sec1_block2_mid_bot}>
                  <div>
                    <div>Coin</div>
                    <div>{selTeam == null ? "Not" : ""} Selected</div>
                  </div>
                  <div>
                    <div>Reward</div>
                    <div>{ethValue * 2}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={styles.home_sec1_block2_bot}>
            <p>Bet Amount</p>
            <div className={styles.home_sec1_block2_bot_main}>
              <button onClick={() => updateValue(ethValue - 1)}>-</button>
              <div>
                <input value={ethValue} min={0} onInput={(e) => updateValue(+e.currentTarget.value)} type="number" />
                <div>{val}</div>
              </div>
              <button onClick={() => updateValue(ethValue + 1)}>+</button>
            </div>
            <button
              disabled={
                !(hasProvider && wallet.accounts.length > 0 && apiUser?.balance > 0) ||
                betPlaced ||
                selTeam === null ||
                resAnim
              }
              onClick={() => {
                placeBetF();
              }}
            >
              Place Bet
            </button>
          </div>
        </div>

        <div className={styles.home_sec1_block1}>
          <div className={[styles.home_sec1_block1_top, styles.home_sec1_block1_top_reverse].join(" ")}>
            <div>
              <div>{selTeam === team2 ? "Player" : "Leo K"}</div>
              <div></div>
              {/* <div>{selTeam === team2 ? "YOU" : "Enemy"}</div> */}
            </div>
            <div>
              <AvatarImage creds="LE" img={chel} />
            </div>
          </div>
          <div className={[styles.home_sec1_block1_mid, styles.home_sec1_block1_mid_rev].join(" ")}>
            <div
              className={[
                styles.home_sec1_block1_mid_pep1,
                selTeam === team2 ? styles.home_sec1_block1_mid_pep1_selected : "",
              ].join(" ")}
              onClick={() => setSelTeam(team2)}
            >
              <img src={coin2} alt="coin2" />
              <p>Team {team2}</p>
            </div>
            <div className={styles.home_sec1_block1_mid_pep2}>
              <img src={arrow} alt="arrow" />
              <p>{getPerc(1)}%</p>
            </div>
          </div>
          <div className={[styles.home_sec1_block1_bot, styles.home_sec1_block1_bot_end].join(" ")}>
            <div>
              <img src={bank} alt="bank" />
              <div>Bet Placed</div>
            </div>
            <p>
              {users
                .filter((v) => v?.color === 1)
                .map((v) => v.sumOfBet)
                .reduce((partialSum, a) => partialSum + a, 0)
                .toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {prevGame && (
        <div className={styles.home_table}>
          {["cur"].map((v, i) => (
            <div key={i} className={styles.home_table_row}>
              <div className={styles.home_table_row_game}>
                <div>Current game ★</div>
              </div>

              <div className={styles.home_table_row_game}>
                <div>Hash:</div>
                <div>{curHash}</div>
              </div>

              {betPlaced && (
                <div className={styles.home_table_row_bal}>
                  <div>Bet:</div>
                  <div>{`${ethValue} ${val}`}</div>
                </div>
              )}

              {betPlaced && (
                <div className={styles.home_table_row_win}>
                  <div>TEAM:</div>
                  <div>{selTeam}</div>
                </div>
              )}
            </div>
          ))}
          {([prevGame] as IPrevGame[]).map((v, i) => (
            <div key={i} className={styles.home_table_row}>
              <div className={styles.home_table_row_game}>
                <div>Previous game ★</div>
              </div>

              <div className={styles.home_table_row_game}>
                <div>Hash:</div>
                <div>{v.md5}</div>
              </div>

              {v.sumOfBet && (
                <div className={styles.home_table_row_bal}>
                  <div>Balance change:</div>
                  <div style={{ color: v.sumOfBet && v.isWin ? "green" : "red" }}>
                    {`${v.sumOfBet ? (v.isWin ? "" : "-") : ""}${v.sumOfBet ? `${v.sumOfBet} ${val}` : ""}`}
                  </div>
                </div>
              )}

              <div className={styles.home_table_row_win}>
                <div>WINNER:</div>
                <img src={v.teamWin === team1 ? coin1 : coin2} alt="icon" />
                <div>Team {v.teamWin}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.home_sec2}>
        <div className={styles.home_sec2_el}>
          <div className={styles.home_sec2_el_top}>
            <div>
              <img src={pers} alt="perc" />
              <div>{users.filter((v) => v?.color === 0).length || 0}</div>
            </div>
            <p>Team {team1}</p>
          </div>

          <div className={styles.home_sec2_list}>
            {users
              .filter((v) => v?.color === 0)
              .map((v, i) => (
                <div
                  key={v.id}
                  className={[styles.home_sec2_list_item, i !== 0 ? styles.home_sec2_list_notActive : ""].join(" ")}
                >
                  <div className={styles.home_sec2_list_item_left}>
                    <AvatarImage creds="LE" img={chel} />
                    <p>{(v.address as string).substring(0, 8)}</p>
                  </div>
                  <div className={styles.home_sec2_list_item_mid}>{(v.sumOfBet as number).toFixed(2)}</div>
                  <button>
                    <img src={persPlus} alt="persPlus" />
                    Join
                  </button>
                </div>
              ))}

            {/* {users.map((_v, i) => (
              <div
                key={team1 + "_" + i}
                className={[styles.home_sec2_list_item, i !== 0 ? styles.home_sec2_list_notActive : ""].join(" ")}
              >
                <div className={styles.home_sec2_list_item_left}>
                  <AvatarImage creds="LE" img={chel} />
                  <p>Leo K</p>
                </div>
                <div className={styles.home_sec2_list_item_mid}>0.0456</div>
                <button>
                  <img src={persPlus} alt="persPlus" />
                  Join
                </button>
              </div>
            ))} */}
          </div>
        </div>

        <div className={styles.home_sec2_el}>
          <div className={styles.home_sec2_el_top}>
            <div>
              <img src={pers} alt="perc" />
              <div>{users.filter((v) => v?.color === 1).length || 0}</div>
            </div>
            <p>Team {team2}</p>
          </div>

          <div className={cx([styles.home_sec2_list, styles.home_sec2_listv2])}>
            {users
              .filter((v) => v?.color === 1)
              .map((v, i) => (
                <div
                  key={v.id}
                  className={cx([
                    styles.home_sec2_list_item,
                    styles.home_sec2_listv2_item,
                    i !== 0 ? styles.home_sec2_list_notActive : "",
                  ])}
                >
                  <div className={styles.home_sec2_list_item_left}>
                    <AvatarImage creds="LE" img={chel} />
                    <p>{(v.address as string).substring(0, 8)}</p>
                  </div>
                  <div className={styles.home_sec2_list_item_mid}>{(v.sumOfBet as number).toFixed(2)}</div>
                  <button>
                    <img src={persPlus} alt="persPlus" />
                    Join
                  </button>
                </div>
              ))}

            {/* {[1, 2, 3].map((_v, i) => (
              <div
                key={team2 + "_" + i}
                className={cx([
                  styles.home_sec2_list_item,
                  styles.home_sec2_listv2_item,
                  i !== 0 ? styles.home_sec2_list_notActive : "",
                ])}
              >
                <div className={styles.home_sec2_list_item_left}>
                  <AvatarImage creds="LE" img={chel} />
                  <p>Din S</p>
                </div>
                <div className={styles.home_sec2_list_item_mid}>0.0456</div>
                <button>
                  <img src={persPlus} alt="persPlus" />
                  Join
                </button>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
}

interface IPrevGame {
  md5: string;
  timestamp: number;
  teamWin: string;
  isWin: boolean;
  sumOfBet: number;
}

function getMockedUsers(curTime: number, finishTS: number) {
  const users = [];
  for (let i = curTime; i < 60; i++) {
    for (let idx = 0; idx < (i * 2) % 12; idx++) {
      const u = getMockUser(+`${i}${idx}`, i, finishTS);
      if (users.findIndex((v) => v.sumOfBet === u.sumOfBet) === -1) {
        users.push(u);
      }
    }
  }

  return users;
}

function getMockUser(id: number, i: number, finishTS: number) {
  return {
    id,
    color: i < 14 ? Number(i % 2 === 0) : Number(i % 3 !== 2),
    address: "0x*****",
    sumOfBet: (finishTS % (167 * i)) + ((i * 2543) % 10000) + i * 11,
  };
}
