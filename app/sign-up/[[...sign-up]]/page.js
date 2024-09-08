import { SignUp } from "@clerk/nextjs";
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

      <Box
        sx={{
          backgroundColor: "#ffffff",
          padding: "1rem",
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
          border: `1px solid #0099ff`,
          display: 'flex',
          justifyContent: 'center', // Center content vertically
          alignItems: 'center', // Center content horizontally
          height: "15vh", // Adjust height as needed
          mb: 2,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            color: "#1C1B1B",
            fontFamily: "'Poppins', sans-serif",
            textAlign: 'center', // Ensure text is centered
            lineHeight: "1.2", // Tweak line height for better centering
          }}
        >
          Welcome to MechaniCare
        </Typography>
      </Box>

      {/* Sign-Up Component */}
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
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/dashboard"
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
        Already got an account?{" "}
        <a href="/sign-in" style={{ color: "#1FFF01", textDecoration: "none", fontWeight: 'bold' }}>
          Sign in here
        </a>
      </Typography>
    </Box>
  );
}