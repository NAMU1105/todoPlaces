import React from "react";

import UserItem from "../components/userItem";

import styles from "./userList.module.css";

const UserList = ({ items }) => {
  return (
    <ul className={styles.userList}>
      {items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UserList;
