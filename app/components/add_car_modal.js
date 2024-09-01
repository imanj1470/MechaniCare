import React, { useState } from 'react'
import { Modal, Box, TextField, Button, Typography } from "@mui/material"

const AddCarModal = () => {
    const [open, setOpen] = useState(false)
    const [vin, setVin] = useState("")
    const [scrapedData, setScrapedData] = useState()

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            if (result.success) {
              setScrapedData(result.data);
            } else {
              console.error('Scraping failed:', result.error);
            }
          } catch (error) {
            console.error('Error sending data to API:', error);
          }
        };


    return (
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
    )
}

export { AddCarModal }
