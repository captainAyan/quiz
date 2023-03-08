const mongoose = require("mongoose");
const {
  QUIZ_TITLE_MAX_LENGTH,
  QUIZ_DESCRIPTION_MAX_LENGTH,
  QUIZ_MAX_TAG_LENGTH,
  QUIZ_MAX_TAGS,
  QUESTION_ID_MAX_LENGTH,
  QUESTION_DESCRIPTION_MAX_LENGTH,
  OPTION_ID_MAX_LENGTH,
  OPTION_DESCRIPTION_MAX_LENGTH,
  IMAGE_URL_MAX_LENGTH,
} = require("../constants/policies.js");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: QUIZ_TITLE_MAX_LENGTH,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: QUIZ_DESCRIPTION_MAX_LENGTH,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    tags: [
      {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: QUIZ_MAX_TAG_LENGTH,
      },
    ],
    shuffleQuestions: {
      type: Boolean,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
      min: 1,
    },

    published: {
      type: Boolean,
      required: true,
    },

    questions: [
      {
        _id: false,
        id: {
          type: String,
          required: true,
          trim: true,
          minlength: 1,
          maxlength: QUESTION_ID_MAX_LENGTH,
        },
        description: {
          type: String,
          required: true,
          trim: true,
          minlength: 1,
          maxlength: QUESTION_DESCRIPTION_MAX_LENGTH,
        },
        weightage: {
          type: Number,
          required: true,
          min: 1,
        },
        negativeMark: {
          type: Number,
          required: true,
        },
        imageUrl: {
          type: String,
          trim: true,
          minlength: 0,
          maxlength: IMAGE_URL_MAX_LENGTH,
        },
        noOfOptionsDisplayed: {
          type: Number,
          required: true,
          min: 2,
        },
        shuffleOptions: {
          type: Boolean,
          required: true,
        },
        correctOptionId: {
          type: String,
          required: true,
          trim: true,
          minlength: 1,
          maxlength: OPTION_ID_MAX_LENGTH,
        },
        options: [
          {
            _id: false,
            id: {
              type: String,
              required: true,
              trim: true,
              minlength: 1,
              maxlength: OPTION_ID_MAX_LENGTH,
            },
            description: {
              type: String,
              required: true,
              trim: true,
              minlength: 1,
              maxlength: OPTION_DESCRIPTION_MAX_LENGTH,
            },
            imageUrl: {
              type: String,
              trim: true,
              minlength: 0,
              maxlength: IMAGE_URL_MAX_LENGTH,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

quizSchema.set("toObject", { virtuals: true });
quizSchema.set("toJSON", { virtuals: true });

quizSchema.virtual("fullMarks").get(function () {
  return this.questions.reduce((acc, q) => acc + q.weightage, 0);
});

quizSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("Quiz", quizSchema);
