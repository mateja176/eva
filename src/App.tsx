import {
  Button,
  ButtonGroup,
  Container,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React from 'react';
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

const onSubmitUser = async (user: User): Promise<{ id: string }> => {
  const res = await fetch(reactAppApi, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(user),
  });
  return await res.json();
};

function App() {
  const { handleSubmit, getFieldProps, resetForm, isSubmitting } = useFormik({
    initialValues: initialUser,
    onSubmit: onSubmitUser,
  });
  const handleReset: React.MouseEventHandler = React.useCallback(() => {
    resetForm();
  }, [resetForm]);
  return (
    <Container className="App" marginTop={16}>
      <form onSubmit={handleSubmit}>
        <FormLabel>
          First Name
          <Input type="text" {...getFieldProps('firstName')} />
        </FormLabel>
        <FormLabel>
          Last Name
          <Input type="text" {...getFieldProps('lastName')} />
        </FormLabel>
        <FormLabel>
          Age
          <Input type="number" {...getFieldProps('age')} />
        </FormLabel>
        <FormLabel>
          Email
          <Input type="email" {...getFieldProps('email')} />
        </FormLabel>
        <ButtonGroup>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
            Submit
          </Button>
          <Button onClick={handleReset} variant="outline" colorScheme="pink">
            Reset
          </Button>
        </ButtonGroup>
      </form>
    </Container>
  );
}

export default App;
