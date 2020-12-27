import React, { useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

import Auth from "./user/pages/auth";
import UdatePlaces from "./places/pages/updatePlace";
import MainNavigation from "./shared/components/Navigation/mainNavigation";
import NewPlace from "./places/pages/newPlace";
import Users from "./user/pages/users";
import UserPlaces from "./places/pages/userPlaces";

import { AuthContext } from "./shared/context/auth-context";

// AIzaSyBUg5GaeCRZVs7KrcOTRnPplvfojXeBUa0

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userID, setUserID] = useState();

  console.log(`isLoggedIn:`, isLoggedIn);
  const login = useCallback((uid) => {
    setIsLoggedIn(true);
    setUserID(uid);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserID(null);
  }, []);

  const routes = isLoggedIn ? (
    <Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Route path="/places/new" exact>
        <NewPlace />
      </Route>
      <Route path="/:userId/places" exact>
        <UserPlaces />
      </Route>
      <Route path="/:places/:placeId" exact>
        <UdatePlaces />
      </Route>
      <Redirect to="/" />
    </Switch>
  ) : (
    <Switch>
      <Route path="/" exact>
        <Users />
      </Route>
      <Route path="/auth" exact>
        <Auth />
      </Route>
      <Route path="/:userId/places" exact>
        <UserPlaces />
      </Route>
      <Redirect to="/auth" />
    </Switch>
  );

  return (
    <>
      <AuthContext.Provider
        value={{
          isLoggedIn: isLoggedIn,
          userID: userID,
          login: login,
          logout: logout,
        }}
      >
        <Router>
          <MainNavigation />
          <main>{routes}</main>
        </Router>
      </AuthContext.Provider>
    </>
  );
};

export default App;
