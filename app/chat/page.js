"use client";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useUser, useAuth } from "@clerk/nextjs"

export default function MechanicChat() {

    const { isLoaded, isSignedIn, user } = useUser();
    const router = useRouter();
    
    const userId = user?.id;

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/');
        }
    }, [isLoaded, isSignedIn, router]);

    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `Hi! I'm your MechaniCare assistant. How can I help you today?`,
        },
    ]);
    const [message, setMessage] = useState('');
    const [openModal, setOpenModal] = useState(false); // State to control the modal

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


    const handleAddClick = async () => {
        if (!inputText.trim()) {
            alert('Please enter a recommendation.');
            return;
        }

        if (!userId) {
            alert('User not authenticated.');
            return;
        }

        try {
            const response = await fetch('/api/update_recommendation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, recommendation: inputText }), // Correct field names
            });

            const data = await response.json();
            if (response.ok) {
                alert('Recommendation added successfully!');
                setInputText(''); // Clear input field
                setOpenModal(false); // Close the modal
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('An error occurred while adding the recommendation.');
        }
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
                sx={{ backgroundColor: "#F1E9FB" }}
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
                                bgcolor={msg.role === 'assistant' ? '#D7D7D7' : '#0162FF'}
                                color={msg.role === 'assistant' ? 'black' : 'white'}
                                borderRadius={15}
                                mx={2}
                                padding={2.8}
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

            {/* Floating button to open the modal */}
            <Box
                onClick={() => setOpenModal(true)}
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="15vw"
                height="15vh"
                sx={{
                    position: 'fixed',
                    top: '1vw',
                    right: '1vw',
                    backgroundColor: '#0099FF',
                    color: 'white',
                    padding: 2,
                    borderRadius: '50%',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#007ACC' },
                }}
            >
                <Typography variant="h15">Save reccomendation</Typography>
            </Box>

            {/* Modal for adding recommendations */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Add Recommendation</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Recommendation"
                        fullWidth
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary">
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddClick}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

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