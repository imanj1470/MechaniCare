"use client";

import { useUser } from "@clerk/nextjs";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Loading } from "../components/Layout.js"; // Ensure the path is correct
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.js" // Ensure this path is correct

import { useSearchParams } from "next/navigation"

export default function Car() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [carDetails, updateCarDetails] = useState([]);
    const router = useRouter(); // Initialize useRouter
    const searchParams = useSearchParams()
    const search = searchParams.get("id")
    


    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/');
        }
    }, [isLoaded, isSignedIn, router]);

    useEffect(() => {
        async function getCarDetails() {    
            if (!search) {
                console.error('VIN is required.');
                return;
            }
    
            try {
                // Reference to the specific VIN document in the `vin_records` collection
                const vinDocRef = doc(db, 'vin_records', search);
            
                // Fetch the VIN document
                const vinDoc = await getDoc(vinDocRef);
            console.log(vinDoc)
                // Check if the document exists and prepare the car details
                if (vinDoc.exists()) {
                    const vinData = vinDoc.data();
                    const carDetails = {
                        vin: search,
                        attributes: vinData.attributes, // Access attributes from the document data
                        recalls: vinData.recalls,       // Access recalls from the document data
                    };
            
                    // Store the details in state or handle them as needed
                    updateCarDetails([carDetails]);
                    console.log('Fetched car details:', carDetails);
                } else {
                    console.error('VIN document not found.');
                }
            
            } catch (error) {
                console.error('Error fetching car details:', error.message);
            }
        };
    
        getCarDetails();
    }, [search]);

    if (!isLoaded || !isSignedIn) {
        return <Loading />;
    }

    return (
        <Layout>
            <Box padding={2}>
            <Typography variant="h4" gutterBottom>
                Car Details
            </Typography>
            {carDetails.length > 0 ? (
                <Grid2 container spacing={2}>
                    {carDetails.map((car, index) => (
                        <Grid2 item="true" xs={12} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    padding: "2rem",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    backgroundColor: "white",
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    VIN: {car.vin}
                                </Typography>
                                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                    <strong>Make:</strong> {car.attributes.Make}
                                </Typography>
                                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                    <strong>Model:</strong> {car.attributes.Model}
                                </Typography>
                                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                    <strong>Year:</strong> {car.attributes.Year || "Unknown"}
                                </Typography>
                                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                    <strong>Color:</strong> {car.attributes.Color || "Not specified"}
                                </Typography>
                                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                                    <strong>Engine:</strong> {car.attributes.Engine || "Not specified"}
                                </Typography>
                                <Typography variant="body1" sx={{ marginTop: 2 }}>
                                    <strong>Recalls:</strong> {car.recalls.Component}
                                </Typography>
                                {/* Add more fields if needed */}
                            </Paper>
                        </Grid2>
                    ))}
                </Grid2>
            ) : (
                <Typography variant="body1">No car details available.</Typography>
            )}
        </Box>
        </Layout>
    );
}