import { SignIn } from "@clerk/nextjs";
import { Box, Typography } from "@mui/material";

export default function SignIpPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        backgroundColor: "#47ADF6",
        padding: "2rem",
      }}
    >
      {/* Logo or Brand Name */}
      <Typography
        variant="h2"
        sx={{
          mb: 4,
          fontWeight: "bold",
          color: "#F0F5F9",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Welcome to MechaniCare
      </Typography>

      {/* Sign-in Component */}
      <Box
        sx={{
          backgroundColor: "#ffffff",
          padding: "2rem",
          borderRadius: 2,
          boxShadow: 3,
          maxWidth: "50%",
          width: "100%",
          border: `1px solid #0099ff`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/dashboard"
          style={{ width: '100%' }}
        />
      </Box>

       {/* Footer Text */}
       <Typography
        variant="body2"
        sx={{
          mt: 3,
          color: "#ffffff",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        Dont have an account?{" "}
        <a href="/sign-up" style={{ color: "#1FFF01", textDecoration: "none", fontWeight: 'bold' }}>
          Sign up here
        </a>
      </Typography>
    </Box>
  );
}