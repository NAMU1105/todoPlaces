import React from "react";
import styles from "./mainHeader.module.css";

const MainHeader = (props) => {
  return <header className={styles.header}>{props.children}</header>;
};

export default MainHeader;
