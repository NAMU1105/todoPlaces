import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/input";
import Card from "../../shared/components/UIElements/card";
import Button from "../../shared/components/FormElements/button";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";
import Modal from "../../shared/components/UIElements/modal";
import Backdrop from "../../shared/components/UIElements/backdrop";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { URL_PLACE_BASE } from "../../shared/util/urls";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hooks";

import styles from "./placeForm.module.css";

// const DUMMY_PLACES = [
//   {
//     id: "p1",
//     title: "Empire State Building",
//     description: "One of the most famous sky scrapers in the world!",
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creator: "u1",
//   },
//   {
//     id: "p2",
//     title: "나무나무나문",
//     description: "One of the most famous sky scrapers in the world!",
//     imageUrl:
//       "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
//     address: "20 W 34th St, New York, NY 10001",
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584,
//     },
//     creator: "u2",
//   },
// ];

const UpdatePlace = (props) => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedPlace, setLoadedPlace] = useState();

  const placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      //   address: {
      //     value: identifiedPlace.adress,
      //     isValid: true,
      //   },
    },
    false
  );

  // const identifiedPlace = DUMMY_PLACES.find((place) => place.id === placeId);
  //   console.log(`identifiedPlace: `, identifiedPlace.title);

  const getPlace = async () => {
    console.log("getplace");
    setIsLoading(true);

    try {
      const response = await fetch(`${URL_PLACE_BASE}${placeId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      console.log(responseData.place);
      setIsLoading(false);
      setLoadedPlace(responseData.place);
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.log(error);
    }
  };
  useEffect(() => {
    // console.log("useeffect");
    getPlace();
  }, []);

  useEffect(() => {
    console.log("useeffect");

    if (loadedPlace) {
      console.log("loadedPlace: ", loadedPlace);
      setFormData(
        {
          title: {
            value: loadedPlace.title,
            isValid: true,
          },
          description: {
            value: loadedPlace.description,
            isValid: true,
          },
        },
        true
      );
      setIsLoading(false);
    }
  }, [loadedPlace, setFormData]);

  const errorHandler = () => {
    setError(null);
  };

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState);

    setIsLoading(true);
    try {
      const response = await fetch(`${URL_PLACE_BASE}${placeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // 항상 json포맷이어야 한다.
        body: JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message);
      }

      // console.log("login success");
      setIsLoading(false);
      // history.push("/");
      history.push(`/${auth.userID}/places`);

      // console.log(formState);
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.log(error);
    }
  };

  if (!loadedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="center">
        <h2>Loading...</h2>
      </div>
    );
  }

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

      {!isLoading && loadedPlace && (
        <form className={styles.form} onSubmit={placeSubmitHandler}>
          <Input
            id="title"
            element="input"
            label="Title"
            type="text"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={formState.inputs.title.isValid}
            // initialValue={formState.inputs.title.value}
          />

          <Input
            id="description"
            element="textarea"
            label="description"
            rows="5"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            // initialValue={formState.inputs.description.value}
            initialValid={formState.inputs.description.isValid}
          />
          <Button disabled={!formState.areValid}>UPDATE PLACE</Button>
        </form>
      )}
    </>
  );
};

export default UpdatePlace;
