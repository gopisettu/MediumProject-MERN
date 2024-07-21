import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Avatar, Typography, Grid, Container, Button, Alert, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, InputAdornment, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const ExpandableTypography = styled(Typography)(({ theme }) => ({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: 2,
  height: 'auto',
}));

const DialogTitleWithClose = ({ children, onClose, ...other }) => (
  <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
    {children}
    {onClose ? (
      <IconButton
        aria-label="close"
        onClose={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    ) : null}
  </DialogTitle>
);

const ArticleDetail = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateArticleData, setUpdateArticleData] = useState({ id: '', title: '', content: '' });
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchArticles = async () => {
    try {
      const userId = sessionStorage.getItem('logged'); // Get userId from sessionStorage
      if (!userId) {
        throw new Error('User not logged in');
      }

      const response = await axios.get('http://localhost:4321/articles/get', {
        params: { userId }
      });
      setArticles(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleExpandClick = (article) => {
    setSelectedArticle(article);
    setViewDialogOpen(true);
  };

  const handleDelete = async (articleId) => {
    try {
      await axios.delete(`http://localhost:4321/deleteArticle/${articleId}`);
      fetchArticles();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdate = (article) => {
    setUpdateArticleData(article);
    setUpdateDialogOpen(true);
  };

  const handleDialogClose = () => {
    setUpdateDialogOpen(false);
    setUpdateArticleData({ id: '', title: '', content: '' });
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedArticle(null);
  };

  const handleDialogSave = async () => {
    try {
      await axios.put(`http://localhost:4321/updateArticle/${updateArticleData._id}`, {
        title: updateArticleData.title,
        content: updateArticleData.content
      });
      fetchArticles();
      handleDialogClose();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDialogChange = (e) => {
    const { name, value } = e.target;
    setUpdateArticleData({ ...updateArticleData, [name]: value });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (article.userName && article.userName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        User Articles
      </Typography>
      {error && <Alert severity="error" align="center">{error}</Alert>}
      
      <Box display="flex" justifyContent="center" marginBottom={2}>
        <TextField
          label="Search Articles"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: '20%' }}
        />
      </Box>

      <Grid container spacing={4}>
        {filteredArticles.map((article) => (
          <Grid item key={article._id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', maxHeight: 300, overflow: 'hidden' }}>
              <CardHeader
                avatar={
                  <Avatar aria-label="article">
                    {article.userName ? article.userName[0] : 'A'}
                  </Avatar>
                }
                title={article.title}
                subheader={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Posted by: {article.userName || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Posted on: {new Date(article.datePosted).toLocaleString()}
                    </Typography>
                  </>
                }
              />
              <CardContent>
                <ExpandableTypography variant="body2" color="text.secondary">
                  {article.content}
                </ExpandableTypography>
                <Button
                  size="small"
                  onClick={() => handleExpandClick(article)}
                >
                  Read More
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleDelete(article._id)}
                >
                  Delete
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleUpdate(article)}
                >
                  Update
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={viewDialogOpen} onClose={handleViewDialogClose} maxWidth="md" fullWidth>
        <DialogTitleWithClose onClose={handleViewDialogClose}>
          {selectedArticle?.title}
        </DialogTitleWithClose>
        <DialogContent>
          <Typography variant="subtitle1" color="text.secondary">
            Posted by: {selectedArticle?.userName || 'Unknown'}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Posted on: {new Date(selectedArticle?.datePosted).toLocaleString()}
          </Typography>
          <Typography variant="body1" color="text.primary" paragraph>
            {selectedArticle?.content}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDelete(selectedArticle._id)} color="secondary">
            Delete
          </Button>
          <Button onClick={() => handleUpdate(selectedArticle)} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={updateDialogOpen} onClose={handleDialogClose}>
        <DialogTitleWithClose onClose={handleDialogClose}>
          Update Article
        </DialogTitleWithClose>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            value={updateArticleData.title}
            onChange={handleDialogChange}
          />
          <TextField
            margin="dense"
            name="content"
            label="Content"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={updateArticleData.content}
            onChange={handleDialogChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogSave} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ArticleDetail;
