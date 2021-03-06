import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Button,
  FormControl,
  InputBase,
  Grid,
  Typography,
} from "@mui/material";
import { useHistory } from "react-router-dom";
import axios from "axios";
import * as constants from "../components/constants";
import Questions from "../components/Questions";
import Answers from "../components/Answers";

const useStyles = makeStyles((theme) => ({
  QuizContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    width: theme.spacing(120),
  },
  Opt: {
    display: "inline-block",
    width: "60vw",
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    alignItems: "center",
  },
  duration: {
    display: "inline-block",
    float: "left",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: theme.spacing(8),
    backgroundColor: "#7d65c0",
  },
  quizForm: {
    borderRadius: 15,
    borderTopLeftRadius: 15,
  },
  box: {
    backgroundColor: "#F9F9FF",
    marginBottom: "5%",
  },
  noBorder: {
    border: "none",
  },
  quizbody: {
    backgroundColor: "#F9F9FF",
    display: "flex",
  },
  questions: {
    width: "100%",
  },
  answer: {
    display: "flex",
    width: "100%",
  },
  answerWrapper: {
    display: "inline-block",
    paddingLeft: 50,
    paddingRight: 31,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 80,
    fontSize: 22,
  },
  icon: {
    paddignLeft: 10,
    maxHeight: "300px",
    maxWidth: "950px",
  },
}));

const returnStyle = {
  backgroundColor: "#8A8AEE",
  left: "8%",
  marginBottom: 10,
  color: "black",
  width: "80%",
  borderRadius: 20,
  marginTop: 10,
};

export default function QuizResult(props) {
  const [state, setState] = useState({
    platform_id: "",
    platform_title: "",
    quiz_title: "",
    questions: [],
    answers: [],
    selected_answers: [],
  });
  const [time, setTime] = useState(null);
  const [previewSource, setPreviewSource] = useState();
  const [displayUnanswered, setDisplayUnanswered] = useState(false);
  const classes = useStyles();
  const history = useHistory();

  const parseToState = (data) => {
    const platform_id = data.platform.platform_id;
    const platform_title = data.platform.platform_name;
    const title = data.quiz.quiz_name;
    const questions = data.questions.map((q_obj) => q_obj.question_text);
    //const answers = data.answers.map(ansrs => { return { ...ansrs } });
    const answers = data.answers.map((answer_list) =>
      answer_list.map((ans) => {
        return { ...ans };
      })
    );
    const selected_answers = data.selected_answers.slice(0);
    return {
      platform_id: platform_id,
      platform_title: platform_title,
      quiz_title: title,
      questions: questions,
      answers: answers,
      selected_answers: selected_answers,
    };
  };

  useEffect(() => {
    if (props.authenticated) {
      axios
        .post(
          `${constants.API_PATH}/quiz/${props.match.params.quiz_id}/view-results`,
          {
            user_id: props.user_id,
            platform_id: state.platform_id,
          }
        )
        .then((res) => {
          let s = parseToState(res.data);
          setState(s);
          const time_limit = res.data.duration;
          if (time_limit) {
            setTime(time_limit);
          }
          setPreviewSource(res.data.quiz.icon_photo);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      let s = parseToState(props.location.state);
      setDisplayUnanswered(!props.location.state.answered_all_questions);

      const time_limit = props.location.state.duration;
      if (time_limit) {
        setTime(Math.floor(time_limit / 60) + ":" + (time_limit % 60));
      }
      //s.selected_answers = s.questions.map(q => -1);
      setState(s);
    }
  }, []);

  const ansMap = (ans, q_key, a_key) => {
    let v = "show-neutral";
    if (state.answers[q_key][a_key].is_correct) v = "show-correct";
    else if (state.selected_answers[q_key] === a_key) v = "show-incorrect";
    return (
      <div classname={classes.answer} key={a_key}>
        <Answers
          a_key={a_key}
          q_key={q_key}
          ans_text={ans}
          variant={v}
          readOnly
          disableElevation
        />
      </div>
    );
  };

  const quesMap = (question, q_key) => {
    let v = "show-correct";
    if (state.selected_answers[q_key] === -1 || !state.answers[q_key][state.selected_answers[q_key]].is_correct) v = "show-incorrect"
    return (
      <div className={classes.questions} key={q_key}>
        <Questions q_key={q_key} q_text={question} variant={v} readOnly />
        <Grid direction="row" container>
          <Grid direction="column" container item sm={6}>
            {state.answers[q_key]
              .slice(
                0,
                parseInt((state.answers[q_key].length + 1) / 2, 10)
              )
              .map((ans, a_key) =>
                ansMap(ans.answer_text, q_key, a_key)
              )}
          </Grid>
          <Grid direction="column" container item sm={6}>
            {state.answers[q_key]
              .slice(
                parseInt((state.answers[q_key].length + 1) / 2, 10)
              )
              .map((ans, a_key) =>
                ansMap(
                  ans.answer_text,
                  q_key,
                  a_key +
                  parseInt((state.answers[q_key].length + 1) / 2, 10)
                )
              )}
          </Grid>
        </Grid>
      </div>);
  };

  const onReturn = (e) => {
    history.push(`/platform/${state.platform_id}`);
  };

  return (
    <Box className={classes.QuizContainer}>
      <h1>{state.platform_title}</h1>
      <img className={classes.icon} src={previewSource} alt="" />
      <Box className={classes.Opt} mt={3}>
        <div className={classes.duration}>Duration:</div>
        <Box className={classes.timeContainer}>
          {time !== null ? (
            <Box className={classes.time}>
              <Typography>{`${time}`}</Typography>
            </Box>
          ) : (
            <Typography>INF</Typography>
          )}
        </Box>
        <Box>
          {displayUnanswered
            ? "Not all questions have been answered (Correct answers are shown)"
            : ""}
        </Box>
      </Box>
      <FormControl className={classes.quizform}>
        <InputBase
          className={classes.title}
          inputProps={{
            readOnly: true,
            min: 0,
            style: {
              textAlign: "center",
              fontSize: 22,
              paddingTop: 0,
              paddingBottom: 0,
              marginTop: 10,
            },
          }}
          value={state.quiz_title}
        />
        <Box className={classes.box}>
          <div className={classes.quizbody} />
          {state.questions && state.questions.map(quesMap)}
          <div className={classes.quizbody}>
            <Button
              style={returnStyle}
              variant="contained"
              onClick={onReturn}
              disableElevation
            >
              Return to Platform
            </Button>
          </div>
        </Box>
      </FormControl>
    </Box>
  );
}
