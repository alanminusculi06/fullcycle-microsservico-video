import React from 'react';
import { Box, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import { Navbar } from './components/Navbar';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import Breadcrumbs from './components/Breadcrumbs';
import theme from './theme';
import { SnackbarProvider } from './components/SnackbarProvider';
import Spinner from './components/Spinner';
import { LoadingProvider } from './components/Loading/LoadingProvider';

const App: React.FC = () => {
  return (
    <React.Fragment>
      <LoadingProvider>
        <MuiThemeProvider theme={theme}>
          <SnackbarProvider>
            <CssBaseline />
            <BrowserRouter>
              <Spinner />
              <Navbar />
              <Box paddingTop={'70px'}>
                <Breadcrumbs />
                <AppRouter />
              </Box>
            </BrowserRouter>
          </SnackbarProvider>
        </MuiThemeProvider>
      </LoadingProvider>
    </React.Fragment>
  );
}

export default App;
