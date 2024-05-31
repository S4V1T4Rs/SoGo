// Login.js
import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Grid, Typography, Button, CircularProgress, TextField } from '@mui/material';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from 'api/config/configfire';

import AuthWrapper1 from '../AuthWrapper1';
import Logo from 'ui-component/Logo';
import { loginSuccess } from 'store/actionAuth';

import { getCandidates } from 'views/pages/Candidatos/Controller/CandidateController';

const Login = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  
  const handleLogin = async () => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      const user = await getCandidates(); // Función para obtener el usuario de Firebase
      dispatch(loginSuccess(user));
      setLoggedIn(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <AuthWrapper1>
      <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Logo />
        </Grid>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Bienvenido al Sistema
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <TextField label="Correo Electrónico" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
        </Grid>
        <Grid item xs={12} sx={{ mb: 2 }}>
          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        {error && (
          <Grid item xs={12} sx={{ mb: 2 }}>
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12} sx={{ mb: 2 }}>
          <Button variant="contained" color="primary" fullWidth onClick={handleLogin} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body2">
            ¿No tienes una cuenta? <Link to="/registro">Regístrate aquí</Link>
          </Typography>
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
