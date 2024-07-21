import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Home from './Home';
import Signup from './Signup';
import Login from './Login';
import NewPost from './NewPost';
import ArticlesDetails from './ArticleDetail';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import './App.css';

function App() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [userData, setUserData] = useState({});
  const [postCount, setPostCount] = useState(0);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = async () => {
    setOpenProfile(true);
    handleCloseMenu();

    try {
      const userId = sessionStorage.getItem('logged');
      const response = await axios.get(`http://localhost:4321/profile/${userId}`);
      setUserData(response.data);

      const postResponse = await axios.get(`http://localhost:4321/posts/count/${userId}`);
      setPostCount(postResponse.data.count);
    } catch (error) {
      console.error('Error fetching user data', error);
    }
  };

  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('logged');
    sessionStorage.removeItem('id');
    window.location.assign('/'); // Redirect to the homepage or login page
    handleCloseMenu();
  };

  return (
    <Router>
      <div className="App">
        <Navbar expand="lg" className="navbar-custom">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">Medium</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
              <Nav className="ms-auto mb-2 mb-lg-0">
                {!sessionStorage.getItem('logged') ? (
                  <>
                    <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/Home">Home</Nav.Link>
                    <Nav.Link as={Link} to="/new">Create Post</Nav.Link>
                    <Nav.Link as={Link} to="/Articles">User Cart</Nav.Link>
                    <div>
                      <IconButton
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                      >
                        <AccountCircle />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleCloseMenu}
                      >
                        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </Menu>
                    </div>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="content">
          <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/new" element={<NewPost />} />
            <Route path="/Articles" element={<ArticlesDetails />} />
          </Routes>
        </Container>

        <Dialog open={openProfile} onClose={handleCloseProfile}>
          <DialogTitle>Profile</DialogTitle>
          <DialogContent>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Username: {userData.userName || 'Loading...'}
                </Typography>
                <Typography variant="body1">
                  ID: {userData._id || 'Loading...'}
                </Typography>
                <Typography variant="body1">
                  Number of Posts: {postCount || 'Loading...'}
                </Typography>
              </CardContent>
              <CardActions>
                <Grid container direction="column" alignItems="center" spacing={2}>
                  <Grid item>
                    <Button variant="contained" color="primary" component={Link} to="/signup">
                      Create New Account
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" color="primary" component={Link} to="/login">
                      Already Have an Account
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: 'red', color: 'white' }}
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </Grid>
                </Grid>
              </CardActions>
            </Card>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseProfile} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Router>
  );
}

export default App;
