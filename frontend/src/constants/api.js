export const DOMAIN =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:3001"
    : "";

export const VERSION = "v1";
export const BASE_URL = `${DOMAIN}/api/${VERSION}`;

export const BASE_AUTH_URL = `${BASE_URL}/auth`;
export const REGISTER_URL = `${BASE_AUTH_URL}/register`;
export const LOGIN_URL = `${BASE_AUTH_URL}/login`;

export const BASE_QUIZ_URL = `${BASE_URL}/quiz`;
export const CREATE_QUIZ_URL = `${BASE_QUIZ_URL}/`;
export const GET_QUIZ_URL = `${BASE_QUIZ_URL}/`;
export const GET_QUIZZES_URL = `${BASE_QUIZ_URL}/`;
export const EDIT_QUIZ_URL = `${BASE_QUIZ_URL}/`;
export const DELETE_QUIZ_URL = `${BASE_QUIZ_URL}/`;
export const GET_QUIZ_QUESTIONS_URL = (id) =>
  `${BASE_QUIZ_URL}/${id}/questions`;
export const POST_QUIZ_ANSWERS_URL = (id) => `${BASE_QUIZ_URL}/${id}/answers`;
export const GET_QUIZ_ANSWERS_URL = (id) => `${BASE_QUIZ_URL}/${id}/answers`;
export const GET_MARKSHEETS = `${BASE_QUIZ_URL}/marksheet`;
