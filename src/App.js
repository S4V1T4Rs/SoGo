import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import React from 'react';

import themes from 'themes';
import NavigationScroll from 'layout/NavigationScroll';
import Login from 'views/pages/authentication/authentication3/Login3';

import { ProtectedRoute } from 'Private/privateRouter';
import ThemeRoutes from 'routes';
import { useEffect } from 'react';
import { checkAuthStatus } from 'store/actionAuth';
import { useDispatch } from 'react-redux';

const App = () => {
  const customization = useSelector((state) => state.customization);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus()); // Verificar el estado de autenticación al cargar la aplicación
  }, [dispatch]);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />

        <NavigationScroll>
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/">
                  <ThemeRoutes />
                </ProtectedRoute>
              }
            />
            {/* Otras rutas */}
          </Routes>
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
