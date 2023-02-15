import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { register, reset } from "../features/auth/authSlice";

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: "",
  });
  const { firstName, lastName, email, password, password2 } = formData;

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
    if (password !== password2) {
      console.log(password, password2);
      setHelperText("Passwords do not match");
    } else {
      const userData = {
        firstName,
        lastName,
        email,
        password,
      };

      dispatch(register(userData));
    }
  };

  const handleReset = (e) => {
    setFormData({ email: "", password: "" });
  };

  return (
    <main>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <fieldset>
          <legend>Credentials:</legend>
          <label htmlFor="firstName">Your First Name</label>
          <input
            type="text"
            name="firstName"
            id="first_name"
            value={firstName}
            placeholder="First Name"
            onChange={onChange}
          />
          <label htmlFor="lastName">Your Last Name</label>
          <input
            type="text"
            name="lastName"
            id="last_name"
            value={lastName}
            placeholder="Last Name"
            onChange={onChange}
          />
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
          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            type="password"
            name="password2"
            id="confirm_password"
            value={password2}
            placeholder="Confirm Password"
            onChange={onChange}
          />
          <p style={{ color: "red" }}>{helperText}</p>
          <input
            type="submit"
            value={isLoading ? "Loading..." : "Register"}
            disabled={isLoading}
          />
          &nbsp;
          <input type="reset" value="Reset" />
        </fieldset>
      </form>

      <p />
      <Link to="/login">[Login]</Link>
    </main>
  );
}
