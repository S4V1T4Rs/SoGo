import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import Routes from 'routes';
import themes from 'themes';
import NavigationScroll from 'layout/NavigationScroll';

const App = () => {
  const customization = useSelector((state) => state.customization);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <Router>
          {' '}
          {/* Aquí debe estar el BrowserRouter */}
          <NavigationScroll>
            <Routes />
          </NavigationScroll>
        </Router>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
