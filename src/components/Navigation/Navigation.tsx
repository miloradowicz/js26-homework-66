import { AppBar, Toolbar, Typography } from '@mui/material';

const Navigation = () => {
  return (
    <AppBar position='static' component='nav'>
      <Toolbar>
        <Typography variant='h6' sx={{ flexGrow: 1 }}>
          Calorie tracker
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
