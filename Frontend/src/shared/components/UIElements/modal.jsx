import React from "react";
import ReactDOM from "react-dom";
// import Button from "../FormElements/button";

import Map from "./map";

import styles from "./modal.module.css";

const Modal = (props) => {
  return ReactDOM.createPortal(
    <div className={styles.modal}>
      <header className={styles.header}>
        <h2>{props.header}</h2>
      </header>
      <div className={styles.content}>
        {props.map && (
          <div className={styles.mapContainer}>
            <Map center={props.center} zoom={props.zoom} />
          </div>
        )}
        {props.children}
      </div>
      <footer className={styles.footer}>{props.footer}</footer>
    </div>,
    document.getElementById("modal-hook")
  );
};

export default Modal;
