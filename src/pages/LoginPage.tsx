import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { ConvertButton } from '../components/ytmp3/ConvertButton';
import { useAuthStore } from '../stores/authStore';

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user);
      navigate('/dashboard');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({ username, password });
  };

  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 700 }} gutterBottom>
        Welcome back
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Sign in to manage your Pinterest automation
      </Typography>

      {mutation.isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Invalid username or password
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((v) => !v)}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <ConvertButton
          type="submit"
          fullWidth
          size="large"
          disabled={mutation.isPending}
          sx={{ mt: 3, py: 1.5 }}
        >
          {mutation.isPending ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Sign in'
          )}
        </ConvertButton>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block', textAlign: 'center' }}>
        <Link component={RouterLink} to="/privacy" underline="hover">
          Privacy Policy
        </Link>
      </Typography>
    </>
  );
}
