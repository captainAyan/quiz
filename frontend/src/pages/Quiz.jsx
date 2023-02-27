import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import authConfig from "../util/authConfig";
import {
  GET_QUIZ_QUESTIONS_URL,
  POST_QUIZ_ANSWERS_URL,
} from "../constants/api";
import { timeConverter } from "../util/timeUtil";

export default function Quiz() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerData, setAnswerData] = useState([]);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [time, setTime] = useState(0);
  const [markSheet, setMarkSheet] = useState(null);

  // Exam timer
  useEffect(() => {
    if (started && !finished) {
      if (time > 0) {
        setTimeout(() => {
          setTime(time - 1000);
        }, 1000);
      } else setFinished(true);
    }
  }, [time, started, finished]);

  // Questions loader
  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      axios
        .get(GET_QUIZ_QUESTIONS_URL(id), authConfig(user?.token))
        .then(({ data }) => {
          setData(data);
          setIsError(false);
          setTime(data.duration);
          setAnswerData(
            data.questions.map((q) => {
              return { questionId: q.id, optionId: "" };
            })
          );
        })
        .catch((e) => {
          navigate("/");
        })
        .finally(() => setIsLoading(false));
    }
  }, [user, navigate, id]);

  // Answer submission
  useEffect(() => {
    if (finished) {
      setIsLoading(true);
      axios
        .post(POST_QUIZ_ANSWERS_URL(id), answerData, authConfig(user?.token))
        .then(({ data: answerData }) => {
          setMarkSheet(answerData);
        })
        .catch((e) => {
          setErrorMessage(e.response.data.error.message);
          setIsError(true);
        })
        .finally(() => setIsLoading(false));
    }
  }, [finished]);

  return (
    <main>
      <h1>{data?.title}</h1>
      <p>
        <span>{data?.description}</span>
        <br />
        <span>
          <b>Duration : </b> {timeConverter(data?.duration)}
        </span>
        <br />
        <span>
          <b>Fullmarks : </b> {data?.fullMarks}
        </span>
        <br />
        <span>
          <b>Time Left : </b> {timeConverter(time)}
        </span>
      </p>
      <button
        disabled={currentQuestionIndex === 0 || !started || finished}
        onClick={() =>
          currentQuestionIndex > 0
            ? setCurrentQuestionIndex(currentQuestionIndex - 1)
            : null
        }
      >
        Previous
      </button>
      {` ${currentQuestionIndex} `}
      <button
        disabled={
          currentQuestionIndex === data?.questions?.length - 1 ||
          !started ||
          finished
        }
        onClick={() =>
          currentQuestionIndex < data?.questions?.length - 1
            ? setCurrentQuestionIndex(currentQuestionIndex + 1)
            : null
        }
      >
        Next
      </button>{" "}
      <button
        disabled={finished || !started}
        onClick={() => {
          setFinished(true);
        }}
      >
        Submit
      </button>
      <hr />
      {/* Question Section */}
      {started ? (
        finished ? (
          <>
            <h3>Quiz has ended</h3>
            <h3>Marksheet</h3>
            <table>
              <tbody>
                <tr>
                  <td>
                    <b>Marksheet Id</b>
                  </td>
                  <td>{markSheet?.answerId}</td>
                </tr>
                <tr>
                  <td>
                    <b>Full Marks</b>
                  </td>
                  <td>{markSheet?.fullMarks}</td>
                </tr>

                <tr>
                  <td>
                    <b>Marks Obtained</b>
                  </td>
                  <td>{markSheet?.marksObtained}</td>
                </tr>

                <tr>
                  <td>
                    <b>Percentage</b>
                  </td>
                  <td>{markSheet?.percentage}%</td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <>
            <h3 style={{ display: "inline" }}>
              {data?.questions[currentQuestionIndex]?.description}
            </h3>
            <span>
              <i>
                (
                {data?.questions[currentQuestionIndex]?.weightage +
                  " / -" +
                  data?.questions[currentQuestionIndex]?.negativeMark}
                )
              </i>
            </span>
            <img src={data?.questions[currentQuestionIndex]?.imageUrl} alt="" />
            <hr />

            {/* Options section */}
            <h4>Options:</h4>
            {data?.questions[currentQuestionIndex]?.options?.map((option) => (
              <p key={option.id}>
                <img
                  src={option.imageUrl}
                  alt=""
                  style={{ display: "block" }}
                />
                <button
                  onClick={() => {
                    setAnswerData(
                      answerData.map((answer, i) => {
                        if (i === currentQuestionIndex)
                          answer.optionId = option.id;
                        return answer;
                      })
                    );
                    data?.questions[currentQuestionIndex]?.id;
                  }}
                >
                  {answerData[currentQuestionIndex]?.optionId === option.id
                    ? "✅ "
                    : ""}
                  {option.description}
                </button>
              </p>
            ))}
            <p>
              <button
                onClick={() => {
                  setAnswerData(
                    answerData.map((answer, i) => {
                      if (i === currentQuestionIndex) answer.optionId = "";
                      return answer;
                    })
                  );
                  data?.questions[currentQuestionIndex]?.id;
                }}
              >
                {answerData[currentQuestionIndex]?.optionId === "" ? "✅ " : ""}
                None
              </button>
            </p>
          </>
        )
      ) : (
        <>
          <button onClick={() => setStarted(true)}>Start Test</button>
        </>
      )}
      {isLoading ? <span style={{ display: "block" }}>Loading...</span> : null}
      {isError ? (
        <span style={{ color: "red", display: "block" }}>{errorMessage}</span>
      ) : null}
    </main>
  );
}
