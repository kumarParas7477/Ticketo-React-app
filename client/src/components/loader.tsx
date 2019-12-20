import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
import { RouteComponentProps, withRouter } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      "& > * + *": {
        marginLeft: theme.spacing(2)
      },
      zIndex: 9999,
      opacity: 0.8
    }
  })
);

const CircularIndeterminate: React.FC<RouteComponentProps> = (props: any) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <strong>Your Profile is getting Loaded ....</strong>{" "}
      <LinearProgress variant="query" color="secondary" />
    </div>
  );
};
export default withRouter(CircularIndeterminate);
