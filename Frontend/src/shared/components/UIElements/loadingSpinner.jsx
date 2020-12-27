import React from "react";

import styles from "./loadingSpinner.module.css";

const LoadingSpinner = (props) => {
  return (
    <div className={`${props.asOverlay && styles.overlay}`}>
      <div className={styles.dualLing}></div>
    </div>
  );
};

export default LoadingSpinner;
