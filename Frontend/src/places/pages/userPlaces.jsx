import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/placeList";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";
import Modal from "../../shared/components/UIElements/modal";
import Backdrop from "../../shared/components/UIElements/backdrop";
import Button from "../../shared/components/FormElements/button";

import { URL_GET_PLACE_BY_USER_ID } from "../../shared/util/urls";

const UserPlaces = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadedPlaces, setLoadedPlaces] = useState();

  const userId = useParams().userId;
  // console.log(`userId: `, userId);
  // const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);

  const getPlaces = async () => {
    // console.log("getplaces");
    setIsLoading(true);

    try {
      const response = await fetch(`${URL_GET_PLACE_BY_USER_ID}${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      setLoadedPlaces(responseData.places);
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      // console.log(responseData);
      setIsLoading(false);
      setLoadedPlaces(responseData.places);
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.log(error);
    }
  };

  useEffect(() => {
    // console.log("useeffect");
    getPlaces();
  }, []);

  const errorHandler = () => {
    setError(null);
  };

  const deleteHandler = (pid) => {
    console.log(`delete pid: `, pid);
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== pid)
    );
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
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDelete={deleteHandler} />
      )}
    </>
  );
};

export default UserPlaces;
