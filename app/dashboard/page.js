"use client"
//import { Layout } from "./components/header.js"
import { Box, Grid2, Paper, Typography, Button, List } from "@mui/material";
import { useRouter } from 'next/navigation';
import { AddCarModal } from "../components/add_car_modal.js"
import { Layout, Loading } from "../components/Layout.js";
import { useUser, useAuth } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import { fetchRecommendations } from '../components/fetchRecommendations.js';
export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [recommendations, setRecommendations] = useState([]);
  const [cars, setCars] = useState([])

 
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    } else if (isLoaded && isSignedIn && user?.id) {
      // Fetch cars and recommendations when the user is signed in and loaded
      fetchCars();
      fetchUserRecommendations(user.id);
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded || !isSignedIn) {
    // Optionally, show a loading state while checking the user status
    <Loading />
  }

  const handleCarClick = (id) => {
    router.push(`/car?id=${id}`)
  }

  const fetchUserRecommendations = async (userId) => {
    try {
      const data = await fetchRecommendations(userId);
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } 
  };

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
      const mileage = item.mileage || "Unknown";
      // Return the details in JSON format
      return {
        vin,
        make,
        model,
        year,
        mileage
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
                <p>Mileage: {car.mileage}</p>
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
              <Box p={2}>
                <Typography variant="h5" gutterBottom>
                  Your Recommendations
                </Typography>
                <List>
                  {recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={rec.text}
                        secondary={`Date: ${new Date(rec.date).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Paper>
          </Grid2>
        </Grid2>

        <AddCarModal onCarAdded={fetchCars} />
      </Box>
    </Layout>
  )
}