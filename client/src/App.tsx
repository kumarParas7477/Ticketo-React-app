import React from "react";

import "./App.css";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";

const App: React.FC = (props: any) => {
  return (
    <div className="App">
      <div>{props.children}</div>
    </div>
  );
};

export default App;
