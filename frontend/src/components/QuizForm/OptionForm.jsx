import { Formik, Field } from "formik";

export default function OptionForm({ option }) {
  return (
    <>
      <Formik
        initialValues={option}
        onSubmit={async (values) => {
          alert(JSON.stringify(values, null, 2));
        }}
      >
        {({ values, setFieldValue }) => (
          <fieldset>
            <legend>Option</legend>
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

            <label htmlFor="imageUrl">Image URL</label>
            <Field
              type="text"
              id="imageUrl"
              name="imageUrl"
              placeholder="Image URL"
            />
          </fieldset>
        )}
      </Formik>
    </>
  );
}
