import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import {Page} from "./landing_page.js"
import { Modal, Box, TextField, Button, Typography, Paper, Grid2} from "@mui/material"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "MechaniCare",
  description: "AI Mechanic Buddy",
};

export default function RootLayout({ children }) {

  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${poppins.className}`}>
        {/* Signed Out: Show SignIn Button */}
        <SignedOut>
          <SignInButton />
          <Page/>
          
        </SignedOut>

        {/* Signed In: Show layout with Box */}
        <SignedIn>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-start"
            height="100vh"
            width="100vw"
            sx={{ backgroundColor: "#f5f5f5", position: "relative" }}
          >
            {/* Header */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              height="70px"
              sx={{ backgroundColor: "lightblue", padding: "0 2rem" }}
            >
              <Typography variant="h4" color="black">
                MechaniCare
              </Typography>

              <Box display="flex" gap={3}>
                <Typography variant="h6" color="black">
                  Dashboard
                </Typography>
                <Typography variant="h6" color="black">
                  AI Chatbot
                </Typography>

                {/* User Button for Sign Out */}
                <UserButton />
              </Box>
            </Box>

            {/* Content Area */}
            <Box
              flex={1}
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ padding: "2rem" }}
            >
              {children}
            </Box>
          </Box>
        </SignedIn>
      </body>
    </html>
  </ClerkProvider>
  );
}//className={`${poppins.className}`}