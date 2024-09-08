import React, { useState } from 'react'
import { Modal, Box, TextField, Button, Typography, Paper, Grid2} from "@mui/material"

const AddCarModal = ({ onCarAdded }) => {
    const [open, setOpen] = useState(false)
    const [vin, setVin] = useState("")
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const sendVinData = async (vin ,car_data) => {
        try {
          const response = await fetch('/api/store_data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ vin, apiResponse: car_data }),
          });
      
          const data = await response.json();
      
          if (response.ok) {
            try {
              const response = await fetch(`/api/store_pinecone?vin=${vin}`, {
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
          } else {
            console.error('Error storing data:', data.message);
            // Handle error (e.g., show an error message to the user)
          }
        } catch (error) {
          console.error('Request failed:', error);
          // Handle request failure (e.g., network issues)
        }
      };

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
            sendVinData(vin, result)
            
            if (onCarAdded) {
              onCarAdded(); // <-- Trigger fetchCars after adding the car
            }
          } catch (error) {
            console.error('Error sending data to API:', error);
          }
        };



    return (
      <div>

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
