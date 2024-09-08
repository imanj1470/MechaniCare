"use client"
//import { Layout } from "./components/header.js"
import { Box, Grid2, Paper, Typography, Button } from "@mui/material";
import { useRouter } from 'next/navigation';
import { AddCarModal } from "../components/add_car_modal.js"
import { Layout, Loading } from "../components/Layout.js";
import { useUser, useAuth } from "@clerk/nextjs"
import { useState, useEffect } from "react"

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  const [cars, setCars] = useState([])

  useEffect(() => {
    fetchCars();
  }, [])

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    // Optionally, show a loading state while checking the user status
    <Loading />
  }

  const handleCarClick = (id) => {
    router.push(`/car?id=${id}`)
}

  const fetchCars = async () => {
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

      if (data.success) {
        updateCarDetails(data.data)

      } else {
        console.error('Error fetching data:', data.message);
      }
    } catch (error) {
      console.error('Error fetching VIN data:', error.message);
    }
  };

  const updateCarDetails = (data) => {
    // Initialize an array to hold the extracted details
    const carDetails = data.map(item => {
      // Extract details from each item
      const vin = item.vin;
      const make = item.attributes.Make;
      const model = item.attributes.Model;
      // Assume year is not provided in your current data structure, use a placeholder or fetch from elsewhere
      const year = item.attributes.Year || "Unknown";

      // Return the details in JSON format
      return {
        vin,
        make,
        model,
        year
      };
    });

    // Convert the array of details to JSON
    setCars(carDetails)
  };

  return (
    <Layout>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Grid2 container spacing={2}>

          {/* Render each car's details in its own Paper component */}
          {cars.map((car, index) => (
            <Grid2 item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  padding: "2rem",
                  width: "100%",
                  textAlign: "center",
                  backgroundColor: "white",
                }}
                onClick={() => {
                  handleCarClick(car.vin)
              }}
              >
                <Typography variant="h6" gutterBottom>
                  Car Details
                </Typography>
                <p>VIN: {car.vin}</p>
                <p>Make: {car.make}</p>
                <p>Model: {car.model}</p>
                <p>Year: {car.year}</p>
                <Button>Details</Button>
              </Paper>
              
            </Grid2>
          ))}

          <Grid2 item xs={12}>
            <Paper
              elevation={3}
              sx={{
                padding: "2rem",
                width: "100%",
                textAlign: "center",
                backgroundColor: "white",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Upcoming Service
              </Typography>
              <div>Oil change: 20 days</div>
            </Paper>
          </Grid2>
        </Grid2>

        <AddCarModal />
      </Box>
    </Layout>
  )
}