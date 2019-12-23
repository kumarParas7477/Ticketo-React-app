import React from "react";
import {
  Theme,
  createStyles,
  makeStyles,
  useTheme
} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { maxHeight } from "@material-ui/system";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      display: "flex",
      margin: 20,
      border: "5px solid grey",
      borderRadius: "25px",
      Height: 200
    },
    details: {
      display: "flex",
      flexDirection: "column"
    },
    content: {
      flex: "1 0 auto"
    },
    cover: {
      height: 200,
      width: 200
    },
    controls: {
      display: "flex",
      alignItems: "center",
      paddingLeft: theme.spacing(1),
      paddingBottom: theme.spacing(1)
    }
  })
);
interface IEventCard {
  name: string;
  location: string;
  date: string;
  book: () => void;
  gotProfile: boolean;
  connected: boolean;
  address: string;
  img: string;
}

const EventCard: React.FC<IEventCard> = (props: IEventCard) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <div className="col-lg-4 col-md-4 col-sm-4">
      <Card className={classes.card}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h5">
              <strong>{props.name}</strong>
            </Typography>
            <Typography variant="h6" color="textSecondary">
              <strong>{props.location}</strong>
            </Typography>
            <Typography variant="h6" color="textSecondary">
              <strong> {props.date}</strong>
            </Typography>
            <Typography variant="h6" color="textSecondary">
              <strong> 0.0001(ETH)</strong>
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            {new Date(props.date) > new Date() ? (
              <Button
                variant="contained"
                color="primary"
                onClick={e => props.book()}
                disabled={
                  !props.gotProfile && props.address !== "" && props.connected
                }
              >
                Buy One!
              </Button>
            ) : (
              <strong>Event Passed</strong>
            )}
          </div>
        </div>
        <CardMedia
          className={classes.cover}
          image={props.img}
          title="Live from space album cover"
        />
      </Card>
    </div>
  );
};
export default EventCard;
