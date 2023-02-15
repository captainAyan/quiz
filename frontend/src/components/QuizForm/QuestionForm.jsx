import { Formik, Field } from "formik";
import OptionForm from "./OptionForm";

export default function QuestionForm({ question }) {
  return (
    <>
      <Formik
        initialValues={question}
        onSubmit={async (values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      >
        {({ values, setFieldValue }) => (
          <fieldset>
            <legend>Question</legend>
            <label htmlFor="id">Id</label>
            <Field type="text" id="title" name="id" placeholder="Id" />

            <label htmlFor="description">Description</label>
            <Field
              type="text"
              id="description"
              name="description"
              placeholder="Description"
              as="textarea"
            />

            <label htmlFor="weightage">Weightage</label>
            <Field
              type="number"
              id="weightage"
              name="weightage"
              placeholder="Weightage"
            />

            <label htmlFor="negativeMark">Negative Mark</label>
            <Field
              type="number"
              id="negativeMark"
              name="negativeMark"
              placeholder="Negative Mark"
            />

            <label htmlFor="imageUrl">Image URL</label>
            <Field
              type="text"
              id="imageUrl"
              name="imageUrl"
              placeholder="Image URL"
            />

            <label htmlFor="noOfOptionsDisplayed">
              Number of Options Displayed
            </label>
            <Field
              type="number"
              id="noOfOptionsDisplayed"
              name="noOfOptionsDisplayed"
              placeholder="Number of Options Displayed"
            />

            <label htmlFor="shuffleOptions">Shuffle Options</label>
            <Field id="shuffleOptions" name="shuffleOptions" type="checkbox" />

            <label htmlFor="correctOptionId">Correct Option Id</label>
            <Field
              type="text"
              id="correctOptionId"
              name="correctOptionId"
              placeholder="Correct Option Id"
            />

            <h3>Options</h3>

            <div>
              {question.options.map((option, i) => (
                <OptionForm option={option} key={i} />
              ))}
            </div>
          </fieldset>
        )}
      </Formik>
    </>
  );
}
