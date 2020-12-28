import React from "react";
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
import { useAuth } from "./shared/hooks/auth-hooks";

// AIzaSyBUg5GaeCRZVs7KrcOTRnPplvfojXeBUa0

const App = () => {
  const { userID, token, login, logout } = useAuth();

  const routes = token ? (
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
          userID: userID,
          token: token,
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
