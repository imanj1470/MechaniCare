import { Inter } from "next/font/google";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Modal, Box, TextField, Button, Typography, Paper, Grid2 } from "@mui/material"
import {
  ClerkProvider
} from '@clerk/nextjs'


const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: "MechaniCare",
  description: "AI Mechanic Buddy",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Metadata such as title and description */}
          <meta name="description" content={metadata.description} />
          <title>{metadata.title}</title>
        </head>
        <body className={poppins.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}