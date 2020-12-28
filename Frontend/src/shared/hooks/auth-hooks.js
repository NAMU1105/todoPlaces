import { useState, useCallback, useRef, useEffect } from "react";
let logoutTimer;

export const useAuth = () => {
  //   const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState();
  const [token, setToken] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  useEffect(() => {
    const storageToken = JSON.parse(localStorage.getItem("userData"));
    // console.log(`storageToken: `, storageToken);
    if (storageToken) {
      //   setIsLoggedIn(true);
      setUserID(storageToken.userId);
      setToken(storageToken.token);
      //   const tokenExpirationDate =
      //  new Date(new Date().getTime() + 1000 * 10);
      //      //  new Date(new Date().getTime() + 1000 * 60 * expirationHour * HOUR);
      const expirationDate = new Date(storageToken.expiration);
      console.log(`expirationDate:`, expirationDate);
      setTokenExpirationDate(expirationDate);
      // setTokenExpirationDate(storageToken.expiration);
    }
  }, []);

  // console.log(`isLoggedIn:`, isLoggedIn);
  const login = useCallback(({ userId, token, expirationDate }) => {
    // console.log(`userId: `, userId);
    // setIsLoggedIn(true);
    setUserID(userId);
    setToken(token);
    // save token in localStorage
    // localStorage.setItem("token", token);
    // const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 10);
    // // //  expirationDate||new Date(new Date().getTime() + 1000 * 60  * HOUR );
    // console.log(`tokenExpirationDate:`, tokenExpirationDate);
    // const test = Date.parse(expirationDate);
    expirationDate = new Date(expirationDate);
    console.log(`expirationDate:`, expirationDate);
    // console.log(`expirationDate test:`, test);

    // setTokenExpirationDate(expirationDate);
    setTokenExpirationDate(expirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userId,
        token: token,
        // expiration: expirationDate,
        expiration: expirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    // setIsLoggedIn(false);
    setUserID(null);
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  // Timer
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      // console.log(`remainingTime:`, remainingTime);
      logoutTimer = setTimeout(logout, remainingTime);
      // console.log(`logoutTimer:`, logoutTimer);
    } else {
      clearTimeout(logoutTimer);
    }
  });
  // }, [token, logout, tokenExpirationDate]);

  return { userID, token, tokenExpirationDate, login, logout };
};
