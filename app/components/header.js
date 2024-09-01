import { Box, Typography } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      height="100vh"
      width="100vw"
      sx={{ backgroundColor: "#f5f5f5", position: "relative" }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ backgroundColor: "lightblue", height: "15vh", padding: "0 2rem" }}
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
        </Box>
      </Box>


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
  );
};

export { Layout };