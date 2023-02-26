import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import authConfig from "../util/authConfig";
import { GET_QUIZ_QUESTIONS_URL } from "../constants/api";
import { timeConverter } from "../util/timeUtil";

export default function Quiz() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerData, setAnswerData] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      axios
        .get(GET_QUIZ_QUESTIONS_URL(id), authConfig(user?.token))
        .then(({ data }) => {
          setData(data);
          setIsError(false);

          setAnswerData(
            data.questions.map((q) => {
              return { questionsId: q.id, optionId: "" };
            })
          );
        })
        .catch((e) => setIsError(true))
        .finally(() => setIsLoading(false));
    }
  }, [user, navigate, id]);

  useEffect(() => {
    console.log(answerData);
  }, [answerData, setAnswerData]);

  return (
    <main>
      <h1>{data?.title}</h1>
      <p>{data?.description}</p>
      <p>
        <b>Time : </b> {timeConverter(data?.duration)}
      </p>
      <button
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
        onClick={() =>
          currentQuestionIndex < data?.questions?.length - 1
            ? setCurrentQuestionIndex(currentQuestionIndex + 1)
            : null
        }
      >
        Next
      </button>
      <hr />

      {/* Question Section */}
      <h4>{data?.questions[currentQuestionIndex]?.description}</h4>
      <span>
        (
        {data?.questions[currentQuestionIndex]?.weightage +
          " / -" +
          data?.questions[currentQuestionIndex]?.negativeMark}
        )
      </span>
      <img src={data?.questions[currentQuestionIndex]?.imageUrl} alt="" />
      <hr />

      {/* Options section */}
      {data?.questions[currentQuestionIndex]?.options?.map((option) => (
        <p key={option.id}>
          <img src={option.imageUrl} alt="" style={{ display: "block" }} />
          <button
            onClick={() => {
              setAnswerData(
                answerData.map((answer, i) => {
                  if (i === currentQuestionIndex) answer.optionId = option.id;
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

      <span style={{ display: "block" }}>{isLoading}</span>
      <span style={{ color: "red", display: "block" }}>{isError}</span>
    </main>
  );
}
