import React, { useState } from 'react';
import { Box, Paper, TextField, Button, CircularProgress, Typography, Divider } from '@mui/material';
import './Chatbot.css';

function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const data = await response.json();
      const newBotMessages = [...newMessages, { sender: 'bot', text: data.answer }];
      setMessages(newBotMessages);
    } catch (error) {
      const errorMessage = [...newMessages, { sender: 'bot', text: 'Error: Failed to get response.' }];
      setMessages(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className="chat-container" elevation={3}>
      <Box className="chat-box">
        {messages.map((msg, idx) => (
          <Box key={idx} className={`message ${msg.sender}`}>
            <Typography variant="body1">{msg.text}</Typography>
          </Box>
        ))}
        {loading && (
          <Box className="loading">
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
      <Divider />
      <Box className="input-box">
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <Button variant="contained" color="primary" onClick={handleSend} disabled={loading}>
          Send
        </Button>
      </Box>
    </Paper>
  );
}

export default Chatbot;
