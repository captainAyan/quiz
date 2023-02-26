const Joi = require("joi");

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

const schema = Joi.object({
  title: Joi.string().min(1).max(QUIZ_TITLE_MAX_LENGTH).required(),
  description: Joi.string().min(1).max(QUIZ_DESCRIPTION_MAX_LENGTH).required(),
  tags: Joi.array()
    .items(Joi.string().min(1).max(QUIZ_MAX_TAG_LENGTH))
    .min(0)
    .max(QUIZ_MAX_TAGS)
    .unique()
    .required(),
  shuffleQuestions: Joi.boolean().required(),
  duration: Joi.number().integer().min(1).required(),
  published: Joi.boolean().required(),
  questions: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().min(1).max(QUESTION_ID_MAX_LENGTH).required(),
        description: Joi.string()
          .min(1)
          .max(QUESTION_DESCRIPTION_MAX_LENGTH)
          .required(),
        weightage: Joi.number().integer().positive().min(1).required(),
        negativeMark: Joi.number()
          .positive()
          .required()
          .custom((value, helpers) => {
            const { weightage } = helpers.state.ancestors[0]; // question options

            if (value > weightage)
              return helpers.message(
                '"negativeMark" cannot be more than "weightage".'
              );

            return Number(parseFloat(value).toFixed(2));
          }),
        imageUrl: Joi.string()
          .allow("")
          .uri()
          .max(IMAGE_URL_MAX_LENGTH)
          .required(),
        noOfOptionsDisplayed: Joi.number()
          .integer()
          .min(2)
          .required()
          .custom((value, helpers) => {
            const { options } = helpers.state.ancestors[0]; // question options
            if (options.length < value)
              return helpers.message(
                '"noOfOptionsDisplayed" cannot be more than number of options available.'
              );
            return value;
          }),
        shuffleOptions: Joi.boolean().required(),
        correctOptionId: Joi.string()
          .min(1)
          .max(OPTION_ID_MAX_LENGTH)
          .required()
          .custom((value, helpers) => {
            const { options } = helpers.state.ancestors[0]; // question options
            if (!options.map((option) => option.id).includes(value)) {
              return helpers.message(
                '"currentOptionId" must be available in options'
              );
              // return helpers;
            }
            return value;
          }),
        options: Joi.array()
          .items(
            Joi.object({
              id: Joi.string().min(1).max(OPTION_ID_MAX_LENGTH).required(),
              description: Joi.string()
                .min(1)
                .max(OPTION_DESCRIPTION_MAX_LENGTH)
                .required(),
              imageUrl: Joi.string()
                .allow("")
                .uri()
                .max(IMAGE_URL_MAX_LENGTH)
                .required(),
            })
          )
          .min(2)
          .unique("id")
          .required(),
      })
    )
    .unique("id")
    .required(),
});

module.exports = { schema };
