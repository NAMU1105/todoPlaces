import React from "react";
import { Link } from "react-router-dom";

import Card from "../../shared/components/UIElements/card";
import Avatar from "../../shared/components/UIElements/avatar";

import styles from "./userItem.module.css";

let place = "places";

const UserItem = ({ id, name, image, placeCount }) => {
  if (placeCount === 0 || placeCount === 1) {
    place = "place";
  } else {
    place = "places";
  }

  return (
    <li className={styles.item}>
      <Card className={styles.content}>
        <Link to={`/${id}/places`}>
          <div className={styles.img}>
            <Avatar image={image} alt={name} />
          </div>
          <div className={styles.info}>
            <h2>{name}</h2>
            <h3>{`${placeCount} ${place}`}</h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
