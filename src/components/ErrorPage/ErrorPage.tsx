import { Container } from '@mui/material';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  let errorMessage: string;

  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    console.log(error);

    errorMessage = 'Unidentified error. Check out the console for details.';
  }

  return (
    <>
      <Container>
        <h3>Error</h3>
        <p>{errorMessage}</p>
      </Container>
    </>
  );
};

export default ErrorPage;
