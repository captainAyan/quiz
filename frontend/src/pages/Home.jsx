import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import authConfig from "../util/authConfig";
import { GET_QUIZZES_URL } from "../constants/api";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [quizzes, setQuizzes] = useState();
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 0);

  async function getQuizzes(page) {
    setIsLoading(true);
    const { data } = await axios.get(
      `${GET_QUIZZES_URL}?page=${page}`,
      authConfig(user.token)
    );
    const { total, limit } = data;
    setQuizzes(data.quizzes);
    setTotalPages(Math.ceil(total / limit));
    setIsLoading(false);
  }

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      getQuizzes(page);
      navigate(`?page=${page}`);
    }
  }, [user, navigate, page]);

  return (
    <main>
      <h1>
        Welcome,{" "}
        <span style={{ textTransform: "capitalize" }}>{user?.firstName}</span>
      </h1>
      <div>{isLoading ? <h4>Loading...</h4> : null}</div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Full Marks</th>
          </tr>
        </thead>
        <tbody>
          {quizzes?.map((quiz) => (
            <tr key={quiz.id}>
              <td>{quiz.id.substr(quiz.id.length - 6)}</td>
              <td>{quiz.title}</td>
              <td>{quiz.description}</td>
              <td>{quiz.published ? "Published" : "Unpublished"}</td>
              <td>{quiz.fullMarks}</td>

              <td>
                {quiz.published ? (
                  <a href={`/edit/${quiz.id}`}>
                    <button>Edit</button>
                  </a>
                ) : (
                  <button>Report</button>
                )}
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
    </main>
  );
}
