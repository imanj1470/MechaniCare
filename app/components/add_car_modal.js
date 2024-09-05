import React, { useState } from 'react'
import { Modal, Box, TextField, Button, Typography, Paper, Grid2} from "@mui/material"
import { Tsukimi_Rounded } from 'next/font/google'

const AddCarModal = () => {
    const [open, setOpen] = useState(false)
    const [vin, setVin] = useState("")
    const [vinAttributes, setAttributes] = useState()
    const [recalls, setRecalls] = useState()

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setOpen(false);
        try {
            const response = await fetch('/api/vehicle_scrape', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ vin }),
            });
        
            if (!response.ok) {
              const text = await response.text();
              console.error('Error response:', text);
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const result = await response.json();

            var attributes_list = [];

            Object.keys(result.message).forEach(function(key) { //iterating through the attributes because useState wont render objects. Uses the attributes list to allow for display
                if (result.message[key] && result.message[key] !== 'Not Applicable' && key !== "Recalls") {
                  attributes_list.push(`${key}: ${result.message[key]} \n`);
                } else {
                  console.log("EQUALS NULL");
                }
            });
            console.log(result.message.Recalls)

            var recall_list = [];

            Object.keys(result.message.Recalls).map(function(key) {  //iterating through the recalls and appending them to the list for display
              Object.keys(result.message.Recalls[key]).map(function(index) {
                recall_list.push(`${index}: \n ${result.message.Recalls[key][index]}  \n`);
              
            })});
            console.log(recall_list)
            if (result.success) {
              setAttributes(attributes_list);
              setRecalls(recall_list)
              console.log(attributes_list)
            } else {
              console.error('Scraping failed:', result.error);
            }
          } catch (error) {
            console.error('Error sending data to API:', error);
          }
        };


    return (
      <div>
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



        <Box mt={3}>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Add Car
            </Button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-car-modal-title"
                aria-describedby="add-car-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="add-car-modal-title" variant="h6" component="h2" gutterBottom>
                        Add New Car
                    </Typography>

                    <TextField
                        fullWidth
                        label="Enter VIN"
                        variant="outlined"
                        value={vin}
                        onChange={(e) => setVin(e.target.value)}
                        sx={{ marginBottom: '1.5rem' }}
                    />

                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Modal>
        </Box>
        </div>
    )
    
}

export { AddCarModal }
