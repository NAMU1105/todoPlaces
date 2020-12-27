import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import Button from "../../shared/components/FormElements/button";
import Input from "../../shared/components/FormElements/input";
import ImageUpload from "../../shared/components/FormElements/imageUpload";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";
import Modal from "../../shared/components/UIElements/modal";
import Backdrop from "../../shared/components/UIElements/backdrop";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { URL_CREATE_PLACE } from "../../shared/util/urls";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hooks";

import styles from "./placeForm.module.css";

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      image: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    // console.log(event);
    console.log(formState);

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("creator", auth.userID);

      const response = await fetch(URL_CREATE_PLACE, {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: formData,
        //  JSON.stringify({
        //   title: formState.inputs.title.value,
        //   description: formState.inputs.description.value,
        //   address: formState.inputs.address.value,
        //   creator: auth.userID,
        // }),
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
      {isLoading && <LoadingSpinner asOverlay />}

      <form className={styles.form} onSubmit={placeSubmitHandler}>
        <Input
          id="title"
          element="input"
          label="Title"
          type="text"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
        />
        <ImageUpload
          center
          onInput={inputHandler}
          id="image"
          errorText="Please provide an image."
        />
        <Input
          id="description"
          element="textarea"
          label="description"
          rows="5"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
        />
        <Input
          id="address"
          element="input"
          label="Address"
          type="text"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
        />
        <Button disabled={!formState.areValid}>submit</Button>
      </form>
    </>
  );
};

export default NewPlace;
