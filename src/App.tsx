import { useFormik } from 'formik';
import './App.css';

const reactAppApi = process.env.REACT_APP_API;
if (!reactAppApi) {
  throw new Error('Please provide REACT_APP_API');
}

const initialUser = {
  firstName: '',
  lastName: '',
  age: 0,
  email: '',
};
type User = typeof initialUser;

const onSubmitUser = (user: User): Promise<{ id: string }> => {
  return fetch(reactAppApi, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(user),
  }).then((res) => res.json());
};

function App() {
  const { handleSubmit, getFieldProps } = useFormik({
    initialValues: initialUser,
    onSubmit: onSubmitUser,
  });
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <label>
          First Name
          <input type="text" {...getFieldProps('firstName')} />
        </label>
        <label>
          Last Name
          <input type="text" {...getFieldProps('lastName')} />
        </label>
        <label>
          Age
          <input type="number" {...getFieldProps('age')} />
        </label>
        <label>
          Email
          <input type="email" {...getFieldProps('email')} />
        </label>
        <input type="submit" />
      </form>
    </div>
  );
}

export default App;
