import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import authConfig from "../util/authConfig";
import { GET_QUIZ_ANSWERS_URL } from "../constants/api";

export default function Report() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [data, setData] = useState();

  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 0);

  async function getAnswers(page) {
    axios
      .get(`${GET_QUIZ_ANSWERS_URL(id)}?page=${page}`, authConfig(user?.token))
      .then(({ data }) => {
        setData(data);
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
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button onClick={() => setPage(page - 1)}>«</button>
        <span>Page {page}</span>
        <button onClick={() => setPage(page + 1)}>»</button>
      </div>
    </main>
  );
}
