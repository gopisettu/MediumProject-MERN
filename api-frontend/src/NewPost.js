import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function NewPost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userId = sessionStorage.getItem('logged');
    if (!userId) {
      navigate('/signup');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'content') {
      setContent(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('logged');
    if (!userId) {
      setError('User not logged in');
      return;
    }

    const articleData = {
      title,
      content,
      userId,
    };

    try {
      const response = await axios.post('http://localhost:4321/postArticle', articleData);
      setSuccess(response.data.message);
      setTitle('');
      setContent('');
      setError(null);
    } catch (error) {
      console.error('Error posting article:', error.response?.data?.error || error.message);
      setError(error.response?.data?.error || 'Error posting article');
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="sm" className="mt-5">
      <Typography variant="h4" gutterBottom align="center">
        New Post
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            name="title"
            value={title}
            onChange={handleChange}
            required
          />
        </Box>
        <Box mb={2}>
          <TextField
            fullWidth
            label="Content"
            variant="outlined"
            name="content"
            value={content}
            onChange={handleChange}
            required
            multiline
            rows={4}
          />
        </Box>
        <Box textAlign="center">
          <Button type="submit" variant="contained" color="primary">
            Post Article
          </Button>
        </Box>
      </form>
      {success && <Alert severity="success" className="mt-3">{success}</Alert>}
      {error && <Alert severity="error" className="mt-3">{error}</Alert>}
    </Container>
  );
}

export default NewPost;
