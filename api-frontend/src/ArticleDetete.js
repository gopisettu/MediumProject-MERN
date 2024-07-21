import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Avatar, Typography, Grid, Container, Button, Alert, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

const ExpandableTypography = styled(Typography)(({ theme }) => ({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: 3,
  height: 'auto',
}));

const ArticleDetail = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateArticleData, setUpdateArticleData] = useState({ id: '', title: '', content: '' });

  // Fetch all articles
  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:4321/articles'); // Updated endpoint
      setArticles(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchArticles(); // Fetch articles on component mount
  }, []);

  const handleExpandClick = (articleId) => {
    setExpandedArticle(expandedArticle === articleId ? null : articleId);
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

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        All Articles
      </Typography>
      {error && <Alert severity="error" align="center">{error}</Alert>}
      <Grid container spacing={4}>
        {articles.map((article) => (
          <Grid item key={article._id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                avatar={
                  <Avatar aria-label="article">
                    {article.userName ? article.userName[0] : 'A'}
                  </Avatar>
                }
                title={article.title}
                subheader={`Posted by: ${article.userName || 'Unknown'}`}
              />
              <CardContent>
                {expandedArticle === article._id ? (
                  <Typography variant="body2" color="text.secondary">
                    {article.content}
                  </Typography>
                ) : (
                  <ExpandableTypography variant="body2" color="text.secondary">
                    {article.content}
                  </ExpandableTypography>
                )}
                <Button
                  size="small"
                  onClick={() => handleExpandClick(article._id)}
                >
                  {expandedArticle === article._id ? 'Show Less' : 'Read More'}
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

      <Dialog open={updateDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Update Article</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the title and content of the article.
          </DialogContentText>
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
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ArticleDetail;
