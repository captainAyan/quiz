import * as Yup from "yup";

import {
  QUIZ_TITLE_MAX_LENGTH,
  QUIZ_DESCRIPTION_MAX_LENGTH,
  QUIZ_MAX_TAG_LENGTH,
  QUIZ_MAX_TAGS,
  QUESTION_ID_MAX_LENGTH,
  QUESTION_DESCRIPTION_MAX_LENGTH,
  OPTION_ID_MAX_LENGTH,
  OPTION_DESCRIPTION_MAX_LENGTH,
  IMAGE_URL_MAX_LENGTH,
} from "../constants/policies.js";

export default Yup.object().shape({
  title: Yup.string().min(1).max(QUIZ_TITLE_MAX_LENGTH).required(),
  description: Yup.string().min(1).max(QUIZ_DESCRIPTION_MAX_LENGTH).required(),
  tags: Yup.array()
    .of(Yup.string().min(1).max(QUIZ_MAX_TAG_LENGTH))
    .min(0)
    .max(QUIZ_MAX_TAGS)
    .test(
      "tags-uniqueness",
      "Tags must be unique",
      (tags) => tags.length === new Set([...tags]).size
    )
    .required(),
  shuffleQuestions: Yup.boolean().required(),
  duration: Yup.number().integer().min(1).required(),
  published: Yup.boolean().required(),

  questions: Yup.array().of(
    Yup.object().shape({
      id: Yup.string().min(1).max(QUESTION_ID_MAX_LENGTH).required(),
      description: Yup.string()
        .min(1)
        .max(QUESTION_DESCRIPTION_MAX_LENGTH)
        .required(),
      weightage: Yup.number().integer().positive().min(1).required(),

      negativeMark: Yup.number()
        .positive()
        .required()
        .test(
          "negative-mark-higher-than-weightage",
          "Negative mark cannot be higher than weightage",
          (negativeMark, { parent: { weightage } }) => weightage > negativeMark
        ),
      imageUrl: Yup.string().min(0).max(IMAGE_URL_MAX_LENGTH),
      noOfOptionsDisplayed: Yup.number()
        .integer()
        .min(2)
        .required()
        .test(
          "too-many-options",
          "Not enough options available",
          (noOfOptionsDisplayed, { parent: { options } }) =>
            options.length >= noOfOptionsDisplayed
        ),
      shuffleOptions: Yup.boolean().required(),

      correctOptionId: Yup.string()
        .min(1)
        .max(OPTION_ID_MAX_LENGTH)
        .required()
        .test(
          "option-with-correct-option-id-not-available",
          "Option with correct option id not available",
          (correctOptionId, { parent: { options } }) =>
            options.map((option) => option.id).includes(correctOptionId)
        ),

      options: Yup.array().of(
        Yup.object().shape({
          id: Yup.string().min(1).max(OPTION_ID_MAX_LENGTH).required(),
          description: Yup.string()
            .min(1)
            .max(OPTION_DESCRIPTION_MAX_LENGTH)
            .required(),
          imageUrl: Yup.string().min(0).max(IMAGE_URL_MAX_LENGTH),
        })
      ),
    })
  ),
});
