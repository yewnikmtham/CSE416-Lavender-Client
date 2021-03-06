import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import Badge_1 from "../images/Seed.png";
import Badge_2 from "../images/Sprout_badge.png";
import Badge_3 from "../images/Seedling.png";
import Badge_4 from "../images/Blossom.png";
import * as constants from "../components/constants";

const useStyles = makeStyles((theme) => ({
  pointCards: {
    marginTop: theme.spacing(2),
    width: "100%",
    flexWrap: "wrap",
    flexGrow: 1,
    direction: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  cardItems: {
    display: "inline-flex",
    float: "center",
    alignItems: "center",
  },
  cards: {
    display: "inline-block",
    float: "center",
    width: theme.spacing(80),
    height: theme.spacing(25),
    paddingTop: theme.spacing(3),
    borderRadius: 15,
  },
  badges: {
    paddingLeft: theme.spacing(2),
  },
}));

export default function PointCard(props) {
  const classes = useStyles();
  const [state, setState] = useState({
    platform_name: "",
  });
  const copyState = () => {
    const c = {};
    c.platform_name = state.platform_name;
    return c;
  };
  const displayBadges = (points) => {
    if (points > 49) {
      return (
        <div>
          <Tooltip title="Congrats! You started quizzes on this platform. This is your start as a promising seed!">
            <img height="100" width="100" src={Badge_1} alt={Badge_1} />
          </Tooltip>
          <Tooltip title="Congrats! You earned 10 points. You've grown to be a sprout!">
            <img height="100" width="100" src={Badge_2} alt={Badge_2} />
          </Tooltip>
          <Tooltip title="Congrats! You earned 20 points. You're a growing plant!">
            <img height="100" width="100" src={Badge_3} alt={Badge_3} />
          </Tooltip>
          <Tooltip title="Congrats! You earned 50 points. You are now a blossomed lavendar!">
            <img height="100" width="100" src={Badge_4} alt={Badge_4} />
          </Tooltip>
        </div>
      );
    } else if (points > 19) {
      return (
        <div>
          <Tooltip title="Congrats! You started quizzes on this platform. This is your start as a promising seed!">
            <img height="100" width="100" src={Badge_1} alt={Badge_1} />
          </Tooltip>
          <Tooltip title="Congrats! You earned 10 points. You've grown to be a sprout!">
            <img height="100" width="100" src={Badge_2} alt={Badge_2} />
          </Tooltip>
          <Tooltip title="Congrats! You earned 20 points. You're a growing plant!">
            <img height="100" width="100" src={Badge_3} alt={Badge_3} />
          </Tooltip>
        </div>
      );
    } else if (points > 9) {
      return (
        <div>
          <Tooltip title="Congrats! You started quizzes on this platform. This is your start as a promising seed!">
            <img height="100" width="100" src={Badge_1} alt={Badge_1} />
          </Tooltip>
          <Tooltip title="Congrats! You earned 10 points. You've grown to be a sprout!">
            <img height="100" width="100" src={Badge_2} alt={Badge_2} />
          </Tooltip>
        </div>
      );
    } else if (points > 0) {
      return (
        <div>
          <Tooltip title="Congrats! You started quizzes on this platform. This is your start as a promising seed!">
            <img height="100" width="100" src={Badge_1} alt={Badge_1} />
          </Tooltip>
        </div>
      );
    }
  };
  useEffect(() => {
    axios
      .get(`${constants.API_PATH}/platform/${props.platform_id}`)
      .then((res) => {
        if (res.status === 200) {
          const new_state = copyState();
          new_state.platform_name = res.data.platform_name;
          setState(new_state);
        }
      });
  }, []);
  return (
    <Box>
      <Grid container spacing={3} className={classes.pointCards}>
        <Grid item className={classes.cardItems} item xs={10} md={10}>
          <Card
            className={classes.cards}
            variant="outlined"
            sx={{ backgroundColor: "white" }}
          >
            <CardContent>
              <Typography align="center">{`Platform_id:${state.platform_name}`}</Typography>
              <Typography align="center">{`Points:${props.points}`}</Typography>
              <Box className={classes.badges}>
                {displayBadges(props.points)}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
