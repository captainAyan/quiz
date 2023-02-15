import { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
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

              <div>
                {values.questions.map((question, i) => (
                  <QuestionForm question={question} key={i} />
                ))}
              </div>

              <button type="submit">Submit</button>
              {/* <pre>{JSON.stringify(values, null, 2)}</pre> */}
            </Form>
          </fieldset>
        )}
      </Formik>
    </>
  );
}
