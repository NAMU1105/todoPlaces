import React, { useCallback, useReducer } from "react";

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsAllValid = true;
      // console.log(action);
      // console.log(state);

      for (const inputId in state.inputs) {
        if (inputId === action.id) {
          formIsAllValid = formIsAllValid && action.isValid;
        } else {
          formIsAllValid = formIsAllValid && state.inputs[inputId].isValid;
        }
      }

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
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialValue,
    areValid: initialFormValidity,
  });

  const inputHandler = useCallback((id, value, isValid) => {
    console.log(id, value, isValid);

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

  return [formState, inputHandler, setFormData];
};
