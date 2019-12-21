import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Button, Modal, Grid } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper1: {
      position: "absolute",
      width: 600,
      backgroundColor: "grey",
      border: "10px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(4, 6, 6, 8),
         [theme.breakpoints.down("sm")]: {
          width: 300
    
        }
    }
  })
);
const WelcomeComponent: React.FC<RouteComponentProps> = (props: any) => {
  const classes = useStyles();
  const getModalStyle = () => {
    const top = 50;
    const left = 50;
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    };
  };
  const [open, setOpen] = React.useState(true);
  const begin = () => {
    props.history.push("/home");
  };
  const handleClose = () => {
    setOpen(true);
  };
  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClose={handleClose}
    >
      <div style={getModalStyle()} className={classes.paper1}>
        <Grid container direction="row">
          <Grid item xs={8}>
            <strong>
              {" "}
              <h3> Welcome to Ticketo! </h3>{" "}
            </strong>
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained" color="primary" onClick={e => begin()}>
              <ExitToAppIcon fontSize="small" />
              <h6> Lets Begin! </h6>
            </Button>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};
export default withRouter(WelcomeComponent);
