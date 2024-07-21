import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

const ExpandableTypography = styled(Typography)(({ theme }) => ({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  WebkitLineClamp: 3,
  height: 'auto',
}));

const DialogTitleWithClose = ({ children, onClose, ...other }) => (
  <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
    {children}
    {onClose ? (
      <IconButton
        aria-label="close"
        onClick={onClose}
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

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

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

  const handleExpandClick = (article) => {
    setSelectedArticle(article);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedArticle(null);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (article.userName && article.userName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!sessionStorage.getItem('logged')) {
    navigate("/signup");
    return null;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        All Articles
      </Typography>
      {error && <Typography color="error" align="center">{error}</Typography>}
      
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
            <Card sx={{ height: '100%' }}>
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
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* View Article Dialog */}
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
      </Dialog>
    </Container>
  );
};

export default Home;
