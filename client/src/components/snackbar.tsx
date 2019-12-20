import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MySnackbarContentWrapper from "./MySnackBar";

const useStyles2 = makeStyles((theme: Theme) => ({
  margin: {
    margin: theme.spacing(1)
  }
}));
interface IMySnackBarProps {
  className: string;
  open: boolean;
  message: string;
  handleClose: () => void;
  onClose: () => void;
  variation: "error" | "success" | "warning" | "info";
}

const CustomizedSnackbars: React.FC<IMySnackBarProps> = (
  props: IMySnackBarProps
) => {
  const classes = useStyles2();

  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={props.open}
        autoHideDuration={6000}
        onClose={props.handleClose}
      >
        <MySnackbarContentWrapper
          onClose={props.handleClose}
          variant={props.variation}
          message={props.message}
          className={props.className}
        />
      </Snackbar>
    </div>
  );
};
export default CustomizedSnackbars;
