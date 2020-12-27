import React from "react";
import { Link } from "react-router-dom";

import styles from "./button.module.css";

const Button = (props) => {
  if (props.href) {
    return (
      <a
        className={`${styles.button} ${props.size || "default"} ${
          props.inverse && styles.inverse
        } ${props.danger && styles.danger}`}
        href={props.href}
        style={props.style}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={`${styles.button} ${props.size || "default"} ${
          props.inverse && styles.inverse
        } ${props.danger && styles.danger}`}
        style={props.style}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={`${styles.button} ${props.size || "default"} ${
        props.inverse && styles.inverse
      } ${props.danger && styles.danger}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
      style={props.style}
    >
      {props.children}
    </button>
  );
};

export default Button;
