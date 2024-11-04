import { Outlet } from 'react-router-dom';

import Navigation from '@/components/Navigation/Navigation';
import { Container } from '@mui/material';

const Layout = () => {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <main>
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
};

export default Layout;
