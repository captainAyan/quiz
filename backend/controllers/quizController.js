const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

const Quiz = require("../models/quizModel");
const { ErrorResponse } = require("../middleware/errorMiddleware");

const { schema } = require("../util/quizValidationSchema");
const shuffleArray = require("../util/shuffleArray");
const { PAGINATION_LIMIT } = require("../constants/policies");

const createQuiz = asyncHandler(async (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    throw new ErrorResponse(error.details[0].message, StatusCodes.BAD_REQUEST);
  }

  const quiz = await Quiz.create({ ...req.body, userId: req.user.id });

  if (!quiz) {
    throw new ErrorResponse("Something went wrong", StatusCodes.BAD_REQUEST);
  }

  const response = quiz.toJSON();

  res.status(StatusCodes.CREATED).json(response);
});

const getQuizzes = asyncHandler(async (req, res, next) => {
  const PAGE =
    parseInt(req.query.page, 10) > 0 ? parseInt(req.query.page, 10) : 0;

  const quizzes = await Quiz.find({ userId: req.user.id })
    .skip(PAGE * PAGINATION_LIMIT)
    .limit(PAGINATION_LIMIT);

  if (!quizzes) {
    throw new ErrorResponse("Something went wrong", StatusCodes.BAD_REQUEST);
  }

  const response = {
    skip: PAGE * PAGINATION_LIMIT,
    limit: PAGINATION_LIMIT,
    total: await Quiz.find({ userId: req.user.id }).count(),
    quizzes: quizzes.map((quiz) => quiz.toJSON()),
  };

  res.status(StatusCodes.OK).json(response);
});

const getQuiz = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let quiz;

  try {
    quiz = await Quiz.findOne({ _id: id, userId: req.user.id });
  } catch (error) {
    // for invalid mongodb objectid
    throw new ErrorResponse("Quiz not found", StatusCodes.NOT_FOUND);
  }

  if (!quiz) {
    throw new ErrorResponse("Quiz not found", StatusCodes.NOT_FOUND);
  }

  const response = quiz.toJSON();

  res.status(StatusCodes.OK).json(response);
});

const editQuiz = asyncHandler(async (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    throw new ErrorResponse("Invalid input error", StatusCodes.BAD_REQUEST);
  }

  const { id } = req.params;

  let quiz;

  try {
    quiz = await Quiz.findOne({ _id: id, userId: req.user.id });
  } catch (error) {
    // for invalid mongodb objectid
    throw new ErrorResponse("Quiz not found", StatusCodes.NOT_FOUND);
  }

  if (!quiz) {
    throw new ErrorResponse("Quiz not found", StatusCodes.NOT_FOUND);
  }

  if (quiz.published)
    throw new ErrorResponse(
      "Quiz cannot edited after publishing",
      StatusCodes.FORBIDDEN
    );
  else {
    await quiz.updateOne(req.body);
    quiz = await Quiz.findOne({ _id: id, userId: req.user.id });
  }

  const response = quiz.toJSON();

  res.status(StatusCodes.OK).json(response);
});

const deleteQuiz = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let quiz;

  try {
    quiz = await Quiz.findOne({ _id: id, userId: req.user.id });
  } catch (error) {
    // for invalid mongodb objectid
    throw new ErrorResponse("Quiz not found", StatusCodes.NOT_FOUND);
  }

  if (!quiz) {
    throw new ErrorResponse("Quiz not found", StatusCodes.NOT_FOUND);
  }

  if (quiz.published)
    throw new ErrorResponse(
      "Quiz cannot deleted after publishing",
      StatusCodes.FORBIDDEN
    );
  else await quiz.remove();

  res.status(StatusCodes.OK).json({
    _id: quiz.id,
  });
});

const getQuizQuestions = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let quiz;

  try {
    quiz = await Quiz.findOne({ _id: id, published: true });
  } catch (error) {
    // for invalid mongodb objectid
    throw new ErrorResponse("Quiz not found", StatusCodes.NOT_FOUND);
  }

  if (!quiz) {
    throw new ErrorResponse("Quiz not found", StatusCodes.NOT_FOUND);
  }

  const q = quiz.toJSON();

  const fullMarks = q.questions.reduce((acc, q) => acc + q.weightage, 0);

  // remove correctOptionId from questions and shuffling Options
  q.questions = q.questions.map((question) => {
    if (question.shuffleOptions) {
      question.options = shuffleArray(question.options);
      delete question.correctOptionId;
    }
    return question;
  });

  // shuffle questions
  if (q.shuffleQuestions) q.questions = shuffleArray(q.questions);

  const response = { ...q };

  res.status(StatusCodes.OK).json(response);
});

module.exports = {
  createQuiz,
  getQuizzes,
  getQuiz,
  editQuiz,
  deleteQuiz,
  getQuizQuestions,
};
