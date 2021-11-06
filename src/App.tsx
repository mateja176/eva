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
import * as yup from 'yup';
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
const userSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  age: yup.number().required().min(1).max(150),
  email: yup.string().email().required(),
});

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
    errors,
    touched,
    isValid,
  } = useFormik({
    initialValues: initialUser,
    validationSchema: userSchema,
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
  const ageProps = getFieldProps('age');
  return (
    <Container className="App" marginTop={16}>
      <Alert
        status="warning"
        style={{ visibility: hasUpdates && isValid ? 'hidden' : 'visible' }}
        marginBottom={8}
      >
        Please fill in the form
      </Alert>
      <form onSubmit={handleSubmit}>
        <FormLabel>
          First Name
          <Input
            {...getFieldProps('firstName')}
            type="text"
            placeholder="John"
            isInvalid={touched.firstName && !!errors.firstName}
          />
          <div style={{ visibility: errors.firstName ? 'visible' : 'hidden' }}>
            {touched.firstName && errors.firstName}
          </div>
        </FormLabel>
        <FormLabel>
          Last Name
          <Input
            {...getFieldProps('lastName')}
            type="text"
            placeholder="Doe"
            isInvalid={touched.lastName && !!errors.lastName}
          />
          <div style={{ visibility: errors.lastName ? 'visible' : 'hidden' }}>
            {touched.lastName && errors.lastName}
          </div>
        </FormLabel>
        <FormLabel>
          Age
          <Input
            {...ageProps}
            value={ageProps.value || ''}
            type="number"
            placeholder="30"
            isInvalid={touched.age && !!errors.age}
          />
          <div style={{ visibility: errors.age ? 'visible' : 'hidden' }}>
            {touched.age && errors.age}
          </div>
        </FormLabel>
        <FormLabel>
          Email
          <Input
            {...getFieldProps('email')}
            type="email"
            placeholder="john@doe.com"
            isInvalid={touched.email && !!errors.email}
          />
          <div style={{ visibility: errors.email ? 'visible' : 'hidden' }}>
            {touched.email && errors.email}
          </div>
        </FormLabel>
        <ButtonGroup>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            disabled={!hasUpdates || !isValid}
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
