import { useCallback, useReducer } from "react";

// let isLogin = true;
// console.log(`isLogin: `, isLogin);

const formReducer = (state, action) => {
  // console.log("action: ", action);
  // console.log("state: ", state);

  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsAllValid = true;

      for (const inputId in state.inputs) {
        // console.log("inputId: ", inputId);
        // console.log(state.inputs[inputId]);
        // console.log("action.id: ", action.id);
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.id) {
          formIsAllValid = formIsAllValid && action.isValid;
        } else {
          // if (
          //   (state.inputs["type"] === "LOGIN" && inputId === "name") ||
          //   (state.inputs["type"] === "LOGIN" && inputId === "image") ||
          //   inputId === "type"
          // ) {
          //   console.log("here");
          //   continue;
          // }

          formIsAllValid = formIsAllValid && state.inputs[inputId].isValid;
        }
      }
      // console.log("state: ", state);
      // console.log("formIsAllValid: ", formIsAllValid);

      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.id]: {
            value: action.val,
            isValid: action.isValid,
          },
        },
        areValid: formIsAllValid,
      };

    case "SET_DATA":
      return {
        inputs: action.inputs,
        areValid: action.areValid,
      };

    default:
      return state;
  }
};

export const useForm = (initialValue, initialFormValidity) => {
  // console.log("initialValue: ", initialValue);
  // console.log("initialFormValidity: ", initialFormValidity);

  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialValue,
    areValid: initialFormValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    // console.log(id, value, isValid);

    dispatch({
      type: "INPUT_CHANGE",
      id: id,
      val: value,
      isValid: isValid,
    });
  }, []);

  const setFormData = useCallback((initialValue, initialFormValidity) => {
    // console.log(id, value, isValid);

    dispatch({
      type: "SET_DATA",
      inputs: initialValue,
      areValid: initialFormValidity,
    });
  }, []);

  // const changeAuthType = (value) => {
  //   console.log(`changeAuthType, isLoginMode: `, value);
  //   isLogin = value;
  //   console.log(`isLogin: `, isLogin);
  // };

  return [formState, inputHandler, setFormData];
};
