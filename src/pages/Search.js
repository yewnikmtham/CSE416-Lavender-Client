import React, { useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Box, Grid, Button } from "@material-ui/core";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import * as constants from "../components/constants";
import PlatformIcon from "../images/platformicon.jpeg";
import Banner from "../images/banner.png";
import Typography from "@mui/material/Typography";
import { createTheme } from "@material-ui/core/styles";

const ttheme = createTheme();
ttheme.spacing(1);

const useStyles = makeStyles((theme) => ({
  homePage: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    flexGrow: 1,
    width: "80vw",
    overflowX: "hidden",
    overflowY: "hidden",
  },
  gridContainer: {
    display: "inline-flex",
    padding: theme.spacing(2),
    paddingLeft: "13%",
    width: "100%",
  },
  gridItem: {
    display: "inline-block",
    marginBottom: theme.spacing(1),
  },
  card: {
    width: theme.spacing(27),
    height: "100%",
  },
}));

function Search(props) {
  const [state, setState] = useState({
    quizzes: null,
    platforms: null,
  });

  const classes = useStyles();
  const history = useHistory();
  const onNavigateQuiz = (e, quiz_id) => {
    history.push(`/quiz/${quiz_id}`);
  };

  const onNavigatePlatform = (e, platform_id) => {
    history.push(`/platform/${platform_id}`);
  };

  useEffect(() => {
    if (!props.match || props.keyword === "") {
      axios
        .get(constants.API_PATH + `/platform`)
        .then((res) => {
          setState({
            quizzes: res.data.quizzes,
            platforms: res.data.platforms,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      axios
        .get(`${constants.API_PATH}/search/${props.match.params.keyword}`)
        .then((res) => {
          setState({
            quizzes: res.data.quizzes,
            platforms: res.data.platforms,
          });
        });
    }
  }, [props]);

  return (
    <Box className={classes.homePage}>
      <Typography variant="h6" mb={1} mt={2} pl={"10%"}>
        QUIZZES
      </Typography>
      <Grid container spacing={4} className={classes.gridContainer}>
        {state.quizzes ? (
          state.quizzes.map((quiz) =>
            quiz.is_published ? (
              <Grid
                item
                className={classes.gridItem}
                key={quiz.quiz_id}
                xs={3}
                md={3}
              >
                <Button onClick={(e) => onNavigateQuiz(e, quiz.quiz_id)}>
                  <Card className={classes.card}>
                    <CardMedia
                      component="img"
                      height="140"
                      width="200"
                      image={
                        quiz.icon_photo === "" || quiz.icon_photo === null
                          ? Banner
                          : quiz.icon_photo
                      }
                    />
                    <CardContent>{quiz.quiz_name}</CardContent>
                  </Card>
                </Button>
              </Grid>
            ) : (
              <></>
            )
          )
        ) : (
          <Grid item></Grid>
        )}
      </Grid>
      <Typography variant="h6" mb={1} pl={"10%"}>
        PLATFORMS
      </Typography>
      <Grid container spacing={4} className={classes.gridContainer}>
        {state.platforms ? (
          state.platforms.map((platform) => (
            <Grid
              item
              className={classes.gridItem}
              key={platform.platform_id}
              xs={3}
              md={3}
            >
              <Button
                onClick={(e) => onNavigatePlatform(e, platform.platform_id)}
              >
                <Card className={classes.card}>
                  <CardMedia
                    component="img"
                    height="140"
                    width="200"
                    image={
                      platform.icon_photo === "" || platform.icon_photo === null
                        ? PlatformIcon
                        : platform.icon_photo
                    }
                  />
                  <CardContent>{platform.platform_name}</CardContent>
                </Card>
              </Button>
            </Grid>
          ))
        ) : (
          <Grid item></Grid>
        )}
      </Grid>
    </Box>
  );
}

export default Search;
