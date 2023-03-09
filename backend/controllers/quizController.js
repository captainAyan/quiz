const { StatusCodes } = require("http-status-codes");
const asyncHandler = require("express-async-handler");

const Quiz = require("../models/quizModel");
const Answer = require("../models/answerModel");
const { ErrorResponse } = require("../middleware/errorMiddleware");

const { schema } = require("../util/quizValidationSchema");
const { schema: answerSchema } = require("../util/answerValidationSchema");
const shuffleArray = require("../util/shuffleArray");
const correctAnswerIncludedOptionsSubset = require("../util/correctAnswerIncludedOptionsSubset");
const { PAGINATION_LIMIT } = require("../constants/policies");
const answerReportGenerator = require("../util/answerReportGenerator");

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

  q.questions = q.questions.map((question) => {
    if (question.shuffleOptions)
      question.options = correctAnswerIncludedOptionsSubset(
        shuffleArray(question.options),
        question.correctOptionId,
        question.noOfOptionsDisplayed
      );
    else
      question.options = correctAnswerIncludedOptionsSubset(
        question.options,
        question.correctOptionId,
        question.noOfOptionsDisplayed
      );

    delete question.correctOptionId;
    delete question.shuffleOptions;
    delete question.noOfOptionsDisplayed;
    return question;
  });

  // shuffle questions
  if (q.shuffleQuestions) q.questions = shuffleArray(q.questions);

  delete q.shuffleQuestions;
  delete q.published;

  const response = { ...q };

  res.status(StatusCodes.OK).json(response);
});

const postQuizAnswers = asyncHandler(async (req, res, next) => {
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

  const quizTakenDBResult = await Answer.findOne({
    quizId: quiz.id,
    userId: req.user.id,
  });
  if (quizTakenDBResult) {
    throw new ErrorResponse("Quiz already taken", StatusCodes.FORBIDDEN);
  }

  const { error } = answerSchema.validate(req.body);

  if (error) {
    throw new ErrorResponse(error.details[0].message, StatusCodes.BAD_REQUEST);
  }

  const { report, validAnswers } = answerReportGenerator(
    quiz.toJSON(),
    req.body
  );

  const answerResult = await Answer.create({
    quizId: quiz.id,
    userId: req.user.id,
    marksObtained: report.marksObtained,
    answers: validAnswers,
  });

  if (!answerResult) {
    throw new ErrorResponse("Something went wrong", StatusCodes.BAD_REQUEST);
  }

  report.answerId = answerResult.id;

  res.status(StatusCodes.OK).json(report);
});

const getQuizAnswers = asyncHandler(async (req, res, next) => {
  const PAGE =
    parseInt(req.query.page, 10) > 0 ? parseInt(req.query.page, 10) : 0;

  const { id: quizId } = req.params;
  let quiz;

  try {
    quiz = await Quiz.findOne({ _id: quizId, userId: req.user.id });
  } catch (error) {
    // for invalid mongodb objectid
    throw new ErrorResponse("Quiz not found", StatusCodes.NOT_FOUND);
  }

  if (!quiz) {
    throw new ErrorResponse("Quiz not found", StatusCodes.NOT_FOUND);
  }

  const answers = await Answer.find({ quizId })
    .skip(PAGE * PAGINATION_LIMIT)
    .limit(PAGINATION_LIMIT)
    .populate("user", "-password");

  const response = {
    skip: PAGE * PAGINATION_LIMIT,
    limit: PAGINATION_LIMIT,
    total: await Answer.find({ quizId }).count(),
    answers,
  };

  res.status(StatusCodes.OK).json(response);
});

const getMarkSheets = asyncHandler(async (req, res, next) => {
  const PAGE =
    parseInt(req.query.page, 10) > 0 ? parseInt(req.query.page, 10) : 0;

  const markSheets = await Answer.find({ userId: req.user.id })
    .skip(PAGE * PAGINATION_LIMIT)
    .limit(PAGINATION_LIMIT)
    .populate("quiz", [
      "id",
      "title",
      "description",
      "userId",
      "tags",
      "duration",
      "createdAt",
      "updatedAt",
      "questions",
    ]);

  const response = {
    skip: PAGE * PAGINATION_LIMIT,
    limit: PAGINATION_LIMIT,
    total: await Answer.find({ userId: req.user.id }).count(),
    markSheets: markSheets.map((markSheet) => {
      markSheet = markSheet.toJSON();
      delete markSheet.quiz.questions;
      return markSheet;
    }),
  };

  res.status(StatusCodes.OK).json(response);
});

module.exports = {
  createQuiz,
  getQuizzes,
  getQuiz,
  editQuiz,
  deleteQuiz,
  getQuizQuestions,
  postQuizAnswers,
  getQuizAnswers,
  getMarkSheets,
};
