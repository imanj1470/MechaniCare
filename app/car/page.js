"use client";

import { useUser } from "@clerk/nextjs";
import { Box, Grid2, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Layout, Loading } from "../components/Layout.js"; // Ensure the path is correct
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Ensure this path is correct

export default function Car() {
    const { isLoaded, isSignedIn } = useUser();
    const [carDetails, updateCarDetails] = useState([]);
    const router = useRouter(); // Initialize useRouter

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/');
        }
    }, [isLoaded, isSignedIn, router]);

    useEffect(() => {
        const fetchCarDetails = async () => {
            // Check if the router.query is available
            const search = router.query?.id;

            if (!search) {
                console.error('VIN is required.');
                return;
            }

            try {
                // Reference to the specific VIN document in the `vin_records` collection
                const vinDocRef = doc(db, 'vin_records', search);

                // Reference to the attributes and recalls subcollections
                const attributesDocRef = doc(vinDocRef, 'attributes');
                const recallsDocRef = doc(vinDocRef, 'recalls');

                // Fetch the attributes and recalls documents
                const [attributesDoc, recallsDoc] = await Promise.all([
                    getDoc(attributesDocRef),
                    getDoc(recallsDocRef)
                ]);

                // Check if documents exist and prepare the car details
                if (attributesDoc.exists() && recallsDoc.exists()) {
                    const carDetails = {
                        vin: search,
                        attributes: attributesDoc.data(),
                        recalls: recallsDoc.data(),
                    };

                    // Store the details in state or handle them as needed
                    updateCarDetails([carDetails]);
                    console.log(carDetails);
                } else {
                    console.error('Attributes or recalls document not found.');
                }

            } catch (error) {
                console.error('Error fetching car details:', error.message);
            }
        };

        // Only fetch car details if router.query is defined
        if (router.query?.id) {
        
            fetchCarDetails();
            console.log(carDetails)
        }
    }, [router.query]);

    if (!isLoaded || !isSignedIn) {
        return <Loading />;
    }

    return (
        <Layout>
            <Box padding={2}>
            <Typography variant="h4" gutterBottom>
                Car Details
            </Typography>
            <Grid2 container spacing={2}>
                {carDetails.map((car, index) => (
                    <Grid2 item xs={12} sm={6} md={4} key={index}>
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
                            <Typography variant="body1">
                                <strong>Make:</strong> {car.attributes.Make}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Model:</strong> {car.attributes.Model}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Year:</strong> {car.attributes.Year || "Unknown"}
                            </Typography>
                            <Typography variant="body1" sx={{ marginTop: 2 }}>
                                <strong>Recalls:</strong> {car.recalls.Component || "None"}
                            </Typography>
                        </Paper>
                    </Grid2>
                ))}
            </Grid2>
        </Box>
        </Layout>
    );
}