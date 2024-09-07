import { SignUp } from "@clerk/nextjs";
import { Box, Typography } from "@mui/material";

export default function SignUpPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundColor: "#f0f4f8",
        padding: "2rem",
      }}
    >
      {/* Logo or Brand Name */}
      <Typography
        variant="h2"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "#333",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        Welcome to MechaniCare
      </Typography>

      {/* Clerk Sign-Up Component */}
      
        <SignUp
          path="/sign-up"
          routing="path"
          signUpUrl="/sign-up"
        />
      

      {/* Footer Text */}
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          color: "#888",
        }}
      >
        Already have an account?{" "}
        <a href="/sign-in" style={{ color: "#007bff" }}>
          Sign in here
        </a>
      </Typography>
    </Box>
  );
}