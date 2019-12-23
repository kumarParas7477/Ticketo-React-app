import React from "react";

import {
  createStyles,
  makeStyles,
  Theme,
  withStyles
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Button, Menu, MenuItem, MenuProps } from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1
    },
    root: {
      flexGrow: 1
    }
  })
);
const StyledMenu = withStyles({
  paper: {
    border: "1px solid green"
  }
})((props: MenuProps) => (
  <Menu
    elevation={6}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center"
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center"
    }}
    {...props}
  />
));
const StyledMenuItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.secondary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(MenuItem);

interface IAppBarProps {
  account: string;
  login: () => void;
  logout: () => void;
  verify: () => void;
  flagForLogin: boolean;
}

const AppBarComponent: React.FC<IAppBarProps> = (props: IAppBarProps) => {
  //   const classes = useStyles();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const logout = () => {
  //   WalletConnectService.disconnectWallet();
  //   setName("Login");
  // };
  // const verify = () => {
  //   WalletConnectService.VerifyTicket();
  // };

  const verifyDisable = () => {
    if (props.account === "Login") {
      return true;
    } else return false;
  };
  return (
    <div className={classes.root}>
      <AppBar position="fixed" style={{ color: "green" }}>
        <Toolbar variant="dense">
          <Typography variant="h3" style={{ color: "black" }}>
            <strong>TICKETO!</strong>
          </Typography>
          <div className={classes.grow} />
          <Button
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            color="inherit"
            onClick={e => props.verify()}
            disabled={verifyDisable()}
            style={{ marginRight: 10 }}
          >
            <strong style={{ color: "primary" }}>VERIFY_TICKET</strong>
          </Button>{" "}
          {props.account === "Login" ? (
            <Button
              aria-controls="customized-menu"
              aria-haspopup="true"
              variant="contained"
              color="inherit"
              onClick={e => props.login()}
              disabled={!props.flagForLogin}
            >
              <strong style={{ color: "black" }}>{props.account}</strong>
            </Button>
          ) : (
            <div>
              <Button
                aria-controls="customized-menu"
                aria-haspopup="true"
                variant="contained"
                color="inherit"
                onClick={handleClick}
              >
                <strong style={{ color: "green" }}>
                  {" "}
                  {props.account.substr(0, 4)}...{props.account.substr(-4, 4)}
                </strong>
              </Button>

              <StyledMenu
                id="customized-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <StyledMenuItem>
                  <div onClick={e => props.logout()}>
                    <ListItemIcon>
                      <ExitToAppIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </div>
                </StyledMenuItem>
              </StyledMenu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default AppBarComponent;
