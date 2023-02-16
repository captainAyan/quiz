import { useEffect, useState } from "react";
import { Formik, Field, Form, FieldArray } from "formik";
import QuestionForm from "./QuestionForm";

export default function MainForm({ data }) {
  return (
    <>
      <Formik
        initialValues={data}
        onSubmit={async (values) => {
          alert(JSON.stringify(values, null, 2));
          console.log(values);
        }}
      >
        {({ values, setFieldValue }) => (
          <fieldset>
            <legend>Details</legend>
            <Form>
              <label htmlFor="title">Title</label>
              <Field type="text" id="title" name="title" placeholder="Title" />

              <label htmlFor="description">Description</label>
              <Field
                type="text"
                id="description"
                name="description"
                placeholder="Description"
                as="textarea"
              />

              <label htmlFor="duration">Duration</label>
              <Field
                type="number"
                id="duration"
                name="duration"
                placeholder="Duration"
                step="60000"
              />
              <span>
                {(() => {
                  var millis = values.duration;
                  var minutes = Math.floor(millis / 60000);
                  var seconds = ((millis % 60000) / 1000).toFixed(0);

                  return seconds == 60
                    ? minutes + 1 + ":00"
                    : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
                })()}{" "}
                (mm:ss)
              </span>

              <label htmlFor="published">Published</label>
              <Field id="published" name="published" type="checkbox" />

              <label htmlFor="shuffleQuestions">Shuffle Questions</label>
              <Field
                id="shuffleQuestions"
                name="shuffleQuestions"
                type="checkbox"
              />

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
                      padding: "4px 8px",
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

                        <label htmlFor={`weightage[${questionIndex}]`}>
                          Weightage
                        </label>
                        <Field
                          type="number"
                          id={`weightage[${questionIndex}]`}
                          name={`questions[${questionIndex}].weightage`}
                          placeholder="Weightage"
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

                        <label htmlFor={`imageUrl[${questionIndex}]`}>
                          Image URL
                        </label>
                        <Field
                          type="text"
                          id={`imageUrl[${questionIndex}]`}
                          name={`questions[${questionIndex}].imageUrl`}
                          placeholder="Image URL"
                        />

                        <label
                          htmlFor={`noOfOptionsDisplayed[${questionIndex}]`}
                        >
                          Number of Options Displayed
                        </label>
                        <Field
                          type="number"
                          id={`noOfOptionsDisplayed[${questionIndex}]`}
                          name={`questions[${questionIndex}].noOfOptionsDisplayed`}
                          placeholder="Number of Options Displayed"
                        />

                        <label htmlFor={`shuffleOptions[${questionIndex}]`}>
                          Shuffle Options
                        </label>
                        <Field
                          id={`shuffleOptions[${questionIndex}]`}
                          name={`questions[${questionIndex}].shuffleOptions`}
                          type="checkbox"
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

                                    <button
                                      type="button"
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

              <button type="submit">Submit</button>
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </Form>
          </fieldset>
        )}
      </Formik>
    </>
  );
}
