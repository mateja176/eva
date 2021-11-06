import {
  Alert,
  Button,
  ButtonGroup,
  Container,
  FormLabel,
  Input,
  useToast,
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
  const toast = useToast();
  const {
    handleSubmit,
    getFieldProps,
    resetForm,
    isSubmitting,
    initialValues,
    values,
  } = useFormik({
    initialValues: initialUser,
    onSubmit: (values) =>
      onSubmitUser(values)
        .then(() => {
          toast({
            title: 'User Submitted',
            description: 'User was successfully submitted.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        })
        .catch(() => {
          toast({
            title: 'Failed to Submit',
            description:
              'An error happened while submitting, please try again.',
            status: 'error',
            duration: 10000,
            isClosable: true,
          });
        }),
  });
  const handleReset: React.MouseEventHandler = React.useCallback(() => {
    resetForm();
  }, [resetForm]);
  const hasUpdates = React.useMemo(() => {
    return Object.entries(values).some(
      ([key, value]) => value !== initialValues[key as keyof User],
    );
  }, [initialValues, values]);
  return (
    <Container className="App" marginTop={16}>
      <Alert
        status="warning"
        style={{ visibility: hasUpdates ? 'hidden' : 'visible' }}
        marginBottom={8}
      >
        Please fill in the form
      </Alert>
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
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            disabled={!hasUpdates}
          >
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
