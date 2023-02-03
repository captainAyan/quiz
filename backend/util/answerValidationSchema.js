const Joi = require("joi");
const {
  QUESTION_ID_MAX_LENGTH,
  OPTION_ID_MAX_LENGTH,
} = require("../constants/policies");

const schema = Joi.array()
  .items(
    Joi.object({
      questionId: Joi.string().min(1).max(QUESTION_ID_MAX_LENGTH).required(),
      optionId: Joi.string().min(0).max(OPTION_ID_MAX_LENGTH).required(), // <- can be empty
    })
  )
  .min(1)
  .unique("questionId")
  .required();

module.exports = { schema };
