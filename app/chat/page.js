"use client";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Button, Divider, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function MechanicChat() {
    const router = useRouter();

    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Hi! I'm your MechaniCare assistant. How can I help you today?`,
        },
    ]);
    const [message, setMessage] = useState('');

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

        setMessages((prevMessages) => [
            ...prevMessages,
            { role: 'user', content: message },
            { role: 'assistant', content: '' }, // Placeholder for AI response
        ]);

        try {
            const response = await fetch('/api/chat_api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([...messages, { role: 'user', content: message }]),
            });

            if (!response.ok) {
                console.error('Failed to send message');
                return;
            }

            const data = await response.json();

            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages];
                const lastMessage = updatedMessages.pop();
                return [
                    ...updatedMessages,
                    { ...lastMessage, content: data.message },
                ];
            });

            setMessage(''); // Clear the message input
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setMessage("")
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
                background: 'linear-gradient(200deg, #55BBFF, #79D4FF)', // Updated MechaniCare theme colors
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
                    {messages.map((msg, index) => (
                        <Box
                            key={index}
                            display="flex"
                            justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
                        >
                            <Box
                                bgcolor={msg.role === 'assistant' ? '#F0F0F0' : '#0162FF'}
                                color={msg.role === 'assistant' ? 'black' : 'white'}
                                //color="white"
                                borderRadius={15}
                                mx={2}
                                padding={2.5}
                                sx={{ whiteSpace: 'pre-wrap' }}
                            >
                                {msg.content}
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
                    backgroundColor: '#EFEEEE',
                    color: 'black',
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '&:hover': { backgroundColor: "#CECECE" },
                }}
            >
                <ArrowBackIcon />
            </Box>
        </Box>
    );
}