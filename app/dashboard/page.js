"use client"
//import { Layout } from "./components/header.js"
import { Box, Grid2, Paper, Typography } from "@mui/material";
import { useState } from 'react';
import { AddCarModal } from "../components/add_car_modal.js"
import { Layout } from "../components/Layout.js";

export default function Home() {
  //const router = useRouter();
  const [vinAttributes, setvinAttributes] = useState("")
  const [recalls, setrecalls] = useState("")
  return (
    <Layout>

      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">

        {/* <AddCarModal/> */}

        <Grid2 container spacing={2}>
          <Grid2 item xs={6}>
          <Paper
              elevation={3}
              sx={{
                padding: "2rem",
                width: "600px",
                textAlign: "center",
                backgroundColor: "white",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Car Attributes
              </Typography>
              <div> {vinAttributes}</div>
          </Paper>
          </Grid2>
          <Grid2 item xs={6}>
          <Paper
              elevation={3}
              sx={{
                padding: "2rem",
                width: "600px",
                textAlign: "center",
                backgroundColor: "white",
              }}
            >
              <Typography variant="h5" gutterBottom>
                Recalls
              </Typography>
              <div> {recalls}</div>
          </Paper>
          </Grid2>
        </Grid2>
        

        <AddCarModal/> 

      </Box>
    </Layout>
  )
}