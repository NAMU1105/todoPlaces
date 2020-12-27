import React from "react";

import { URL_BASE } from "../../util/urls";

import styles from "./avatar.module.css";

const Avatar = ({ className, style, image, alt, width }) => {
  return (
    <div className={`${styles.avatar} ${className}`} style={style}>
      <img
        src={`${URL_BASE}${image}`}
        alt={alt}
        style={{ width: width, height: width }}
      />
    </div>
  );
};

export default Avatar;
