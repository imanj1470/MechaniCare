"use client"
import {
  SignInButton, useUser, useAuth
} from '@clerk/nextjs';
import "@fontsource/poppins"; // Defaults to weight 400
import { Box, Container, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import { WaveSVG } from "./components/wave";
import "./globals.css";
import {Button} from "@mui/material"

require('dotenv').config({ path: '.env.local' });

export default function Page() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser()
  return (
    <>

      <WaveSVG style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 'auto' }} />

      <Container
        maxWidth="md"
        padding={2}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          mt: { xs: '-50px', sm: '-100px' }, // Adjust for different screen sizes
          pt: { xs: '50px', sm: '100px' } // Adjust for different screen sizes
        }}
      >

        <Box sx={{ mb: 0 }}>
          <Typography variant="h4" gutterBottom mt={0} sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Transform Your Vehicle Maintenance Experience with our AI assistant <b>MechaniCare</b>
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Personalized maintenance reminders, predictive insights, and expert recommendations tailored to your vehicle for peace of mind.
          </Typography>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <img
              src="/newspanner.png"
              alt="Spanner Image"
              style={{
                width: '100%',       // Make the image take up full width of its container
                maxWidth: '400px',   // Set a max width so it doesn't get too large on big screens
                height: 'auto'       // Maintain aspect ratio
              }}
            />
          </Box>

          <Box sx={{ mt: 4 }}>
            <Typography variant="body1" color="textSecondary" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Sign up today for unlimited maintainance support.
            </Typography>

            <Button onClick={() => {
              if (!isSignedIn) {

                router.push('/sign-up')
              } else {
                router.push('/dashboard')
              }
            }
            } variant="contained" color="primary" sx={{ mt: 2, backgroundColor: "white", color: "black", borderRadius: 2, paddingLeft: 2.5, paddingRight: 2.5, fontSize: 16, textTransform: "none", '&:hover': { backgroundColor: "#DCDCDC", color: "black" }, }}
            >Try now</Button>


          </Box>
        </Box>

        <Box sx={{ mt: 5, textAlign: 'left' }}>
          <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            Why Choose MechaniCare?
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            MechaniCare helps you stay on top of your vehicle's maintenance needs with:
          </Typography>
          <ul style={{ paddingLeft: '20px' }}>
            <li><strong>Predictive Alerts:</strong> Stay ahead of potential issues based on the car's history and common faults.</li>
            <li><strong>VIN and Number Plate Based Insights:</strong> Get personalized maintenance predictions tailored to your vehicle.</li>
            <li><strong>Service Recommendations:</strong> Find trusted mechanics nearby, complete with reviews.</li>
            <li><strong>Maintenance History Tracking:</strong> Keep all your vehicle’s maintenance records in one place.</li>
          </ul>
        </Box>

        <Box sx={{ mt: 5, textAlign: 'left' }}>
          <Typography variant="h5" gutterBottom sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            How It Works
          </Typography>
          <Box sx={{ mt: 0, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <Box sx={{ flexBasis: '100%', sm: '45%', mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                1. Enter Your VIN or Number Plate
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Input your vehicle's VIN or Plate to generate a detailed profile with maintenance history, recalls, and more.
              </Typography>
            </Box>
            <Box sx={{ flexBasis: '100%', sm: '45%', mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                2. Receive Predictions
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Get predictive maintenance alerts based on your vehicle’s specific data and common issues reported by other users.
              </Typography>
            </Box>
            <Box sx={{ flexBasis: '100%', sm: '45%', mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                3. Stay Informed
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Receive timely reminders and expert advice, so you’re never caught off guard by a maintenance need.
              </Typography>
            </Box>
            <Box sx={{ flexBasis: '100%', sm: '45%', mb: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                4. Drive with Confidence
              </Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                With all the insights and tools at your fingertips, you can maintain your vehicle with ease and confidence.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
            © {new Date().getFullYear()} MechaniCare. All rights reserved.
          </Typography>
        </Box>
      </Container>

    </>
  )
}


