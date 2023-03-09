import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import authConfig from "../util/authConfig";
import { GET_MARKSHEETS } from "../constants/api";

export default function MarkSheet() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();

  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 0);

  async function getMarkSheets(page) {
    setIsLoading(true);
    const { data } = await axios.get(
      `${GET_MARKSHEETS}?page=${page}`,
      authConfig(user.token)
    );
    const { total, limit } = data;
    setData(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      getMarkSheets(page);
      navigate(`?page=${page}`);
    }
  }, [user, navigate, page]);

  return (
    <main>
      <h1>Marksheets</h1>
      <a href={`/create`}>
        <button>Create</button>
      </a>
      <div>{isLoading ? <h4>Loading...</h4> : null}</div>
      <table>
        <thead>
          <tr>
            <th>Marksheet Id</th>
            <th>Quiz Id</th>
            <th>Quiz Title</th>
            <th>Marksheet Issue Date</th>
            <th>Marks Obtained</th>
            <th>Full Marks</th>
          </tr>
        </thead>
        <tbody>
          {data?.markSheets?.map((markSheet) => (
            <tr key={markSheet.id}>
              <td>{markSheet.id}</td>
              <td>{markSheet.quizId}</td>
              <td>{markSheet.quiz.title}</td>
              <td>{markSheet.createdAt}</td>
              <td>{markSheet.marksObtained}</td>
              <td>{markSheet.quiz.fullMarks}</td>
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
