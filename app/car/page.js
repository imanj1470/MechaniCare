"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Layout, Loading } from "../components/Layout.js"; // Ensure the path is correct

import { useSearchParams } from "next/navigation";
import { Container, Typography, List, ListItem, ListItemText, Alert, Box, IconButton, Grid2 } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Import the dropdown icon
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
export default function Car() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [carDetails, setCarDetails] = useState(null);
    const router = useRouter(); // Initialize useRouter
    const searchParams = useSearchParams()
    const search = searchParams.get("id")
    const [error, setError] = useState(null);
    const [showAttributes, setShowAttributes] = useState(false);
    const [showRecalls, setShowRecalls] = useState(false);

    const handleToggleAttributes = () => setShowAttributes(prev => !prev);
    const handleToggleRecalls = () => setShowRecalls(prev => !prev);

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/');
        }
    }, [isLoaded, isSignedIn, router]);

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
                console.log('Fetched VIN Data:', data);

                const vins = data.data
                console.log("vins", vins)

                const foundCar = vins.find(record => record.vin === search);
                if (foundCar) {
                    console.log("Found car:", foundCar);
                    setCarDetails(foundCar)
                } else {
                    console.log("No car found with this VIN");
                }

            } catch (error) {
                console.error('Error fetching VIN data:', error.message);
            }
        }
        getCarDetails();
    }, [search]);

    if (!isLoaded || !isSignedIn) {
        return <Loading />;
    }

    const handleClickOutside = (event) => {
        if (attributesRef.current && !attributesRef.current.contains(event.target)) {
            setShowAttributes(false);
        }
        if (recallsRef.current && !recallsRef.current.contains(event.target)) {
            setShowRecalls(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Layout>

            <Container>
                {error && <Alert severity="error">{error}</Alert>}

                {carDetails ? (
                    <Box mt={4}>
                        <Typography variant="h4" gutterBottom>
                            Car Details for VIN: {search}
                        </Typography>

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
                    </Box>
                ) : (
                    <Typography variant="body1">Loading car details...</Typography>
                )}
            </Container>
        </Layout>
    );
}