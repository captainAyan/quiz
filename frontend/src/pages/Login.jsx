import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { login, reset } from "../features/auth/authSlice";

export default function Home() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const [helperText, setHelperText] = useState("");

  useEffect(() => {
    if (isError) {
      setHelperText(message);
    }

    if (isSuccess || user) {
      navigate("/");
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  const handleReset = (e) => {
    setFormData({ email: "", password: "" });
  };

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <fieldset>
          <legend>Credentials:</legend>
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            placeholder="Email"
            onChange={onChange}
          />
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            placeholder="Password"
            onChange={onChange}
          />
          <p style={{ color: "red" }}>{helperText}</p>
          <input
            type="submit"
            value={isLoading ? "Loading..." : "Login"}
            disabled={isLoading}
          />
          &nbsp;
          <input type="reset" value="Reset" />
        </fieldset>
      </form>

      <p />
      <Link to="/register">[Register]</Link>
    </main>
  );
}
