import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Snackbar, Alert } from '@mui/material';

function Signup() {
  const [user, setUser] = useState({
    userId: '',
    userName: '',
    userPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4321/signup', user);
      setSuccess('Signup successful!');
      setOpenSnackbar(true);
      setUser({ userId: '', userName: '', userPassword: '' });
      setError('');
      // Redirect to login page after 2 seconds
      setTimeout(() => window.location.assign('/login'), 2000);
    } catch (error) {
      setError(error.response.data.error || 'Error signing up');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>Signup</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="User ID"
          name="userId"
          value={user.userId}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="userName"
          value={user.userName}
          onChange={handleChange}
          required
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          name="userPassword"
          value={user.userPassword}
          onChange={handleChange}
          required
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 2 }}
        >
          Signup
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ top: 20 }}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'}>
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Signup;
