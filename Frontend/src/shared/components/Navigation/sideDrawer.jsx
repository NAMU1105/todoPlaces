import React from "react";
import ReactDOM from "react-dom";
import styles from "./sideDrawer.module.css";

const SideDrawer = (props) => {
  let content = null;
  if (props.show) {
    content = (
      <aside className={styles.drawer} onClick={props.onClick}>
        {props.children}
      </aside>
    );
  }
  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};
export default SideDrawer;
