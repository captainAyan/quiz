import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";

import QuizSchema from "../util/quizValidationSchema";
import { timeConverter } from "../util/timeUtil";

export default function MainForm({
  data,
  onSubmit,
  errorMessage,
  successMessage,
}) {
  return (
    <>
      <Formik
        initialValues={data}
        validationSchema={QuizSchema}
        onSubmit={async (values) => onSubmit(values)}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <h3>Details</h3>
            <fieldset>
              <legend>Details</legend>
              <label htmlFor="title">Title</label>
              <Field type="text" id="title" name="title" placeholder="Title" />
              <ErrorMessage name="title" />

              <label htmlFor="description">Description</label>
              <Field
                type="text"
                id="description"
                name="description"
                placeholder="Description"
                as="textarea"
              />

              <ErrorMessage name="description" />

              <label htmlFor="duration">Duration</label>
              <Field
                type="number"
                id="duration"
                name="duration"
                placeholder="Duration"
                step="60000"
              />
              <span>{timeConverter(values.duration)} (mm:ss)</span>
              <br />
              <ErrorMessage name="duration" />

              <label htmlFor="published">Published</label>
              <Field id="published" name="published" type="checkbox" />
              <ErrorMessage name="published" />

              <label htmlFor="shuffleQuestions">Shuffle Questions</label>
              <Field
                id="shuffleQuestions"
                name="shuffleQuestions"
                type="checkbox"
              />
              <ErrorMessage name="shuffleQuestions" />

              <label htmlFor="tags">Tags</label>
              <input
                id="tags"
                name="tags"
                placeholder="Tags"
                value={values.tags.toString()}
                onChange={(e) =>
                  e.target.value === ""
                    ? setFieldValue("tags", [])
                    : setFieldValue(
                        "tags",
                        e.target.value.split(",").map((tag) => tag.trim())
                      )
                }
              />
              <div>
                {values.tags.map((tag, i) => (
                  <span
                    key={i}
                    style={{
                      border: "1px black solid",
                      padding: "1px 8px",
                      borderRadius: "8px",
                      background: "#ddd",
                      marginRight: "8px",
                      fontSize: "14px",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <ErrorMessage name="tags" />
            </fieldset>

            <h3>Questions</h3>

            <FieldArray
              name="questions"
              render={(questionsArrayHelpers) => (
                <div>
                  {values.questions.map((question, questionIndex) => (
                    <fieldset key={`question_${questionIndex}`}>
                      <legend>Question</legend>
                      <label htmlFor={`id[${questionIndex}]`}>Id</label>
                      <Field
                        type="text"
                        id={`id[${questionIndex}]`}
                        name={`questions[${questionIndex}].id`}
                        placeholder="Id"
                      />
                      <ErrorMessage name={`questions[${questionIndex}].id`} />

                      <label htmlFor={`description[${questionIndex}]`}>
                        Description
                      </label>
                      <Field
                        type="text"
                        id={`description[${questionIndex}]`}
                        name={`questions[${questionIndex}].description`}
                        placeholder="Description"
                        as="textarea"
                      />
                      <ErrorMessage
                        name={`questions[${questionIndex}].description`}
                      />

                      <label htmlFor={`weightage[${questionIndex}]`}>
                        Weightage
                      </label>
                      <Field
                        type="number"
                        id={`weightage[${questionIndex}]`}
                        name={`questions[${questionIndex}].weightage`}
                        placeholder="Weightage"
                      />
                      <ErrorMessage
                        name={`questions[${questionIndex}].weightage`}
                      />

                      <label htmlFor={`negativeMark[${questionIndex}]`}>
                        Negative Mark
                      </label>
                      <Field
                        type="number"
                        id={`negativeMark[${questionIndex}]`}
                        name={`questions[${questionIndex}].negativeMark`}
                        placeholder="Negative Mark"
                      />
                      <ErrorMessage
                        name={`questions[${questionIndex}].negativeMark`}
                      />

                      <label htmlFor={`imageUrl[${questionIndex}]`}>
                        Image URL
                      </label>
                      <Field
                        type="text"
                        id={`imageUrl[${questionIndex}]`}
                        name={`questions[${questionIndex}].imageUrl`}
                        placeholder="Image URL"
                      />
                      <ErrorMessage
                        name={`questions[${questionIndex}].imageUrl`}
                      />

                      <label htmlFor={`noOfOptionsDisplayed[${questionIndex}]`}>
                        Number of Options Displayed
                      </label>
                      <Field
                        type="number"
                        id={`noOfOptionsDisplayed[${questionIndex}]`}
                        name={`questions[${questionIndex}].noOfOptionsDisplayed`}
                        placeholder="Number of Options Displayed"
                      />
                      <ErrorMessage
                        name={`questions[${questionIndex}].noOfOptionsDisplayed`}
                      />

                      <label htmlFor={`shuffleOptions[${questionIndex}]`}>
                        Shuffle Options
                      </label>
                      <Field
                        id={`shuffleOptions[${questionIndex}]`}
                        name={`questions[${questionIndex}].shuffleOptions`}
                        type="checkbox"
                      />
                      <ErrorMessage
                        name={`questions[${questionIndex}].shuffleOptions`}
                      />

                      <label htmlFor={`correctOptionId[${questionIndex}]`}>
                        Correct Option Id
                      </label>
                      <Field
                        type="text"
                        id={`correctOptionId[${questionIndex}]`}
                        name={`questions[${questionIndex}].correctOptionId`}
                        placeholder="Correct Option Id"
                      />
                      <ErrorMessage
                        name={`questions[${questionIndex}].correctOptionId`}
                      />

                      <h3>Options</h3>

                      <FieldArray
                        name={`questions[${questionIndex}].options`}
                        render={(optionsArrayHelpers) => (
                          <div>
                            {values.questions[questionIndex].options.map(
                              (option, optionIndex) => (
                                <fieldset
                                  key={`question_${questionIndex}_${optionIndex}`}
                                >
                                  <legend>Option</legend>

                                  <label
                                    htmlFor={`id[${questionIndex}]_[${optionIndex}]`}
                                  >
                                    Id
                                  </label>
                                  <Field
                                    type="text"
                                    id={`id[${questionIndex}]_[${optionIndex}]`}
                                    name={`questions[${questionIndex}].options[${optionIndex}].id`}
                                    placeholder="Id"
                                  />
                                  <ErrorMessage
                                    name={`questions[${questionIndex}].options[${optionIndex}.id`}
                                  />

                                  <label
                                    htmlFor={`description[${questionIndex}]_[${optionIndex}]`}
                                  >
                                    Description
                                  </label>
                                  <Field
                                    type="text"
                                    id={`description[${questionIndex}]_[${optionIndex}]`}
                                    name={`questions[${questionIndex}].options[${optionIndex}].description`}
                                    placeholder="Description"
                                    as="textarea"
                                  />
                                  <ErrorMessage
                                    name={`questions[${questionIndex}].options[${optionIndex}.description`}
                                  />

                                  <label
                                    htmlFor={`imageUrl[${questionIndex}]_[${optionIndex}]`}
                                  >
                                    Image URL
                                  </label>
                                  <Field
                                    type="text"
                                    id={`imageUrl[${questionIndex}]_[${optionIndex}]`}
                                    name={`questions[${questionIndex}].options[${optionIndex}].imageUrl`}
                                    placeholder="Image URL"
                                  />
                                  <ErrorMessage
                                    name={`questions[${questionIndex}].options[${optionIndex}.imageUrl`}
                                  />

                                  <button
                                    type="button"
                                    style={{ marginTop: "12px" }}
                                    onClick={() =>
                                      optionsArrayHelpers.remove(optionIndex)
                                    }
                                  >
                                    Remove Question
                                  </button>
                                </fieldset>
                              )
                            )}
                            <button
                              type="button"
                              onClick={() =>
                                optionsArrayHelpers.push({
                                  id: "",
                                  description: "",
                                  imageUrl: "",
                                })
                              }
                            >
                              Add a Option
                            </button>
                          </div>
                        )}
                      />
                      <button
                        type="button"
                        style={{ marginTop: "12px" }}
                        onClick={() =>
                          questionsArrayHelpers.remove(questionIndex)
                        }
                      >
                        Remove Question
                      </button>
                    </fieldset>
                  ))}
                  <button
                    type="button"
                    style={{ margin: "12px 0px" }}
                    onClick={() =>
                      questionsArrayHelpers.push({
                        id: "",
                        description: "",
                        weightage: 1,
                        negativeMark: 0,
                        imageUrl: "",
                        noOfOptionsDisplayed: 2,
                        shuffleOptions: false,
                        correctOptionId: "",
                        options: [],
                      })
                    }
                  >
                    Add a Question
                  </button>
                </div>
              )}
            />

            <span style={{ color: "red", display: "block" }}>
              {errorMessage}
            </span>
            <span style={{ color: "green", display: "block" }}>
              {successMessage}
            </span>

            <button type="submit" style={{ margin: "8px 0px" }}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}
