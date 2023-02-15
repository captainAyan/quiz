import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

import { EDIT_QUIZ_URL, GET_QUIZ_URL } from "../constants/api";
import authConfig from "../util/authConfig";
import MainForm from "../components/QuizForm/MainForm";

export default function Edit() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState({});

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      axios
        .get(GET_QUIZ_URL + id, authConfig(user?.token))
        .then(({ data }) => setData(data))
        .catch((e) => setIsError(true))
        .finally(() => setIsLoading(false));
    }
  }, [user, navigate, id]);

  useEffect(() => {
    console.log("data changed", data);
  }, [data]);

  return (
    <main>
      <h1>Edit</h1>
      <div>{isLoading ? <h2>Loading...</h2> : null}</div>
      <div>{isError ? <h2>Not found</h2> : null}</div>

      {JSON.stringify(data) === "{}" ? null : <MainForm data={data} />}
    </main>
  );
}
