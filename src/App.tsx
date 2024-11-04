import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';

import Layout from '@/components/Layout/Layout';
import ErrorPage from '@/components/ErrorPage/ErrorPage';
import Tracker from '@/containers/Tracker/Tracker';
import Editor from '@/containers/Editor/Editor';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} errorElement={<ErrorPage />}>
      <Route index element={<Tracker />} />
      <Route path='meals'>
        <Route index element={<Tracker />} />
        <Route path='new' element={<Editor />} />
        <Route path=':id' element={<Editor />} />
      </Route>
    </Route>
  )
);

function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <RouterProvider router={router} />
      </LocalizationProvider>
    </>
  );
}

export default App;
