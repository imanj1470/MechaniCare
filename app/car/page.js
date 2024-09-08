"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Layout, Loading } from "../components/Layout.js"; // Ensure the path is correct

import { useSearchParams } from "next/navigation";
import { Container, Tooltip, Typography, List, ListItem, ListItemText, Alert, Box, IconButton, TextField, Modal, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import the dropdown icon
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

export default function Car() {
    const { isLoaded, isSignedIn } = useUser();
    const [carDetails, setCarDetails] = useState(null);
    const [mileage, setMileage] = useState(""); // Added mileage state
    const [modalOpen, setModalOpen] = useState(false); // State to control modal visibility
    const router = useRouter(); // Initialize useRouter
    const searchParams = useSearchParams();
    const search = searchParams.get("id");
    const [error, setError] = useState(null);
    const [showAttributes, setShowAttributes] = useState(false);
    const [showRecalls, setShowRecalls] = useState(false);
    const recallsRef = useRef(null);
    const attributesRef = useRef(null);

    const attributesRef = useRef(null);
    const recallsRef = useRef(null);

    // Redirect to home if not signed in
    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/');
        }
    }, [isLoaded, isSignedIn, router]);

    // Fetch car details
    useEffect(() => {
        async function getCarDetails() {
            try {
                const response = await fetch('/api/fetch_data', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                const vins = data.data;

                const foundCar = vins.find(record => record.vin === search);
                if (foundCar) {
                    setCarDetails(foundCar);
                    setMileage(foundCar.mileage || ""); // Set mileage from car details
                } else {
                    alert("Vin not found. Return to dashboard.")
                }

            } catch (error) {
                console.error('Error fetching VIN data:', error.message);
                setError(error.message);
            }
        }

        if (search) {
            getCarDetails();
        }
    }, [search]);

    // Handle clicks outside of the dropdowns
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (attributesRef.current && !attributesRef.current.contains(event.target)) {
                setShowAttributes(false);
            }
            if (recallsRef.current && !recallsRef.current.contains(event.target)) {
                setShowRecalls(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleToggleAttributes = () => setShowAttributes(prev => !prev);
    const handleToggleRecalls = () => setShowRecalls(prev => !prev);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleMileageChange = (event) => setMileage(event.target.value);

    const handleSubmitMileage = async () => {
        try {
            const response = await fetch('/api/update_mileage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ vin: search, mileage })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Mileage updated:', data);
            setCarDetails(prev => ({ ...prev, mileage }));
            handleCloseModal();
        } catch (error) {
            console.error('Error updating mileage:', error.message);
            setError(error.message);
        }
    };

    if (!isLoaded || !isSignedIn) {
        return <Loading />;
    }

    return (
        <Layout>
            <Container>
                {error && <Alert severity="error">{error}</Alert>}

                {carDetails ? (
                    <Box mt={4}>
                        <Box display="flex" justifyContent="center">
                            <Typography variant="h4" gutterBottom>
                                Car Details for VIN: {search}
                            </Typography>
                        </Box>
                        {/* Mileage Button */}
                        <Box mb={2} display="flex" justifyContent="center">
                            <Tooltip title="Click to set the mileage" arrow>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleOpenModal}
                                    sx={{
                                        borderRadius: '20px', // Rounded corners
                                        padding: '10px 20px', // Adjust padding for better appearance
                                        textTransform: 'none', // Prevent uppercase text transformation
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Add shadow for a subtle 3D effect
                                        '&:hover': {
                                            backgroundColor: '#006bb3', // Darker shade on hover
                                            boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.15)', // Stronger shadow on hover
                                        },
                                    }}
                                >
                                    Set Mileage
                                </Button>
                            </Tooltip>
                        </Box>

                        {/* Attributes Section */}
                        <Box mb={2} border={1} borderColor="divider" borderRadius={2} sx={{ backgroundColor: 'white', p: 2 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Typography variant="h6" sx={{ marginRight: 1 }}>
                                    Attributes
                                </Typography>
                                <IconButton onClick={handleToggleAttributes}>
                                    {showAttributes ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </Box>
                            {showAttributes && (
                                <Box ref={attributesRef} p={2} border={1} borderColor="divider" borderRadius={2} sx={{ backgroundColor: '#f5f5f5' }}>
                                    <List>
                                        {Object.entries(carDetails.attributes).map(([key, value]) => (
                                            <ListItem key={key}>
                                                <ListItemText
                                                    primary={key}
                                                    secondary={value}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                        </Box>

                        {/* Recalls Section */}
                        <Box mb={2} border={1} borderColor="divider" borderRadius={2} sx={{ backgroundColor: 'white', p: 2 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                                <Typography variant="h6" sx={{ marginRight: 1 }}>
                                    Recalls
                                </Typography>
                                <IconButton onClick={handleToggleRecalls}>
                                    {showRecalls ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </Box>
                            {showRecalls && (
                                <Box ref={recallsRef} p={2} border={1} borderColor="divider" borderRadius={2} sx={{ backgroundColor: '#f5f5f5' }}>
                                    <List>
                                        {Object.entries(carDetails.recalls).map(([key, value]) => (
                                            <ListItem key={key}>
                                                <ListItemText
                                                    primary={key}
                                                    secondary={value}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                        </Box>

                        {/* Mileage Modal */}
                        <Modal
                            open={modalOpen}
                            onClose={handleCloseModal}
                            aria-labelledby="modal-title"
                            aria-describedby="modal-description"
                        >
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 400,
                                bgcolor: 'background.paper',
                                border: '2px solid #000',
                                boxShadow: 24,
                                p: 4,
                                borderRadius: 2
                            }}>
                                <Typography id="modal-title" variant="h6" component="h2">
                                    Update Mileage
                                </Typography>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Mileage"
                                    variant="outlined"
                                    value={mileage}
                                    onChange={handleMileageChange}
                                    type="number"
                                />
                                <Box display="flex" justifyContent="flex-end" mt={2}>
                                    <Button onClick={handleCloseModal} sx={{ mr: 2 }}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSubmitMileage} variant="contained" color="primary">
                                        Submit
                                    </Button>
                                </Box>
                            </Box>
                        </Modal>
                    </Box>
                ) : (
                    <Typography variant="body1">Loading car details...</Typography>
                )}
            </Container>
        </Layout>
    );
}