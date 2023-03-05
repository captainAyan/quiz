import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import authConfig from "../util/authConfig";
import { GET_QUIZ_ANSWERS_URL, GET_QUIZ_URL } from "../constants/api";

export default function Report() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [detailViewId, setDetailViewId] = useState();

  const [data, setData] = useState();
  const [quiz, setQuiz] = useState();

  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 0);

  async function getAnswers(page) {
    axios
      .get(`${GET_QUIZ_ANSWERS_URL(id)}?page=${page}`, authConfig(user?.token))
      .then(({ data }) => {
        setData(data);
        setIsError(false);
      })
      .then(() => axios.get(GET_QUIZ_URL + id, authConfig(user?.token)))
      .then(({ data }) => {
        setQuiz(data);
        setIsError(false);
      })
      .catch((e) => {
        setErrorMessage(e.response.data.error.message);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      getAnswers(page);
      navigate(`?page=${page}`);
    }
  }, [user, navigate, page]);

  return (
    <main>
      <h1>Report</h1>
      {isLoading ? <span style={{ display: "block" }}>Loading...</span> : null}
      {isError ? (
        <span style={{ color: "red", display: "block" }}>{errorMessage}</span>
      ) : null}

      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Created At</th>
            <th>Marks Obtained</th>
            <th>Examinee Id</th>
            <th>Examinee Email</th>
          </tr>
        </thead>
        <tbody>
          {data?.answers?.map((answer) => (
            <tr key={answer.id}>
              <td>{answer.id}</td>
              <td>{answer.createdAt}</td>
              <td>{answer.marksObtained}</td>
              <td>{answer.user.id}</td>
              <td>{answer.user.email}</td>
              <td>
                <a href="#" onClick={() => setDetailViewId(answer.id)}>
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setPage(page - 1)}>«</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>»</button>
      </div>

      <h3>Answer Details</h3>
      <table>
        <thead>
          <tr>
            <th>Question Id</th>
            <th>Question Description</th>
            <th>Question Weightage</th>
            <th>Question Negative Mark</th>
            <th>Correct Answer (Id)</th>
            <th>Examinee Answer</th>
          </tr>
        </thead>
        <tbody>
          {quiz?.questions?.map((question, i) => (
            <tr key={question.id}>
              <td>{question.id}</td>
              <td>{question.description}</td>
              <td>{question.weightage}</td>
              <td>{question.negativeMark}</td>
              <td>
                {`${
                  question.options[
                    question.options
                      .map((op) => op.id)
                      .indexOf(question.correctOptionId)
                  ].description
                }
                  (${
                    question.options[
                      question.options
                        .map((op) => op.id)
                        .indexOf(question.correctOptionId)
                    ].id
                  })`}
              </td>
              <td>
                {`${
                  question.options[
                    question.options
                      .map((op) => op.id)
                      .indexOf(
                        data?.answers[
                          data?.answers?.map((a) => a.id).indexOf(detailViewId)
                        ]?.answers[i].optionId
                      )
                  ]?.description || ""
                }
                  (${
                    question.options[
                      question.options
                        .map((op) => op.id)
                        .indexOf(
                          data?.answers[
                            data?.answers
                              ?.map((a) => a.id)
                              .indexOf(detailViewId)
                          ]?.answers[i].optionId
                        )
                    ]?.id || " - "
                  })
                  `}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
