import React from 'react';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Box } from '@mui/material';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" className="app-bar">
        <Toolbar>
          <img
            src={`${process.env.PUBLIC_URL}/ieee-logo.png`}
            alt="IEEE Logo"
            className="logo"
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            IEEE FAQ Chatbot
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        <Box mt={5}>
          <Chatbot />
        </Box>
      </Container>
    </React.Fragment>
  );
}

export default App;
