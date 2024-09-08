import { useState, useEffect, useRef } from 'react';
import { Box, Stack, Typography, TextField, Button, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';

export default function MechanicChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi! I'm your MechaniCare assistant. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const stackRef = useRef(null);

  // Autoscroll to the latest message
  useEffect(() => {
    if (stackRef.current) {
      stackRef.current.scrollTop = stackRef.current.scrollHeight;
    }
  }, [messages]);

  // Function to send a message
  const sendMessage = async () => {
    if (!message.trim()) return;

    // Clear the input and add user message to the state
    setMessage('');
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' }, // Placeholder for the AI response
    ]);

    // Call API with chat history
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let result = '';

    // Read the stream for AI response and update the chat
    reader.read().then(function processText({ done, value }) {
      if (done) return result;

      const text = decoder.decode(value || new Uint8Array(), { stream: true });
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const lastMessage = updatedMessages.pop();
        return [
          ...updatedMessages,
          { ...lastMessage, content: lastMessage.content + text },
        ];
      });

      return reader.read().then(processText);
    });
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      sx={{
        background: 'linear-gradient(135deg, #0099FF, #CDEFFF)', // Updated MechaniCare theme colors
        padding: 0,
        margin: 0,
      }}
    >
      <Stack
        direction="column"
        width="500px"
        height="90vh"
        border="1px solid black"
        borderRadius={4}
        p={2}
        spacing={2}
        sx={{ backgroundColor: "#E1C9FE" }}
      >
        <Box
          width="100%"
          height="50px"
          sx={{ backgroundColor: "#0099FF" }}
          borderRadius={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding={1}
        >
          <Typography variant="h5" color="white">MechaniCare Chatbot</Typography>
        </Box>

        <Divider sx={{ width: '100%', borderBottomWidth: 2 }} />

        <Stack
          direction="column"
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
          ref={stackRef}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={message.role === 'assistant' ? '#E1F5FF' : '#0099FF'}
                color="black"
                borderRadius={16}
                mx={2}
                padding={2}
                sx={{ whiteSpace: 'pre-wrap' }}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                sendMessage();
              }
            }}
            onChange={(e) => setMessage(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'grey.500' },
                '&:hover fieldset': { borderColor: 'grey.700' },
                '&.Mui-focused fieldset': { borderColor: '#0099FF' },
              },
              '& .MuiInputLabel-root': {
                color: 'grey.900',
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: 'grey.700',
              },
            }}
          />
          <Button
            sx={{
              backgroundColor: "#0099FF",
              '&:hover': { backgroundColor: "#007ACC" },
            }}
            variant="contained"
            onClick={sendMessage}
          >
            Send
          </Button>
        </Stack>
      </Stack>

      <Box
        onClick={() => router.push("/dashboard")}
        sx={{
          position: 'fixed',
          top: '1vw',
          left: '1vw',
          backgroundColor: '#0099FF',
          color: 'white',
          padding: 2,
          borderRadius: 2,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': { backgroundColor: "#007ACC" },
        }}
      >
        <ArrowBackIcon />
      </Box>
    </Box>
  );
}