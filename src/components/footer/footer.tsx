/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import styles from "./footer.module.scss";

const items = [
  {
    path: "tos",
    title: "Terms of Service",
  },
  {
    path: "pp",
    title: "Privacy Policy",
  },
  {
    path: "cookies",
    title: "Cookies",
  },
];

export default function Footer() {
  return <div className={styles.footer}>Tokenflip | Flip the coin | 2023</div>;
}
