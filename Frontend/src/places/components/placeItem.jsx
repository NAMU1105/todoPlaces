import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";

import Card from "../../shared/components/UIElements/card";
import Modal from "../../shared/components/UIElements/modal";
import Backdrop from "../../shared/components/UIElements/backdrop";
import Button from "../../shared/components/FormElements/button";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";

import { AuthContext } from "../../shared/context/auth-context";
import { URL_PLACE_BASE } from "../../shared/util/urls";
import { URL_BASE } from "../../shared/util/urls";

import styles from "./placeItem.module.css";
let inMounted = false;
let count = 0;

const PlaceItem = ({
  id,
  title,
  description,
  imageUrl,
  address,
  location,
  onDelete,
}) => {
  const auth = useContext(AuthContext);
  const userId = useParams().userId;

  const [modalIsOpen, setModalOpen] = useState(false);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // let count = 0;
  // console.log(`count: `, count);

  useEffect(() => {
    inMounted = true;
    console.log("component did mount, inMounted: ", inMounted);

    // cleanup function을 이용
    return () => {
      inMounted = false;
      console.log("cleanup");
      console.log("component did mount, willUnMounted: ", inMounted);
      // setIsLoading(false);
      // setModalOpen(false);
      // setConfirmModalIsOpen(false);
      // setError(null);
      // console.clear();
      // console.log(modalIsOpen);
      console.log(id);
    };
  }, []);

  const closeModalHanlder = () => setModalOpen(false);

  const openModalHanlder = () => setModalOpen(true);

  const closeConfirmModalHanlder = () => setConfirmModalIsOpen(false);

  const openConfirmModalHanlder = () => {
    // inMounted = true;
    console.log("openConfirmModalHanlder, inMounted: ", inMounted);

    setConfirmModalIsOpen(true);
  };

  const confirmDeleteHandler = async () => {
    setConfirmModalIsOpen(false);
    // count++;
    // console.log(`count: `, count);
    // inMounted = true;
    console.log("confirmDeleteHandler, inMounted: ", inMounted);

    // if (count === 1) {
    // if (inMounted) {
    // if (inMounted && confirmModalIsOpen) {
    console.log("confirmDeleteHandler, inMounted: ", inMounted);
    console.log("delete confirmed");
    // count++;
    onDelete(id);

    setIsLoading(true);

    try {
      const response = await fetch(`${URL_PLACE_BASE}${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      console.log(responseData);

      inMounted && setIsLoading(false);

      // // cancel
      // setIsLoading(false);
      // setModalOpen(false);
      // setConfirmModalIsOpen(false);
      // setError(null);
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.log(error);
    }
    // }
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <>
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
      {modalIsOpen && (
        <>
          <Backdrop onClick={closeModalHanlder} />
          <Modal
            // close={closeModalHanlder}
            center={location}
            map
            zoom={15}
            header={address}
            footer={<Button onClick={closeModalHanlder}>CLOSE</Button>}
          />
        </>
      )}
      {confirmModalIsOpen && (
        <>
          <Backdrop onClick={closeConfirmModalHanlder} />
          <Modal
            // close={closeConfirmModalHanlder}
            header="Are you sure?"
            footer={
              <>
                <Button inverse onClick={closeConfirmModalHanlder}>
                  CANCEL
                </Button>
                <Button danger onClick={confirmDeleteHandler}>
                  DELETE
                </Button>
              </>
            }
          >
            <p>
              Do you want to proceed and delete this place?
              <br />
              Please note that it can't be undone thereafter.
            </p>
          </Modal>
        </>
      )}

      <li className={styles.item} id={id}>
        {isLoading && <LoadingSpinner asOverlay />}
        <Card className={styles.content}>
          <div className={styles.img}>
            <img src={`${URL_BASE}${imageUrl}`} alt={title} />
          </div>
          <div className={styles.info}>
            <h2>{title}</h2>
            <h3>{address}</h3>
            <p>{description}</p>
          </div>
          <div className={styles.action}>
            <Button inverse onClick={openModalHanlder}>
              VIEW ON MAP
            </Button>
            {userId === auth.userID && (
              <>
                <Button to={`/places/${id}`}>EDIT</Button>
                <Button onClick={openConfirmModalHanlder} danger>
                  DELETE
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};
export default PlaceItem;
