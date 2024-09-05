"use client"
import { Layout } from "./components/header.js"
import {AddCarModal} from "./components/add_car_modal.js"

import { Box, Typography, Paper, Button } from "@mui/material"

export default function Home() {
  return (
    <Layout>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Paper
          elevation={3}
          sx={{
            padding: "2rem",
            width: "300px",
            textAlign: "center",
            backgroundColor: "white",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Car Attributes
          </Typography>
          <Typography variant="body1">
            <strong>Make:</strong> Tesla
          </Typography>
          <Typography variant="body1">
            <strong>Model:</strong> Model S
          </Typography>
          <Typography variant="body1">
            <strong>Year:</strong> 2024
          </Typography>
          <Typography variant="body1">
            <strong>Color:</strong> Red
          </Typography>
          <Typography variant="body1">
            <strong>VIN:</strong> 1G1JC1444PZ215071
          </Typography>
        </Paper>

        <AddCarModal/>

      </Box>
    </Layout>
  )
}