import * as React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import App from "../App";
import HomeComponent from "./home";
import WelcomeComponent from "./welcome";
import { makeStyles, createStyles } from "@material-ui/styles";
import { Theme } from "pretty-format/build/types";

const AppRouter: React.FC = () => {
  return (
    <App>
      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css"
      ></link>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/js/bootstrap.min.js"></script>
      <Router>
        <Route path="/" component={WelcomeComponent} exact />
        <Route exact path="/home" component={HomeComponent} />
      </Router>
    </App>
  );
};
export default AppRouter;
