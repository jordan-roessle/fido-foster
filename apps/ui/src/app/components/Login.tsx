import {SyntheticEvent, useState} from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import {login} from '../../api';

interface LoginProps {
  onLogin: () => void;
}

export const Login = ({onLogin}: LoginProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError(null);
    try {
      await login(password);
      onLogin();
    } catch {
      setError('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <Typography variant="h5">Fido Foster Community</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={loading}
        autoFocus
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading || !password}
        startIcon={loading ? <CircularProgress size={16} /> : null}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </Box>
  );
};
