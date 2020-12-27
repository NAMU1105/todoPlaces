import React, { useEffect, useState } from "react";

import { URL_GET_USERS } from "../../shared/util/urls";

import UserList from "../components/userList";
import Backdrop from "../../shared/components/UIElements/backdrop";
import Button from "../../shared/components/FormElements/button";
import Modal from "../../shared/components/UIElements/modal";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";

// const USERS = [
//   {
//     id: "u1",
//     name: "Max Schwarz",
//     image:
//       "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//     places: 3,
//   },
//   {
//     id: "u2",
//     name: "Namu Cho",
//     image:
//       "https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
//     places: 5,
//   },
// ];

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedUsers, setLoadedUsers] = useState();

  const getUsers = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(URL_GET_USERS, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);
      setLoadedUsers(responseData.users);
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.log(error);
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <section>
      {error && (
        <>
          <Backdrop onClick={errorHandler} />
          <Modal
            header="An Error occurred!"
            footer={<Button onClick={errorHandler}>CLOSE</Button>}
          >
            <h2>{error.message}</h2>
          </Modal>
        </>
      )}
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && loadedUsers && <UserList items={loadedUsers} />}
    </section>
  );
};

export default Users;
