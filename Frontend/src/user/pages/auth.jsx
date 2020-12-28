import React, { useContext, useState } from "react";

import Card from "../../shared/components/UIElements/card";
import Input from "../../shared/components/FormElements/input";
import ImageUpload from "../../shared/components/FormElements/imageUpload";
import Button from "../../shared/components/FormElements/button";
import Modal from "../../shared/components/UIElements/modal";
import Backdrop from "../../shared/components/UIElements/backdrop";
import LoadingSpinner from "../../shared/components/UIElements/loadingSpinner";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { URL_LOGIN, URL_SIGNUP } from "../../shared/util/urls.js";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hooks.js";
// import { useHttpClient } from "../../shared/hooks/http-hooks";

import styles from "./auth.module.css";

const LOGIN = "LOGIN";
const SIGNUP = "SIGNUP";

const Auth = (props) => {
  // const { isLoading, error, sendRequest, clearError } = useHttpClient();
  // const { formState, inputHandler, setFormData } = useForm();

  const auth = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // const [authType, setAuthType] = useState(LOGIN);
  const [isLoginMode, setIsLoginMode] = useState(true);
  // const [modalIsOpen, setModalOpen] = useState(false);

  const [formState, inputHandler, setFormData] = useForm(
    {
      // type: authType,
      // name: {
      //   value: "",
      //   isValid: false,
      // },
      // image: {
      //   value: "",
      //   isValid: false,
      // },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      // console.log("로그인으로 전환!");
      setFormData(
        {
          ...formState.inputs,
          // Drop irrelevant input fields
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );

      // changeAuthType(true);
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
      // changeAuthType(false);
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    // console.log(formState);

    setIsLoading(true);

    if (isLoginMode) {
      try {
        const response = await fetch(URL_LOGIN, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // 항상 json포맷이어야 한다.
          body: JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
        });
        const responseData = await response.json();
        // 200일 경우에만 로그인 되도록 하는 예외처리
        if (!response.ok) {
          throw new Error(responseData.message);
        }

        // console.log("login success");
        setIsLoading(false);
        // auth.login(responseData.user.id);
        // console.log(`responseData.userId: `, responseData.userId);

        auth.login({
          userId: responseData.userId,
          token: responseData.token,
          expirationDate: responseData.expirationDate,
        });
      } catch (error) {
        setIsLoading(false);
        setError(error);
        console.log(error);
      }
    } else {
      // 회원가입일 경우 SIGN UP
      try {
        const formData = new FormData();
        formData.append("email", formState.inputs.email.value);
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const response = await fetch(URL_SIGNUP, {
          method: "POST",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          // 파일은 json포맷에 담을 수 없음, formData에 담아야 함
          body: formData,
        });

        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        // console.log(`responseData: `, responseData);
        setIsLoading(false);
        auth.login({ userId: responseData.userId, token: responseData.token });
        // auth.login(responseData.user.id);
        // console.log(formState);
      } catch (error) {
        setIsLoading(false);
        setError(error);
        // console.log(error);
      }
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
      <Card className={styles.authentication}>
        {isLoading && <LoadingSpinner asOverlay />}
        <h1>{isLoginMode ? LOGIN : SIGNUP}</h1>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <>
              <Input
                id="name"
                element="input"
                label="Name"
                type="text"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter your name"
                onInput={inputHandler}
              />

              <ImageUpload
                center
                onInput={inputHandler}
                id="image"
                errorText="Please provide an image."
              />
            </>
          )}
          <Input
            id="email"
            element="input"
            label="Email"
            type="text"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter valid email"
            onInput={inputHandler}
          />
          <Input
            id="password"
            element="input"
            label="Password"
            type="password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter valid password(at least 6 characters)"
            // validators={[VALIDATOR_MINLENGTH(5), VALIDATOR_MAXLENGTH(20)]}
            // errorText="Please enter valid password(at least 5 to max 20 characters)"
            onInput={inputHandler}
            offAutoComplete="off"
          />
          <div className={styles.buttonContainer}>
            <Button
              type="submit"
              disabled={!formState.areValid}
              style={{
                marginRight: 0 + "rem",
                marginBottom: 1.5 + "rem",
                marginTop: 0.5 + "rem",
              }}
            >
              {isLoginMode ? LOGIN : SIGNUP}
            </Button>
            <Button
              inverse
              type="button"
              onClick={switchModeHandler}
              style={{ marginRight: 0 + "rem" }}
            >
              SWITCH TO {isLoginMode ? SIGNUP : LOGIN}
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default Auth;
