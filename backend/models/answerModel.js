const mongoose = require("mongoose");
const {
  OPTION_ID_MAX_LENGTH,
  QUESTION_ID_MAX_LENGTH,
} = require("../constants/policies");

const answerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Quiz",
    },
    marksObtained: {
      type: Number,
      required: true,
    },

    answers: [
      {
        _id: false,
        questionId: {
          type: String,
          required: true,
          trim: true,
          minlength: 1,
          maxlength: QUESTION_ID_MAX_LENGTH,
        },
        optionId: {
          type: String,
          required: true,
          trim: true,
          minlength: 1,
          maxlength: OPTION_ID_MAX_LENGTH,
        },
      },
    ],
  },
  { timestamps: true }
);

answerSchema.set("toObject", { virtuals: true });
answerSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Answer", answerSchema);
