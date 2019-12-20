import React from "react";
import {
  Modal,
  createStyles,
  makeStyles,
  Theme,
  Button
} from "@material-ui/core";
import { IEvents } from "../Model/eventData.model";

interface ITicketModalProps {
  open: boolean;
  handleClose: () => void;
  data: IEvents;
  transaction: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper1: {
      position: "absolute",
      width: 600,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(4, 6, 6, 8)
      //   [theme.breakpoints.down("sm")]: {
      //     width: 300,
      //     height: 650
      //   }
    }
  })
);

const TicketBuyingModal: React.FC<ITicketModalProps> = (
  props: ITicketModalProps
) => {
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
  // const transaction = (data: any) => {
  //   // const bool = walletConnectService.transaction();
  //   // console.log(bool);
  //   if (walletConnectService.transaction() === false) {
  //     walletConnectService.issueTicket(data);
  //   }
  // };
  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={props.open}
      onClose={props.handleClose}
    >
      <div style={getModalStyle()} className={classes.paper1}>
        <div className="table-responsive">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>{props.data.name}</td>
                <td>{props.data.location}</td>
                <td>{props.data.Date}</td>
                <td>
                  <Button
                    aria-controls="customized-menu"
                    aria-haspopup="true"
                    variant="contained"
                    color="primary"
                    onClick={e => props.transaction()}
                  >
                    Confirm
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
};

export default TicketBuyingModal;
