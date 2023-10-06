import cx from "classnames";
import { useState } from "react";
import styles from "./avi.module.scss";

export default function AvatarImage(props) {
  const { className, img, creds } = props;
  const [isError, setIsError] = useState(false);

  return (
    <div className={cx([styles.profilePic, className, styles.empty])}>
      {img ? <img src={img} onError={() => setIsError(true)} alt="Profile" /> : creds}
    </div>
  );
}
