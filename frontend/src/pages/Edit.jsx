import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import { EDIT_QUIZ_URL, GET_QUIZ_URL } from "../constants/api";
import authConfig from "../util/authConfig";
import QuizForm from "../components/QuizForm";

export default function Edit() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isNotFoundError, setIsNotFoundError] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [formSuccessMessage, setFormSuccessMessage] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      axios
        .get(GET_QUIZ_URL + id, authConfig(user?.token))
        .then(({ data }) => {
          setData(data);
        })
        .catch((e) => setIsNotFoundError(true))
        .finally(() => setIsLoading(false));
    }
  }, [user, navigate, id]);

  return (
    <main>
      <h1>Edit</h1>

      {JSON.stringify(data) === "{}" ? null : (
        <QuizForm
          data={data}
          errorMessage={formErrorMessage}
          successMessage={formSuccessMessage}
          onSubmit={(data) => {
            const quizData = (({
              title,
              description,
              tags,
              shuffleQuestions,
              duration,
              published,
              questions,
            }) => ({
              title,
              description,
              tags,
              shuffleQuestions,
              duration,
              published,
              questions,
            }))(data);

            axios
              .put(EDIT_QUIZ_URL + id, quizData, authConfig(user?.token))
              .then(({ data }) => {
                setFormSuccessMessage("Saved Successfully");
                setFormErrorMessage("");
                setData(data);
              })
              .catch((e) => {
                setFormSuccessMessage("");
                setFormErrorMessage(e.response.data.error.message);
              })
              .finally(() => setIsLoading(false));
          }}
        />
      )}

      <div>{isLoading ? <p>Loading...</p> : null}</div>
      <div>
        {isNotFoundError ? <p style={{ color: "red" }}>Not found</p> : null}
      </div>
    </main>
  );
}
