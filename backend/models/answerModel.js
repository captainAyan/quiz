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
          trim: true,
          maxlength: OPTION_ID_MAX_LENGTH,
        },
      },
    ],
  },
  { timestamps: true }
);

answerSchema.set("toObject", { virtuals: true });
answerSchema.set("toJSON", { virtuals: true });

answerSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});
answerSchema.virtual("quiz", {
  ref: "Quiz",
  localField: "quizId",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("Answer", answerSchema);
