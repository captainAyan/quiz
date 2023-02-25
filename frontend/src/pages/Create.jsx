import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import { CREATE_QUIZ_URL } from "../constants/api";
import authConfig from "../util/authConfig";
import QuizForm from "../components/QuizForm";

export default function Create() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [data, setData] = useState({
    title: "",
    description: "",
    tags: [],
    shuffleQuestions: false,
    duration: 0,
    published: false,
    questions: [],
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <main>
      <h1>Create</h1>

      <QuizForm
        data={data}
        errorMessage={formErrorMessage}
        successMessage={""}
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
            .post(CREATE_QUIZ_URL, quizData, authConfig(user?.token))
            .then(({ data }) => {
              setData(data);
              navigate("/");
            })
            .catch((e) => {
              setFormErrorMessage(e.response.data.error.message);
            });
        }}
      />
    </main>
  );
}
